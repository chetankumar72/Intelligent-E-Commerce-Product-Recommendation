import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const InteractionContext = createContext();

export function InteractionProvider({ children }) {
  const { currentUser } = useAuth();
  const userId = currentUser ? currentUser.id : 'guest';

  // Load interactions for the current user
  const [interactions, setInteractions] = useState(() => {
    try {
      const saved = localStorage.getItem(`nexashop_interactions_${userId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load user interactions:', e);
    }
    // If not found in localStorage, use persona's initial preset interactions
    return currentUser?.interactions || [];
  });

  const [recentlyViewedIds, setRecentlyViewedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`nexashop_recent_${userId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load recent products:', e);
    }
    const initialViewed = (currentUser?.interactions || [])
      .filter(i => i.type === 'view')
      .map(i => i.productId);
    return Array.from(new Set(initialViewed));
  });

  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(`nexashop_search_${userId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load search history:', e);
    }
    return (currentUser?.interactions || [])
      .filter(i => i.type === 'search')
      .map(i => i.query);
  });

  // Whenever currentUser changes, re-sync state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`nexashop_interactions_${userId}`);
      if (saved) {
        setInteractions(JSON.parse(saved));
      } else {
        setInteractions(currentUser?.interactions || []);
      }

      const savedRecent = localStorage.getItem(`nexashop_recent_${userId}`);
      if (savedRecent) {
        setRecentlyViewedIds(JSON.parse(savedRecent));
      } else {
        const initialViewed = (currentUser?.interactions || [])
          .filter(i => i.type === 'view')
          .map(i => i.productId);
        setRecentlyViewedIds(Array.from(new Set(initialViewed)));
      }

      const savedSearch = localStorage.getItem(`nexashop_search_${userId}`);
      if (savedSearch) {
        setSearchHistory(JSON.parse(savedSearch));
      } else {
        setSearchHistory(
          (currentUser?.interactions || [])
            .filter(i => i.type === 'search')
            .map(i => i.query)
        );
      }
    } catch (e) {
      console.warn('Failed to switch user interactions:', e);
    }
  }, [userId, currentUser]);

  // Persist interactions
  useEffect(() => {
    try {
      localStorage.setItem(`nexashop_interactions_${userId}`, JSON.stringify(interactions));
    } catch (e) {
      console.warn('Failed to save interactions:', e);
    }
  }, [interactions, userId]);

  // Persist recent views
  useEffect(() => {
    try {
      localStorage.setItem(`nexashop_recent_${userId}`, JSON.stringify(recentlyViewedIds));
    } catch (e) {
      console.warn('Failed to save recent:', e);
    }
  }, [recentlyViewedIds, userId]);

  // Record an interaction event
  const recordEvent = useCallback((event) => {
    const enrichedEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      ...event
    };

    setInteractions(prev => [enrichedEvent, ...prev]);

    if (event.type === 'view' && event.productId) {
      setRecentlyViewedIds(prev => {
        const filtered = prev.filter(id => id !== event.productId);
        return [event.productId, ...filtered].slice(0, 12);
      });
    }

    if (event.type === 'search' && event.query) {
      setSearchHistory(prev => {
        const clean = event.query.trim().toLowerCase();
        const filtered = prev.filter(q => q.toLowerCase() !== clean);
        return [event.query.trim(), ...filtered].slice(0, 10);
      });
    }

    return enrichedEvent;
  }, []);

  const trackView = useCallback((productId, productName) => {
    return recordEvent({ type: 'view', productId, productName });
  }, [recordEvent]);

  const trackSearch = useCallback((query) => {
    if (!query || !query.trim()) return;
    return recordEvent({ type: 'search', query: query.trim() });
  }, [recordEvent]);

  const trackCart = useCallback((productId, productName) => {
    return recordEvent({ type: 'cart', productId, productName });
  }, [recordEvent]);

  const trackWishlist = useCallback((productId, productName, isAdded) => {
    return recordEvent({
      type: isAdded ? 'wishlist' : 'unwishlist',
      productId,
      productName
    });
  }, [recordEvent]);

  const trackPurchase = useCallback((productIds) => {
    const ids = Array.isArray(productIds) ? productIds : [productIds];
    ids.forEach(id => {
      recordEvent({ type: 'purchase', productId: id });
    });
  }, [recordEvent]);

  // Reset all interactions for current user (to test cold-start)
  const resetInteractions = useCallback(() => {
    setInteractions([]);
    setRecentlyViewedIds([]);
    setSearchHistory([]);
    try {
      localStorage.removeItem(`nexashop_interactions_${userId}`);
      localStorage.removeItem(`nexashop_recent_${userId}`);
      localStorage.removeItem(`nexashop_search_${userId}`);
    } catch (e) {
      console.warn('Error clearing interactions:', e);
    }
  }, [userId]);

  // Compute interaction breakdown metrics
  const getStats = useCallback(() => {
    let views = 0;
    let searches = 0;
    let carts = 0;
    let purchases = 0;
    let wishlists = 0;

    interactions.forEach(i => {
      if (i.type === 'view') views++;
      else if (i.type === 'search') searches++;
      else if (i.type === 'cart') carts++;
      else if (i.type === 'purchase') purchases++;
      else if (i.type === 'wishlist') wishlists++;
    });

    return {
      total: interactions.length,
      views,
      searches,
      carts,
      purchases,
      wishlists
    };
  }, [interactions]);

  return (
    <InteractionContext.Provider
      value={{
        interactions,
        recentlyViewedIds,
        searchHistory,
        trackView,
        trackSearch,
        trackCart,
        trackWishlist,
        trackPurchase,
        resetInteractions,
        getStats
      }}
    >
      {children}
    </InteractionContext.Provider>
  );
}

export function useInteractions() {
  const context = useContext(InteractionContext);
  if (!context) {
    throw new Error('useInteractions must be used within InteractionProvider');
  }
  return context;
}

