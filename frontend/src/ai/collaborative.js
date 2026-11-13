/**
 * Collaborative Filtering Engine
 * Implements User-Based & Item-Based Collaborative Filtering using an interaction matrix.
 */

// Interaction weights for implicit feedback mapping (1.0 - 5.0 scale)
export const INTERACTION_WEIGHTS = {
  PURCHASE: 5.0,
  CART: 4.0,
  WISHLIST: 3.5,
  SEARCH: 2.5,
  VIEW: 1.5,
  LIKE: 3.0
};

/**
 * Predefined synthetic user archetypes for baseline collaborative matrix training
 */
export const SYNTHETIC_USER_PROFILES = [
  {
    userId: 'user_tech_pro',
    name: 'Marcus (Dev & Tech Lead)',
    interactions: {
      'prod_1': 5.0, // Apple MacBook Pro M3
      'prod_2': 4.5, // Dell XPS 15
      'prod_3': 4.0, // Sony WH-1000XM5
      'prod_4': 5.0, // Keychron Q1 Pro Mechanical Keyboard
      'prod_5': 4.5, // Logitech MX Master 3S
      'prod_6': 4.0, // LG UltraFine 4K Monitor
      'prod_7': 3.5, // Anker 737 GaN Fast Charger
      'prod_11': 4.5, // iPhone 15 Pro Max
      'prod_12': 4.0  // Samsung Galaxy S24 Ultra
    }
  },
  {
    userId: 'user_gamer',
    name: 'Kai (Esports Gamer)',
    interactions: {
      'prod_2': 4.0, // Dell XPS
      'prod_4': 5.0, // Keychron Mechanical Keyboard
      'prod_5': 5.0, // Logitech MX Master
      'prod_8': 5.0, // ASUS ROG Swift OLED Monitor
      'prod_9': 5.0, // Razer BlackShark V2 Pro Headset
      'prod_10': 4.5, // PlayStation 5 Slim
      'prod_13': 4.0, // Asus ROG Phone 8
      'prod_37': 4.5  // Secretlab Titan Evo Gaming Chair
    }
  },
  {
    userId: 'user_audiophile',
    name: 'Julian (Sound Engineer)',
    interactions: {
      'prod_3': 5.0, // Sony WH-1000XM5
      'prod_9': 3.5, // Razer Headset
      'prod_14': 5.0, // Bose QuietComfort Ultra
      'prod_15': 5.0, // Sennheiser Momentum 4
      'prod_16': 4.5, // Apple AirPods Max
      'prod_17': 4.0, // Sony WF-1000XM5 Earbuds
      'prod_18': 5.0, // Audio-Technica ATH-M50x
      'prod_19': 4.5  // Sonos Era 300 Smart Speaker
    }
  },
  {
    userId: 'user_fashion_luxury',
    name: 'Chloe (Fashion Stylist)',
    interactions: {
      'prod_20': 5.0, // Nike Air Jordan 1 Retro
      'prod_21': 5.0, // Adidas Ultraboost Light
      'prod_22': 4.5, // New Balance 990v6
      'prod_23': 5.0, // Levi's Vintage 501 Original Jeans
      'prod_24': 4.5, // Patagonia Better Sweater Fleece
      'prod_25': 5.0, // Ray-Ban Classic Aviator
      'prod_26': 5.0, // Seiko Prospex Automatic Watch
      'prod_27': 5.0, // Tissot PRX Powermatic 80
      'prod_30': 4.5  // Bellroy Classic Backpack Plus
    }
  },
  {
    userId: 'user_home_chef',
    name: 'Gillian (Home & Culinary)',
    interactions: {
      'prod_31': 5.0, // Breville Barista Touch Espresso Machine
      'prod_32': 5.0, // Philips Airfryer XXL Smart
      'prod_33': 4.5, // Dyson V15 Detect Cordless Vacuum
      'prod_34': 4.0, // Roborock S8 Pro Ultra Robot Vacuum
      'prod_35': 5.0, // Le Creuset Enamelled Dutch Oven
      'prod_36': 4.5, // Fellow Stagg EKG Electric Kettle
      'prod_38': 4.5  // Atomic Habits Hardcover Book
    }
  },
  {
    userId: 'user_fitness_runner',
    name: 'Dave (Marathon Runner)',
    interactions: {
      'prod_21': 5.0, // Adidas Ultraboost
      'prod_22': 4.5, // New Balance 990v6
      'prod_28': 5.0, // Garmin Forerunner 965 GPS Watch
      'prod_29': 4.5, // Apple Watch Ultra 2
      'prod_17': 4.0, // Sony Earbuds
      'prod_39': 4.0, // Hydro Flask 32oz Insulated Bottle
      'prod_40': 4.5  // WHOOP 4.0 Health Tracker
    }
  }
];

