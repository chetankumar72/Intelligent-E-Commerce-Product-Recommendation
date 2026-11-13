/**
 * Hybrid Recommendation and Explainable AI Engine
 * Combines Content-Based (TF-IDF + Cosine Similarity) and Collaborative Filtering.
 */

import { tfidfEngine, buildProductCorpusText } from './tfidf';
import { collaborativeEngine, INTERACTION_WEIGHTS } from './collaborative';

export class RecommendationEngine {
  constructor() {
    this.defaultContentWeight = 0.6;
    this.defaultCollabWeight = 0.4;
  }

  /**
   * Synthesize a user interest vector from user interaction history
   * @param {Array} interactions - list of { type, productId, query, timestamp }
   * @param {Array} allProducts - full catalog
   * @returns {Map} normalized TF-IDF vector representing user's current tastes
   */
  buildUserProfileVector(interactions, allProducts) {
    if (!interactions || interactions.length === 0) {
      return new Map();
    }

    // Weight map of product -> accumulated engagement weight
    const productWeights = new Map();
    const searchQueries = [];

    // Process from oldest to newest with recency decay
    interactions.forEach((evt, idx) => {
      // Recency multiplier: earlier items slightly lower weight, newest full weight
      const recency = 0.7 + 0.3 * (idx / Math.max(1, interactions.length - 1));
      let actionWeight = 1.0;

      switch (evt.type) {
        case 'purchase':
          actionWeight = INTERACTION_WEIGHTS.PURCHASE;
          break;
        case 'cart':
          actionWeight = INTERACTION_WEIGHTS.CART;
          break;
        case 'wishlist':
          actionWeight = INTERACTION_WEIGHTS.WISHLIST;
          break;
        case 'like':
          actionWeight = INTERACTION_WEIGHTS.LIKE;
          break;
        case 'search':
          if (evt.query) searchQueries.push({ query: evt.query, weight: INTERACTION_WEIGHTS.SEARCH * recency });
          return;
        case 'view':
        default:
          actionWeight = INTERACTION_WEIGHTS.VIEW;
          break;
      }

      if (evt.productId) {
        const current = productWeights.get(evt.productId) || 0;
        productWeights.set(evt.productId, current + actionWeight * recency);
      }
    });

    // Aggregate term vectors from interacted products
    const userVector = new Map();
    let normSq = 0;

    productWeights.forEach((weight, prodId) => {
      const prodVector = tfidfEngine.productVectors.get(prodId);
      if (prodVector) {
        prodVector.forEach((tfidfVal, termIdx) => {
          const currentVal = userVector.get(termIdx) || 0;
          userVector.set(termIdx, currentVal + tfidfVal * weight);
        });
      }
    });

    // Also incorporate search queries
    searchQueries.forEach(({ query, weight }) => {
      const queryVec = tfidfEngine.vectorizeText(query);
      queryVec.forEach((tfidfVal, termIdx) => {
        const currentVal = userVector.get(termIdx) || 0;
        userVector.set(termIdx, currentVal + tfidfVal * weight);
      });
    });

    // L2 Normalize user vector
    userVector.forEach(val => {
      normSq += val * val;
    });

    const norm = Math.sqrt(normSq) || 1;
    const normalizedUserVector = new Map();
    userVector.forEach((val, termIdx) => {
      normalizedUserVector.set(termIdx, val / norm);
    });

    return normalizedUserVector;
  }

  /**
   * Build implicit user interaction dictionary for collaborative filtering
   */
  buildInteractionScores(interactions) {
    const scores = {};
    if (!interactions) return scores;

    interactions.forEach(evt => {
      if (!evt.productId) return;
      let val = 1.0;
      if (evt.type === 'purchase') val = INTERACTION_WEIGHTS.PURCHASE;
      else if (evt.type === 'cart') val = INTERACTION_WEIGHTS.CART;
      else if (evt.type === 'wishlist') val = INTERACTION_WEIGHTS.WISHLIST;
      else if (evt.type === 'like') val = INTERACTION_WEIGHTS.LIKE;
      else if (evt.type === 'view') val = INTERACTION_WEIGHTS.VIEW;

      scores[evt.productId] = Math.min(5.0, (scores[evt.productId] || 0) + val);
    });

    return scores;
  }

