import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  Search,
  X,
  Filter,
  Grid,
  List,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  Check
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useRecommendation } from '../context/RecommendationContext';
import { useInteractions } from '../context/InteractionContext';
import { CATEGORIES_LIST, BRANDS_LIST } from '../data/products';
import ProductCard from '../components/common/ProductCard';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useProducts();
  const { recommendedProducts } = useRecommendation();
  const { trackSearch } = useInteractions();

  // Search parameters from URL
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'recommended';

  // Filters State
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(4000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(initialSort);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && CATEGORIES_LIST.includes(cat)) {
      setSelectedCategory(cat);
    }
    const q = searchParams.get('search');
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Handle Search Input Submit
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim().length > 2) {
      trackSearch(e.target.value.trim());
    }
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrands([]);
    setMaxPrice(4000);
    setMinRating(0);
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('recommended');
    setSearchParams({});
  };

  // Map product with its AI recommendation score from recommendation engine
  const productsWithScores = useMemo(() => {
    const scoreMap = new Map();
    recommendedProducts.forEach(p => {
      scoreMap.set(p.id, {
        matchPercentage: p.matchPercentage,
        explanation: p.explanation,
        recommendationScore: p.recommendationScore
      });
    });

    return products.map(prod => {
      const aiData = scoreMap.get(prod.id);
      return {
        ...prod,
        matchPercentage: aiData?.matchPercentage || 75,
        explanation: aiData?.explanation || { badge: 'Catalog Item', text: 'Curated selection' },
        recommendationScore: aiData?.recommendationScore || 0.5
      };
    });
  }, [products, recommendedProducts]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return productsWithScores
      .filter(product => {
        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchBrand = product.brand.toLowerCase().includes(q);
          const matchCategory = product.category.toLowerCase().includes(q);
          const matchTags = product.tags.some(t => t.toLowerCase().includes(q));
          const matchDesc = product.description.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchCategory && !matchTags && !matchDesc) {
            return false;
          }
        }

        // Category Filter
        if (selectedCategory !== 'All' && product.category !== selectedCategory) {
          return false;
        }

        // Brand Filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
          return false;
        }

        // Price Filter
        const effectivePrice = product.discountedPrice || product.price;
        if (effectivePrice > maxPrice) {
          return false;
        }

        // Rating Filter
        if (product.rating < minRating) {
          return false;
        }

        // In Stock Filter
        if (inStockOnly && !product.inStock) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountedPrice || a.price;
        const priceB = b.discountedPrice || b.price;

        switch (sortBy) {
          case 'price-low':
            return priceA - priceB;
          case 'price-high':
            return priceB - priceA;
          case 'rating':
            return b.rating - a.rating;
          case 'popularity':
            return (b.reviewsCount || 0) - (a.reviewsCount || 0);
          case 'recommended':
          default:
            return (b.matchPercentage || 0) - (a.matchPercentage || 0);
        }
      });
  }, [productsWithScores, searchQuery, selectedCategory, selectedBrands, maxPrice, minRating, inStockOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Product Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse {products.length} intelligent products across 10 engineering departments
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Filter by keyword..."
              className="w-full pl-9 pr-8 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs font-medium rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
            <ArrowUpDown size={14} className="text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent outline-none cursor-pointer"
            >
              <option value="recommended">AI Match Score (High-Low)</option>
              <option value="popularity">Popularity (Most Reviewed)</option>
              <option value="rating">Customer Rating (Highest)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden px-3 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <Filter size={14} /> Filters
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Left Filter Sidebar (Desktop) */}
        <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-fit`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-primary-600" /> Filter Catalog
            </h3>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-slate-500 hover:text-primary-600 flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Categories
            </h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-primary-50 text-primary-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Check size={13} className="text-primary-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Max Price
              </h4>
              <span className="text-xs font-bold text-primary-600">
                ${maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="4000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>$20</span>
              <span>$2,000</span>
              <span>$4,000</span>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Customer Rating
            </h4>
            <div className="space-y-1.5 text-xs">
              {[4.8, 4.5, 4.0, 0].map((star) => (
                <label key={star} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === star}
                    onChange={() => setMinRating(star)}
                    className="accent-primary-600"
                  />
                  <span>{star === 0 ? 'All Ratings' : `${star}★ & above`}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands Filter */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Brands ({selectedBrands.length > 0 ? selectedBrands.length : 'All'})
            </h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {BRANDS_LIST.map((brand) => (
                <label key={brand} className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="rounded accent-primary-600"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Stock Availability */}
          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-primary-600"
              />
              <span>In Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Right Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filters Summary Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">
              Showing <strong>{filteredProducts.length}</strong> of {products.length} products
            </span>

            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-800 rounded-full font-medium">
                {selectedCategory}
                <X size={12} className="cursor-pointer" onClick={() => setSelectedCategory('All')} />
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-200 text-slate-800 rounded-full font-medium">
                "{searchQuery}"
                <X size={12} className="cursor-pointer" onClick={() => setSearchQuery('')} />
              </span>
            )}

            {selectedBrands.map(b => (
              <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-200 text-slate-800 rounded-full font-medium">
                {b}
                <X size={12} className="cursor-pointer" onClick={() => handleBrandToggle(b)} />
              </span>
            ))}
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showAIMatch={sortBy === 'recommended'}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-3">
              <Search size={40} className="mx-auto text-slate-300" />
              <h3 className="text-base font-bold text-slate-800">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No items matched your current filter criteria. Try adjusting your search query, increasing max price, or clearing filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

