import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Zap,
  Check,
  Shield,
  Truck,
  RotateCcw,
  Sparkles,
  Share2,
  ChevronRight,
  Plus,
  Minus,
  Info
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useInteractions } from '../context/InteractionContext';
import { useRecommendation } from '../context/RecommendationContext';
import { collaborativeEngine } from '../ai/collaborative';
import RatingStars from '../components/common/RatingStars';
import ProductCard from '../components/common/ProductCard';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, getProductById } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { trackView } = useInteractions();
  const { getSimilarProducts } = useRecommendation();

  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const product = getProductById(id);

  // Track product view for recommendation algorithm
  useEffect(() => {
    if (product) {
      trackView(product.id, product.name);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id, product, trackView]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The product you are looking for does not exist or has been removed.</p>
        <Link to="/shop" className="inline-block mt-4 px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const effectivePrice = product.discountedPrice || product.price;
  const hasDiscount = product.discount > 0;

  // AI-Computed Content-Based Similar Products
  const similarProducts = getSimilarProducts(product.id, 4);

  // AI-Computed Collaborative "Also Bought" Products
  const alsoBoughtProducts = collaborativeEngine.getAlsoInteractedProducts(product.id, products, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <ChevronRight size={13} />
        <Link to="/shop" className="hover:text-primary-600">Shop</Link>
        <ChevronRight size={13} />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-primary-600">
          {product.category}
        </Link>
        <ChevronRight size={13} />
        <span className="text-slate-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Product Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
              }}
            />

            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-rose-600 text-white font-bold text-xs rounded-full shadow-md">
                Save {product.discount}%
              </span>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md text-slate-600 hover:text-primary-600 flex items-center justify-center transition-colors"
              title="Share Product"
            >
              {copiedShare ? <Check size={18} className="text-emerald-600" /> : <Share2 size={18} />}
            </button>
          </div>

          {/* AI Feature Extraction Badge */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-50 via-indigo-50/60 to-purple-50 border border-primary-100 text-xs text-slate-700 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-primary-800">
              <Sparkles size={14} className="text-primary-600" />
              Machine Learning Feature Map
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              This product is vectorized across <strong>{product.tags.length} semantic tokens</strong> and categorized in <strong>{product.category}</strong>. Interacting with this item elevates your user preference weight for <em>{product.brand}</em> and related terms.
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              {product.tags.map(t => (
                <span key={t} className="px-2 py-0.5 bg-white/80 rounded-md text-[10px] text-primary-700 font-mono border border-primary-200/50">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Details, Pricing, Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {/* Brand & Category */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-primary-100 text-primary-700 font-bold text-xs rounded-full">
                {product.category}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Brand: <strong className="text-slate-700">{product.brand}</strong>
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="mt-3 flex items-center gap-3">
              <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size={18} />
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Verified Product
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900">
                ${effectivePrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    ${product.price.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    Save ${(product.price - effectivePrice).toLocaleString()} ({product.discount}%)
                  </span>
                </>
              )}
            </div>

            <div className="text-right">
              <span className={`text-xs font-bold ${product.stock <= 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {product.stock <= 10 ? `Low Stock: Only ${product.stock} Left` : 'In Stock Ready to Ship'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Description
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Technical Specifications Table */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Technical Specifications
              </h3>
              <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
                {Object.entries(product.specs).map(([specKey, specVal]) => (
                  <div key={specKey} className="grid grid-cols-3 p-2.5 bg-white">
                    <span className="font-semibold text-slate-500">{specKey}</span>
                    <span className="col-span-2 text-slate-800 font-medium">{specVal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Purchase Actions */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-bold text-xs text-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.min(product.stock || 99, prev + 1))}
                  className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                  disabled={quantity >= (product.stock || 99)}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`sm:col-span-1 px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
                  addedFeedback
                    ? 'bg-emerald-600 text-white'
                    : 'bg-primary-600 hover:bg-primary-700 text-white active:scale-95'
                }`}
              >
                {addedFeedback ? (
                  <>
                    <Check size={16} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to Cart
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="sm:col-span-1 px-4 py-3 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <Zap size={16} /> Buy Now
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`sm:col-span-1 px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                  isFavorite
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Heart size={16} className={isFavorite ? 'fill-rose-500' : ''} />
                {isFavorite ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>

          {/* Value Assurance Badges */}
          <div className="grid grid-cols-3 gap-3 pt-3 text-center text-[11px] text-slate-500">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
              <Truck size={16} className="text-primary-600" />
              <span>Fast Track Delivery</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
              <Shield size={16} className="text-primary-600" />
              <span>2-Year Warranty</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
              <RotateCcw size={16} className="text-primary-600" />
              <span>30-Day Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content-Based Similar Products Section */}
      <section className="pt-12 border-t border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-md mb-1">
              <Sparkles size={12} /> Content-Based Filtering
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Similar Products (TF-IDF Cosine Similarity)
            </h2>
            <p className="text-xs text-slate-500">
              Matched mathematically on title, description, brand, and feature keywords
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {similarProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              showAIMatch={true}
            />
          ))}
        </div>
      </section>

      {/* Collaborative Filtering Section */}
      {alsoBoughtProducts.length > 0 && (
        <section className="pt-8 border-t border-slate-200">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md mb-1">
              Collaborative Filtering
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Customers Who Viewed This Also Explored
            </h2>
            <p className="text-xs text-slate-500">
              Calculated using the user-item co-occurrence interaction matrix
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {alsoBoughtProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                showAIMatch={false}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

