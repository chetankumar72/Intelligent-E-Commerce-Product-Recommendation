import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/common/ProductCard';

export default function WishlistPage() {
  const { wishlistIds, clearWishlist } = useWishlist();
  const { products } = useProducts();
  const { addToCart } = useCart();

  const savedProducts = wishlistIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  const handleMoveAllToCart = () => {
    savedProducts.forEach(prod => {
      addToCart(prod, 1);
    });
    clearWishlist();
  };

  if (savedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
          <Heart size={36} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Your Wishlist is Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Explore products and click the heart icon on any product card to save your favorites for later.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
          >
            Explore Catalog <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            My Wishlist
            <span className="text-sm font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
              {savedProducts.length} {savedProducts.length === 1 ? 'item' : 'items'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Products saved in your browser storage. Items here boost your AI recommendation affinities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleMoveAllToCart}
            className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <ShoppingBag size={14} /> Move All to Cart
          </button>
          <button
            type="button"
            onClick={clearWishlist}
            className="px-4 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 size={14} /> Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {savedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showAIMatch={false}
          />
        ))}
      </div>
    </div>
  );
}

