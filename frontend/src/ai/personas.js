/**
 * Predefined User Personas for Demonstration and Academic Defense
 * Allows switching between distinct shopping personalities to demonstrate
 * real-time AI adaptation and cold-start handling.
 */

export const DEMO_PERSONAS = [
  {
    id: 'guest_cold_start',
    name: 'New Visitor (Cold Start)',
    role: 'Zero Prior History',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    description: 'Fresh user with empty profile. Tests cold-start recommendation fallback (popularity and category diversity).',
    badge: 'Cold Start',
    interactions: []
  },
  {
    id: 'alex_tech',
    name: 'Alex Rivera (Tech & Gaming)',
    role: 'Software Engineer & Gamer',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    description: 'High affinity for laptops, mechanical keyboards, OLED gaming monitors, and high-performance peripherals.',
    badge: 'Tech & Gaming',
    interactions: [
      { type: 'view', productId: 'prod_1', timestamp: Date.now() - 3600000 * 24 }, // MacBook Pro M3
      { type: 'view', productId: 'prod_4', timestamp: Date.now() - 3600000 * 18 }, // Keychron Q1
      { type: 'wishlist', productId: 'prod_5', timestamp: Date.now() - 3600000 * 12 }, // Logitech MX Master 3S
      { type: 'search', query: 'mechanical keyboard rgb oled', timestamp: Date.now() - 3600000 * 8 },
      { type: 'cart', productId: 'prod_8', timestamp: Date.now() - 3600000 * 4 }, // ASUS ROG Swift OLED
      { type: 'view', productId: 'prod_10', timestamp: Date.now() - 3600000 * 2 }  // PS5 Slim
    ]
  },
  {
    id: 'sophia_fashion',
    name: 'Sophia Chen (Fashion & Style)',
    role: 'Creative Director',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    description: 'Loves premium streetwear, automatic horology, iconic sunglasses, and designer everyday carry bags.',
    badge: 'Fashion & Luxury',
    interactions: [
      { type: 'view', productId: 'prod_20', timestamp: Date.now() - 3600000 * 20 }, // Nike Air Jordan 1
      { type: 'wishlist', productId: 'prod_25', timestamp: Date.now() - 3600000 * 15 }, // Ray-Ban Aviator
      { type: 'view', productId: 'prod_26', timestamp: Date.now() - 3600000 * 10 }, // Seiko Prospex
      { type: 'cart', productId: 'prod_30', timestamp: Date.now() - 3600000 * 5 }, // Bellroy Backpack
      { type: 'search', query: 'luxury automatic watches leather sneakers', timestamp: Date.now() - 3600000 * 2 }
    ]
  },
  {
    id: 'julian_audio',
    name: 'Julian Vance (Audiophile)',
    role: 'Music Producer & Sound Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    description: 'Obsessed with noise cancellation, reference studio headphones, lossless audio, and high-fidelity smart speakers.',
    badge: 'Audiophile',
    interactions: [
      { type: 'view', productId: 'prod_3', timestamp: Date.now() - 3600000 * 30 }, // Sony WH-1000XM5
      { type: 'search', query: 'active noise cancelling spatial audio', timestamp: Date.now() - 3600000 * 18 },
      { type: 'wishlist', productId: 'prod_14', timestamp: Date.now() - 3600000 * 12 }, // Bose QuietComfort
      { type: 'view', productId: 'prod_16', timestamp: Date.now() - 3600000 * 6 }, // AirPods Max
      { type: 'cart', productId: 'prod_18', timestamp: Date.now() - 3600000 * 1 } // Audio-Technica M50x
    ]
  },
  {
    id: 'gillian_home',
    name: 'Dr. Gillian Hayes (Smart Living)',
    role: 'Architect & Culinary Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    description: 'Enjoys espresso craft, smart robotic floorcare, artisan cookware, and aesthetic kitchen appliances.',
    badge: 'Home & Kitchen',
    interactions: [
      { type: 'view', productId: 'prod_31', timestamp: Date.now() - 3600000 * 25 }, // Breville Barista Touch
      { type: 'wishlist', productId: 'prod_35', timestamp: Date.now() - 3600000 * 15 }, // Le Creuset Dutch Oven
      { type: 'cart', productId: 'prod_36', timestamp: Date.now() - 3600000 * 8 }, // Fellow Stagg Kettle
      { type: 'search', query: 'espresso machine specialty coffee kettle', timestamp: Date.now() - 3600000 * 3 }
    ]
  }
];

