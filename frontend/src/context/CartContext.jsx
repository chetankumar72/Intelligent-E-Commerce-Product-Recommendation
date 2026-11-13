import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useInteractions } from './InteractionContext';

const CartContext = createContext();

const CART_STORAGE_KEY = 'nexashop_cart_items_v2';

export const AVAILABLE_COUPONS = {
  'AI20': { code: 'AI20', discountPercent: 20, description: 'AI Recommender 20% Off Launch Special' },
  'SAVE10': { code: 'SAVE10', discountPercent: 10, description: '10% Savings on Entire Order' },
  'WELCOME50': { code: 'WELCOME50', discountPercent: 15, maxDiscount: 50, description: 'Welcome Gift: 15% Off (up to $50)' },
  'FREESHIP': { code: 'FREESHIP', freeShipping: true, description: 'Complimentary Express Delivery' }
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load cart:', e);
    }
    return [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const { trackCart } = useInteractions();

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart:', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stock || 99)
        };
        return updated;
      } else {
        return [...prev, { ...product, quantity: Math.min(quantity, product.stock || 99) }];
      }
    });

    // Track in AI Interaction engine
    trackCart(product.id, product.name);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return {
              ...item,
              quantity: Math.max(0, Math.min(newQty, item.stock || 99))
            };
          }
          return item;
        })
        .filter(item => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponError('');
  };

  const applyCoupon = (code) => {
    const cleanCode = code ? code.trim().toUpperCase() : '';
    setCouponError('');
    if (!cleanCode) {
      setCouponError('Please enter a coupon code.');
      return false;
    }
    const found = AVAILABLE_COUPONS[cleanCode];
    if (found) {
      setAppliedCoupon(found);
      return true;
    } else {
      setCouponError('Invalid code. Try "AI20" or "SAVE10".');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // Financial calculations
  const totals = useMemo(() => {
    const rawSubtotal = cartItems.reduce((acc, item) => {
      const price = item.discountedPrice || item.price;
      return acc + price * item.quantity;
    }, 0);

    const originalSubtotal = cartItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const productDiscountSavings = originalSubtotal - rawSubtotal;

    let couponDiscount = 0;
    if (appliedCoupon && appliedCoupon.discountPercent) {
      couponDiscount = Math.round((rawSubtotal * appliedCoupon.discountPercent) / 100);
      if (appliedCoupon.maxDiscount && couponDiscount > appliedCoupon.maxDiscount) {
        couponDiscount = appliedCoupon.maxDiscount;
      }
    }

    // Shipping: Free if rawSubtotal >= 150 or coupon has freeShipping
    let shipping = rawSubtotal > 0 ? (rawSubtotal >= 150 || appliedCoupon?.freeShipping ? 0 : 15) : 0;

    // Estimated tax 7%
    const taxableAmount = Math.max(0, rawSubtotal - couponDiscount);
    const tax = Math.round(taxableAmount * 0.07);

    const finalTotal = Math.max(0, taxableAmount + shipping + tax);
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return {
      originalSubtotal,
      rawSubtotal,
      productDiscountSavings,
      couponDiscount,
      shipping,
      tax,
      finalTotal,
      totalItems
    };
  }, [cartItems, appliedCoupon]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        ...totals
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

