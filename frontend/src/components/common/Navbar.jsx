import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  Menu,
  X,
  RotateCcw,
  BookOpen,
  LogOut
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useInteractions } from '../../context/InteractionContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { currentUser, logout } = useAuth();
  const { products } = useProducts();
  const { trackSearch, resetInteractions } = useInteractions();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter autocomplete suggestions
  const suggestions = searchQuery.trim().length > 1
    ? products
        .filter(p => {
          const matchName = p.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchBrand = p.brand.toLowerCase().includes(searchQuery.toLowerCase());
          const matchTag = p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
          return matchName || matchBrand || matchTag;
        })
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    trackSearch(searchQuery);
    setShowSuggestions(false);
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}&category=${selectedCategory}`);
  };

  const handleSuggestionClick = (product) => {
    trackSearch(product.name);
    setShowSuggestions(false);
    navigate(`/product/${product.id}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Top Academic Banner */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-indigo-900 text-white text-[11px] sm:text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="hidden sm:inline">Academic AI Engineering Project:</span>
            <span className="font-semibold text-primary-200">Intelligent E-Commerce Product Recommendation System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/architecture" className="hover:text-primary-200 transition-colors flex items-center gap-1">
              <BookOpen size={12} /> Model Architecture & Math
            </Link>
            <span className="text-primary-400">|</span>
            <span className="text-primary-300 hidden md:inline">Hybrid (TF-IDF + Collaborative CF)</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-primary-500/25 group-hover:scale-105 transition-transform">
              <Sparkles size={22} className="group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-primary-900 to-indigo-950 bg-clip-text text-transparent">
                NexaShop<span className="text-primary-600">.ai</span>
              </span>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                AI Recommendation System
              </p>
            </div>
          </Link>

          {/* Search Bar with live autocomplete */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="relative w-full flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search 40+ products, brands (Sony, Apple, Nike) or specs..."
                  className="w-full pl-10 pr-24 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-full border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
                <Search size={18} className="absolute left-3.5 text-slate-400" />

                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-full shadow-xs transition-colors flex items-center gap-1"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 py-2">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Product Matches ({suggestions.length})
                </div>
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSuggestionClick(p)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-primary-50/70 cursor-pointer transition-colors"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                      <p className="text-[11px] text-slate-500">{p.brand} • ${p.discountedPrice || p.price}</p>
                    </div>
                    <span className="text-[10px] font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                      {p.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {/* Shop link */}
            <Link
              to="/shop"
              className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors hidden lg:inline-flex items-center gap-1 ${
                location.pathname === '/shop' ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-100'
              }`}
            >
              Shop All
            </Link>

            {/* AI Dashboard Button with Pulsing Badge */}
            <Link
              to="/ai-dashboard"
              className={`relative px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                location.pathname === '/ai-dashboard'
                  ? 'text-white bg-primary-600 shadow-md shadow-primary-500/25'
                  : 'text-primary-700 bg-primary-50/80 hover:bg-primary-100 border border-primary-200/60'
              }`}
            >
              <Sparkles size={16} className="text-primary-500 animate-pulse" />
              <span className="hidden sm:inline">AI Dashboard</span>
              <span className="sm:hidden">AI</span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-600"></span>
              </span>
            </Link>

            {/* User Menu Dropdown */}
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-slate-50 transition-all text-left"
                title="Account Menu"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={currentUser?.name || 'User'}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-primary-200"
                />
                <div className="hidden xl:block">
                  <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[110px]">
                    {currentUser?.name || 'User'}
                  </p>
                  <p className="text-[10px] text-primary-600 font-medium leading-tight">
                    Signed In
                  </p>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                  {/* User info header */}
                  <div className="px-3 py-2 mb-1 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800 truncate">{currentUser?.name || 'User'}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser?.email || ''}</p>
                  </div>

                  <Link
                    to="/orders"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <ShoppingBag size={14} className="text-slate-500" /> My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Heart size={14} className="text-slate-500" /> Wishlist
                  </Link>
                  <Link
                    to="/ai-dashboard"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-primary-700 hover:bg-primary-50 transition-colors"
                  >
                    <Sparkles size={14} className="text-primary-500" /> AI Dashboard
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <LayoutDashboard size={14} className="text-slate-500" /> Admin Panel
                  </Link>

                  <div className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between gap-2 px-1">
                    <button
                      type="button"
                      onClick={() => { resetInteractions(); setShowUserMenu(false); }}
                      className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors font-medium"
                      title="Reset browsing history"
                    >
                      <RotateCcw size={11} /> Reset Data
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowUserMenu(false); logout(); }}
                      className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors font-bold"
                    >
                      <LogOut size={11} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 transition-colors"
              title="Saved Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-primary-50/50 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 md:hidden"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </div>

        {/* Mobile Search & Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-16 py-2 bg-slate-100 rounded-full text-xs text-slate-800"
              />
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <button
                type="submit"
                className="absolute right-1 top-1 px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full"
              >
                Search
              </button>
            </form>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-semibold">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-800 text-center"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-800 text-center"
              >
                Shop Catalog
              </Link>
              <Link
                to="/ai-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-primary-50 text-primary-700 text-center flex items-center justify-center gap-1"
              >
                <Sparkles size={13} /> AI Dashboard
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-800 text-center"
              >
                My Orders
              </Link>
              <Link
                to="/architecture"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-800 text-center col-span-2"
              >
                AI Model Architecture & Math Formulas
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-800 text-center col-span-2"
              >
                Admin Management Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