export class CollaborativeEngine {
  constructor() {
    this.syntheticUsers = SYNTHETIC_USER_PROFILES;
    this.itemCooccurrence = new Map(); // itemA -> Map(itemB -> co-count)
    this._computeItemCooccurrences();
  }

  /**
   * Compute item-to-item co-occurrence matrix from all synthetic and logged orders
   */
  _computeItemCooccurrences() {
    this.itemCooccurrence.clear();
    this.syntheticUsers.forEach(u => {
      const itemIds = Object.keys(u.interactions);
      for (let i = 0; i < itemIds.length; i++) {
        for (let j = 0; j < itemIds.length; j++) {
          if (i === j) continue;
          const a = itemIds[i];
          const b = itemIds[j];
          if (!this.itemCooccurrence.has(a)) {
            this.itemCooccurrence.set(a, new Map());
          }
          const map = this.itemCooccurrence.get(a);
          map.set(b, (map.get(b) || 0) + 1);
        }
      }
    });
  }

  /**
   * Calculate Pearson / Cosine Correlation between two user interaction maps
   */
  userCosineSimilarity(userAInteractions, userBInteractions) {
    const keysA = Object.keys(userAInteractions);
    if (keysA.length === 0) return 0;

    let dot = 0;
    let normASq = 0;
    let normBSq = 0;

    for (const [prodId, ratingA] of Object.entries(userAInteractions)) {
      normASq += ratingA * ratingA;
      const ratingB = userBInteractions[prodId];
      if (ratingB !== undefined) {
        dot += ratingA * ratingB;
      }
    }

    for (const ratingB of Object.values(userBInteractions)) {
      normBSq += ratingB * ratingB;
    }

    if (normASq === 0 || normBSq === 0) return 0;
    return dot / (Math.sqrt(normASq) * Math.sqrt(normBSq));
  }

  /**
   * Predict user ratings using K-Nearest Neighbor user-based collaborative filtering
   * @param {Object} currentUserInteractions - { [productId]: score }
   * @param {Array} allProducts - list of all product objects
   * @returns {Map} productId -> normalized score [0, 1]
   */
  getCollaborativeScores(currentUserInteractions, allProducts) {
    const scores = new Map();
    const hasInteractions = Object.keys(currentUserInteractions).length > 0;

    if (!hasInteractions) {
      // Cold start: fallback to popularity/rating baseline
      allProducts.forEach(prod => {
        const ratingScore = (prod.rating || 4.0) / 5.0; // 0.8
        const popularityScore = Math.min(1.0, (prod.reviewsCount || 50) / 1000);
        scores.set(prod.id, 0.7 * ratingScore + 0.3 * popularityScore);
      });
      return scores;
    }

    // 1. Calculate similarity with all synthetic users
    const userSimilarities = this.syntheticUsers.map(profile => ({
      userId: profile.userId,
      name: profile.name,
      similarity: this.userCosineSimilarity(currentUserInteractions, profile.interactions),
      interactions: profile.interactions
    }));

    // Filter to top neighbors with positive similarity
    const neighbors = userSimilarities.filter(n => n.similarity > 0.05);

    if (neighbors.length === 0) {
      // Fallback to popularity
      allProducts.forEach(prod => {
        scores.set(prod.id, ((prod.rating || 4.0) / 5.0) * 0.75);
      });
      return scores;
    }

    // 2. Predict ratings for each product
    allProducts.forEach(prod => {
      let weightedSum = 0;
      let simSum = 0;

      neighbors.forEach(neighbor => {
        const neighborRating = neighbor.interactions[prod.id];
        if (neighborRating !== undefined) {
          weightedSum += neighbor.similarity * neighborRating;
          simSum += neighbor.similarity;
        }
      });

      if (simSum > 0) {
        // Predicted rating on 1-5 scale, normalize to [0, 1]
        const predictedRating = weightedSum / simSum;
        scores.set(prod.id, Math.min(1.0, Math.max(0.0, predictedRating / 5.0)));
      } else {
        // If no neighbor rated it, use small baseline based on product rating
        scores.set(prod.id, 0.2 + 0.3 * ((prod.rating || 4.0) / 5.0));
      }
    });

    return scores;
  }

  /**
   * Get products frequently interacted with together (Item-Item CF)
   */
  getAlsoInteractedProducts(productId, allProducts, limit = 4) {
    const coMap = this.itemCooccurrence.get(productId);
    if (!coMap || coMap.size === 0) {
      // Fallback: items in the same category
      const targetProd = allProducts.find(p => p.id === productId);
      if (!targetProd) return [];
      return allProducts
        .filter(p => p.id !== productId && p.category === targetProd.category)
        .slice(0, limit);
    }

    const sortedIds = Array.from(coMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);

    const result = [];
    for (const id of sortedIds) {
      const prod = allProducts.find(p => p.id === id);
      if (prod && prod.id !== productId) {
        result.push(prod);
        if (result.length >= limit) break;
      }
    }
    return result;
  }
}

export const collaborativeEngine = new CollaborativeEngine();

