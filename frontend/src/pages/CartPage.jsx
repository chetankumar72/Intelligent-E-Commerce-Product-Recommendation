import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRecommendation } from '../context/RecommendationContext';
import ProductCard from '../components/common/ProductCard';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    rawSubtotal,
    originalSubtotal,
    productDiscountSavings,
    couponDiscount,
    shipping,
    tax,
    finalTotal,
    totalItems,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponError
  } = useCart();

  const { recommendedProducts } = useRecommendation();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (applyCoupon(couponInput)) {
      setCouponInput('');
    }
  };

  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(100, Math.round((rawSubtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Explore our intelligent catalog and discover products chosen specifically for you by machine learning.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
          >
            Start Shopping Now <ArrowRight size={16} />
          </Link>
        </div>

        {/* Recommended Fallback Carousel */}
        <div className="mt-16 text-left">
          <h3 className="text-base font-bold text-slate-900 mb-4">Recommended Products for You</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {recommendedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} showAIMatch={false} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Review your items, apply vouchers, and proceed to simulated secure checkout
        </p>
      </div>

      {/* Free Shipping Progress Alert */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1 flex-1">
          <p className="text-xs font-semibold text-indigo-900">
            {shipping === 0
              ? '🎉 You unlocked Complimentary Express Shipping!'
              : `Add $${remainingForFreeShipping.toLocaleString()} more to unlock Free Express Delivery!`}
          </p>
          <div className="w-full max-w-md bg-indigo-200/60 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>
        <span className="text-[11px] font-bold text-indigo-700">
          Threshold: ${freeShippingThreshold}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
          {cartItems.map((item) => {
            const price = item.discountedPrice || item.price;
            return (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border border-slate-200 flex-shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Brand: {item.brand}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-slate-900">
                        ${price.toLocaleString()}
                      </span>
                      {item.discount > 0 && (
                        <span className="text-xs text-slate-400 line-through">
                          ${item.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1.5 text-slate-600 hover:text-slate-900"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1.5 text-slate-600 hover:text-slate-900"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <span className="text-sm font-bold text-slate-900 w-20 text-right">
                    ${(price * item.quantity).toLocaleString()}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="p-4 sm:p-6 bg-slate-50/50 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={clearCart}
              className="text-slate-500 hover:text-rose-600 font-semibold transition-colors flex items-center gap-1"
            >
              <Trash2 size={13} /> Clear Entire Cart
            </button>
            <Link to="/shop" className="text-primary-600 font-semibold hover:underline">
              Continue Shopping →
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Tag size={14} className="text-primary-600" /> Promotional Coupon
            </h3>

            {appliedCoupon ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-800">{appliedCoupon.code}</span>
                  <p className="text-[11px] text-emerald-600">{appliedCoupon.description}</p>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="p-1 text-emerald-700 hover:text-rose-600"
                  title="Remove coupon"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Code: AI20 or SAVE10"
                  className="flex-1 px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-200 outline-none uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && (
              <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
            )}

            <div className="text-[11px] text-slate-400">
              Try discount codes: <code className="text-primary-600 font-bold">AI20</code> (20% off) or <code className="text-primary-600 font-bold">SAVE10</code>
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Order Breakdown
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span>${originalSubtotal.toLocaleString()}</span>
              </div>

              {productDiscountSavings > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Product Catalog Savings</span>
                  <span>-${productDiscountSavings.toLocaleString()}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon ({appliedCoupon?.code})</span>
                  <span>-${couponDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : `$${shipping}`}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (7%)</span>
                <span>${tax.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
              <span className="text-base font-bold text-slate-900">Total Due</span>
              <span className="text-2xl font-extrabold text-primary-600">
                ${finalTotal.toLocaleString()}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm shadow-md shadow-primary-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
              <ShieldCheck size={14} className="text-emerald-600" />
              Simulated academic checkout. No real cards charged.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

