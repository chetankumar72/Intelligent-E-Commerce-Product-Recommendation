import React, { createContext, useContext, useState, useMemo } from 'react';
import { useProducts } from './ProductContext';
import { useInteractions } from './InteractionContext';
import { recommendationEngine } from '../ai/recommender';
import { tfidfEngine } from '../ai/tfidf';

const RecommendationContext = createContext();

export function RecommendationProvider({ children }) {
  const { products } = useProducts();
  const { interactions, recentlyViewedIds } = useInteractions();

  // Configurable weights for Hybrid Recommender
  const [contentWeight, setContentWeight] = useState(0.6);
  const [collabWeight, setCollabWeight] = useState(0.4);
  const [excludePurchased, setExcludePurchased] = useState(true);

  // Top personalized AI recommendations
  const recommendedProducts = useMemo(() => {
    return recommendationEngine.getRecommendations({
      allProducts: products,
      interactions,
      contentWeight,
      collabWeight,
      limit: 12,
      excludePurchased
    });
  }, [products, interactions, contentWeight, collabWeight, excludePurchased]);

  // Trending products
  const trendingProducts = useMemo(() => {
    return recommendationEngine.getTrendingProducts(products, 8);
  }, [products]);

  // Best sellers
  const bestSellers = useMemo(() => {
    return recommendationEngine.getBestSellers(products, 8);
  }, [products]);

  // Recently viewed product models
  const recentlyViewedProducts = useMemo(() => {
    return recentlyViewedIds
      .map(id => products.find(p => p.id === id))
      .filter(Boolean);
  }, [recentlyViewedIds, products]);

  // User category interest distribution for Recharts
  const categoryAffinityData = useMemo(() => {
    const counts = {};
    interactions.forEach(evt => {
      if (evt.productId) {
        const prod = products.find(p => p.id === evt.productId);
        if (prod && prod.category) {
          counts[prod.category] = (counts[prod.category] || 0) + 1;
        }
      }
    });

    const categories = Object.keys(counts);
    if (categories.length === 0) {
      // Default baseline preview for cold start
      return [
        { category: 'Laptops', score: 25 },
        { category: 'Headphones', score: 20 },
        { category: 'Smartphones', score: 18 },
        { category: 'Shoes', score: 15 },
        { category: 'Home Appliances', score: 12 },
        { category: 'Books', score: 10 }
      ];
    }

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return Object.entries(counts)
      .map(([category, count]) => ({
        category,
        count,
        score: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.score - a.score);
  }, [interactions, products]);

  // Top TF-IDF keywords for the user profile vector
  const userFeatureKeywords = useMemo(() => {
    const userVec = recommendationEngine.buildUserProfileVector(interactions, products);
    return tfidfEngine.getTopKeywords(userVec, 8);
  }, [interactions, products]);

  // Helper to fetch similar products for details page
  const getSimilarProducts = (productId, limit = 4) => {
    return recommendationEngine.getSimilarProducts(productId, products, limit);
  };

  return (
    <RecommendationContext.Provider
      value={{
        recommendedProducts,
        trendingProducts,
        bestSellers,
        recentlyViewedProducts,
        categoryAffinityData,
        userFeatureKeywords,
        contentWeight,
        collabWeight,
        setContentWeight,
        setCollabWeight,
        excludePurchased,
        setExcludePurchased,
        getSimilarProducts
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
}

export function useRecommendation() {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error('useRecommendation must be used within RecommendationProvider');
  }
  return context;
}

