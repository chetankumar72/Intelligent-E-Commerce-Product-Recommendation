import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Check, Sparkles, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useInteractions } from '../../context/InteractionContext';
import RatingStars from './RatingStars';

export default function ProductCard({ product, showAIMatch = true, priority = false }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { trackView } = useInteractions();
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const isFavorite = isInWishlist(product.id);
  const price = product.discountedPrice || product.price;
  const hasDiscount = product.discount > 0;

  const handleCardClick = () => {
    trackView(product.id, product.name);
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {hasDiscount && (
          <span className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 rounded-full shadow-sm">
            -{product.discount}%
          </span>
        )}
        {product.isBestSeller && (
          <span className="px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-100 border border-amber-200 rounded-full shadow-xs">
            Best Seller
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={handleWishlistToggle}
        aria-label="Add to wishlist"
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
          isFavorite
            ? 'bg-rose-50 text-rose-600 border border-rose-200'
            : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white backdrop-blur-xs'
        }`}
      >
        <Heart size={18} className={isFavorite ? 'fill-rose-500' : ''} />
      </button>

      {/* Product Image Container */}
      <div className="relative w-full pt-[75%] overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-2 bg-white/95 text-slate-800 text-xs font-semibold rounded-full shadow-md flex items-center gap-1.5 backdrop-blur-xs transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            <Eye size={14} className="text-primary-600" /> View Details
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
            <span className="text-slate-400 font-medium">
              {product.brand}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mt-2">
            <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size={13} />
          </div>

          {/* Explainable AI Pill */}
          {showAIMatch && product.matchPercentage && (
            <div className="mt-2.5 p-2 rounded-xl bg-gradient-to-r from-primary-50 to-indigo-50/70 border border-primary-100/80">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-700">
                  <Sparkles size={12} className="text-primary-600 animate-spin-slow" />
                  {product.matchPercentage}% AI Match
                </span>
                {product.explanation?.badge && (
                  <span className="text-[10px] font-semibold text-primary-600 bg-white/80 px-1.5 py-0.5 rounded border border-primary-100">
                    {product.explanation.badge}
                  </span>
                )}
              </div>
              {product.explanation?.text && (
                <p className="text-[11px] text-slate-600 line-clamp-1 italic">
                  "{product.explanation.text}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-900">
                ${price.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.price.toLocaleString()}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-medium ${product.stock <= 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {product.stock <= 10 ? `Only ${product.stock} left` : 'In Stock'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 shadow-xs ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-primary-600 hover:bg-primary-700 text-white active:scale-95'
            }`}
          >
            {isAdded ? (
              <>
                <Check size={14} className="stroke-[3]" /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={14} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

