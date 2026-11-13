import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useInteractions } from './InteractionContext';

const WishlistContext = createContext();

const WISHLIST_STORAGE_KEY = 'nexashop_wishlist_ids_v2';

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load wishlist:', e);
    }
    return [];
  });

  const { trackWishlist } = useInteractions();

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn('Failed to save wishlist:', e);
    }
  }, [wishlistIds]);

  const toggleWishlist = useCallback((product) => {
    if (!product || !product.id) return;
    setWishlistIds(prev => {
      const exists = prev.includes(product.id);
      const isAdding = !exists;
      trackWishlist(product.id, product.name, isAdding);

      if (exists) {
        return prev.filter(id => id !== product.id);
      } else {
        return [...prev, product.id];
      }
    });
  }, [trackWishlist]);

  const isInWishlist = useCallback((productId) => {
    return wishlistIds.includes(productId);
  }, [wishlistIds]);

  const removeFromWishlist = useCallback((productId) => {
    setWishlistIds(prev => prev.filter(id => id !== productId));
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount: wishlistIds.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}

