import React, { createContext, useContext, useState, useEffect } from 'react';
import { useInteractions } from './InteractionContext';

const OrderContext = createContext();

const ORDERS_STORAGE_KEY = 'nexashop_user_orders_v2';

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load orders:', e);
    }
    // Initial sample orders for demonstration
    return [
      {
        orderId: 'ORD-729104',
        date: new Date(Date.now() - 3600000 * 48).toISOString(),
        items: [
          {
            id: 'prod_4',
            name: 'Keychron Q1 Pro Custom Wireless Mechanical Keyboard',
            price: 197,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80'
          }
        ],
        shippingAddress: {
          fullName: 'Alex Rivera',
          street: '742 Evergreen Terrace',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94107',
          country: 'United States'
        },
        paymentMethod: 'Credit Card (Simulated)',
        total: 212,
        status: 'Delivered',
        estimatedDelivery: 'Delivered 2 days ago'
      }
    ];
  });

  const { trackPurchase } = useInteractions();

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders:', e);
    }
  }, [orders]);

  const placeOrder = (orderData) => {
    const newOrder = {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      status: 'Processing',
      estimatedDelivery: 'Arriving in 2-3 business days',
      ...orderData
    };

    setOrders(prev => [newOrder, ...prev]);

    // Feed purchased products into AI recommendation engine!
    const productIds = (orderData.items || []).map(i => i.id);
    trackPurchase(productIds);

    return newOrder;
  };

  const getOrderById = (orderId) => {
    return orders.find(o => o.orderId === orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        getOrderById
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
}