  /**
   * Generate explainable reasoning for a recommended product
   */
  generateExplanation({ product, contentSim, collabScore, interactions, allProducts, userCategoryCounts }) {
    const purchasedIds = new Set(
      interactions.filter(i => i.type === 'purchase').map(i => i.productId)
    );
    const wishlistIds = new Set(
      interactions.filter(i => i.type === 'wishlist').map(i => i.productId)
    );
    const cartIds = new Set(
      interactions.filter(i => i.type === 'cart').map(i => i.productId)
    );
    const viewedIds = new Set(
      interactions.filter(i => i.type === 'view').map(i => i.productId)
    );

    // 1. Direct wishlist similarity
    const wishlistMatch = Array.from(wishlistIds)
      .map(id => ({ id, sim: tfidfEngine.getProductSimilarity(product.id, id) }))
      .sort((a, b) => b.sim - a.sim)[0];

    if (wishlistMatch && wishlistMatch.sim > 0.45) {
      const matchProd = allProducts.find(p => p.id === wishlistMatch.id);
      return {
        badge: 'Wishlist Affinity',
        text: `Complementary to ${matchProd ? matchProd.name : 'items'} in your wishlist`,
        factor: 'content_wishlist',
        confidence: Math.round(wishlistMatch.sim * 100)
      };
    }

    // 2. Cart similarity
    const cartMatch = Array.from(cartIds)
      .map(id => ({ id, sim: tfidfEngine.getProductSimilarity(product.id, id) }))
      .sort((a, b) => b.sim - a.sim)[0];

    if (cartMatch && cartMatch.sim > 0.40) {
      const matchProd = allProducts.find(p => p.id === cartMatch.id);
      return {
        badge: 'Frequently Paired',
        text: `Frequently paired with ${matchProd ? matchProd.name : 'cart items'}`,
        factor: 'content_cart',
        confidence: Math.round(cartMatch.sim * 100)
      };
    }

    // 3. Category browsing dominance
    const topBrowsedCategory = Object.entries(userCategoryCounts || {})
      .sort((a, b) => b[1] - a[1])[0];

    if (topBrowsedCategory && topBrowsedCategory[0] === product.category && topBrowsedCategory[1] >= 2) {
      return {
        badge: 'Browsing Preference',
        text: `Because you frequently explore ${product.category}`,
        factor: 'category_affinity',
        confidence: Math.min(98, 70 + topBrowsedCategory[1] * 5)
      };
    }

    // 4. Strong collaborative filtering score
    if (collabScore > 0.65) {
      return {
        badge: 'Collaborative Match',
        text: `Popular among shoppers with matching preferences`,
        factor: 'collaborative',
        confidence: Math.round(collabScore * 100)
      };
    }

    // 5. High content similarity from recent views
    const viewMatch = Array.from(viewedIds)
      .map(id => ({ id, sim: tfidfEngine.getProductSimilarity(product.id, id) }))
      .sort((a, b) => b.sim - a.sim)[0];

    if (viewMatch && viewMatch.sim > 0.4) {
      const matchProd = allProducts.find(p => p.id === viewMatch.id);
      return {
        badge: 'Similar Interest',
        text: `Similar to recently viewed ${matchProd ? matchProd.name : product.category}`,
        factor: 'content_view',
        confidence: Math.round(viewMatch.sim * 100)
      };
    }

    // 6. High rated / trending fallbacks
    if (product.rating >= 4.7) {
      return {
        badge: 'Top Rated',
        text: `Customer favorite with ${product.rating}★ rating and ${product.reviewsCount}+ reviews`,
        factor: 'social_proof',
        confidence: Math.round(product.rating * 19)
      };
    }

    return {
      badge: 'Trending Pick',
      text: `Trending product in ${product.category}`,
      factor: 'popularity',
      confidence: 82
    };
  }

  /**
   * Main Hybrid Recommendation Engine
   * @param {Object} params
   * @param {Array} params.allProducts - Complete catalog
   * @param {Array} params.interactions - User interaction log
   * @param {number} params.contentWeight - Weight for content-based (0.0 to 1.0)
   * @param {number} params.collabWeight - Weight for collaborative (0.0 to 1.0)
   * @param {number} params.limit - Number of recommendations to return
   * @param {boolean} params.excludePurchased - Avoid recommending bought items
   */
  getRecommendations({
    allProducts = [],
    interactions = [],
    contentWeight = 0.6,
    collabWeight = 0.4,
    limit = 12,
    excludePurchased = true
  } = {}) {
    if (!allProducts || allProducts.length === 0) return [];

    // Ensure TF-IDF is trained
    if (!tfidfEngine.isTrained) {
      tfidfEngine.fit(allProducts);
    }

    // Identify purchased items to exclude/deprecate
    const purchasedIds = new Set(
      interactions.filter(i => i.type === 'purchase').map(i => i.productId)
    );

    // Compute user category counts for explanation and affinity
    const userCategoryCounts = {};
    interactions.forEach(evt => {
      if (evt.productId) {
        const prod = allProducts.find(p => p.id === evt.productId);
        if (prod && prod.category) {
          userCategoryCounts[prod.category] = (userCategoryCounts[prod.category] || 0) + 1;
        }
      }
    });

    // 1. CONTENT-BASED FILTERING
    const userVector = this.buildUserProfileVector(interactions, allProducts);
    const contentScores = new Map();

    const hasInteractions = interactions.length > 0 && userVector.size > 0;

    allProducts.forEach(prod => {
      if (hasInteractions) {
        const prodVec = tfidfEngine.productVectors.get(prod.id);
        const sim = tfidfEngine.cosineSimilarity(userVector, prodVec);
        contentScores.set(prod.id, sim);
      } else {
        // Cold start content score: normalized quality baseline
        const ratingNorm = (prod.rating || 4.0) / 5.0;
        contentScores.set(prod.id, 0.5 + 0.3 * ratingNorm);
      }
    });

    // 2. COLLABORATIVE FILTERING
    const userInteractionsMap = this.buildInteractionScores(interactions);
    const collabScores = collaborativeEngine.getCollaborativeScores(userInteractionsMap, allProducts);

    // 3. HYBRID MERGING & SCORING
    // Normalize weights to sum to 1.0
    const totalWeight = (contentWeight + collabWeight) || 1.0;
    const normContentWeight = contentWeight / totalWeight;
    const normCollabWeight = collabWeight / totalWeight;

    const scoredProducts = allProducts
      .filter(prod => {
        if (excludePurchased && purchasedIds.has(prod.id)) {
          // Exclude if we have enough alternatives
          return allProducts.length - purchasedIds.size < limit;
        }
        return true;
      })
      .map(product => {
        const rawContent = contentScores.get(product.id) || 0;
        const rawCollab = collabScores.get(product.id) || 0;

        // Calculate hybrid score
        let hybridScore = (normContentWeight * rawContent) + (normCollabWeight * rawCollab);

        // Quality boost: slightly reward higher rated & popular products (up to +10%)
        const ratingBonus = ((product.rating || 4.0) - 3.5) * 0.05;
        hybridScore = Math.max(0.05, Math.min(0.99, hybridScore + ratingBonus));

        // Format to realistic percentage (e.g. 78% to 98%)
        const matchPercentage = Math.round(
          Math.min(99, Math.max(65, hybridScore * 100))
        );

        const explanation = this.generateExplanation({
          product,
          contentSim: rawContent,
          collabScore: rawCollab,
          interactions,
          allProducts,
          userCategoryCounts
        });

        return {
          ...product,
          recommendationScore: parseFloat(hybridScore.toFixed(4)),
          contentScore: parseFloat(rawContent.toFixed(4)),
          collabScore: parseFloat(rawCollab.toFixed(4)),
          matchPercentage,
          explanation
        };
      });

    // Sort descending by hybrid recommendation score
    scoredProducts.sort((a, b) => b.recommendationScore - a.recommendationScore);

    return scoredProducts.slice(0, limit);
  }

  /**
   * Item-to-Item Similar Products using Cosine Similarity on TF-IDF vectors
   */
  getSimilarProducts(targetProductId, allProducts, limit = 6) {
    if (!tfidfEngine.isTrained) {
      tfidfEngine.fit(allProducts);
    }

    const targetVector = tfidfEngine.productVectors.get(targetProductId);
    const targetProduct = allProducts.find(p => p.id === targetProductId);
    if (!targetVector || !targetProduct) return [];

    const scored = allProducts
      .filter(p => p.id !== targetProductId)
      .map(product => {
        const prodVec = tfidfEngine.productVectors.get(product.id);
        let sim = tfidfEngine.cosineSimilarity(targetVector, prodVec);

        // Category bonus: same category items get boosted relevance
        if (product.category === targetProduct.category) {
          sim = Math.min(1.0, sim + 0.15);
        }
        // Brand bonus
        if (product.brand === targetProduct.brand) {
          sim = Math.min(1.0, sim + 0.10);
        }

        const matchPercentage = Math.round(Math.min(99, Math.max(70, sim * 100)));

        return {
          ...product,
          similarityScore: parseFloat(sim.toFixed(4)),
          matchPercentage,
          explanation: {
            badge: 'Content Similarity',
            text: `High feature overlap with ${targetProduct.name}`,
            confidence: matchPercentage
          }
        };
      });

    scored.sort((a, b) => b.similarityScore - a.similarityScore);
    return scored.slice(0, limit);
  }

  /**
   * Trending Products calculation based on rating, review count, and mock engagement
   */
  getTrendingProducts(allProducts, limit = 8) {
    return [...allProducts]
      .sort((a, b) => {
        const scoreA = (a.rating * 100) + (a.reviewsCount * 0.2);
        const scoreB = (b.rating * 100) + (b.reviewsCount * 0.2);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  /**
   * Best Sellers calculation
   */
  getBestSellers(allProducts, limit = 8) {
    return [...allProducts]
      .filter(p => p.salesRank && p.salesRank <= 15 || p.isBestSeller)
      .slice(0, limit);
  }
}

export const recommendationEngine = new RecommendationEngine();

