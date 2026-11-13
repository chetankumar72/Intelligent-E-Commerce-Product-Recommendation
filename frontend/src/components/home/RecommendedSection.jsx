import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Sliders, ArrowRight, Info, HelpCircle } from 'lucide-react';
import { useRecommendation } from '../../context/RecommendationContext';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../common/ProductCard';

export default function RecommendedSection() {
  const { recommendedProducts, contentWeight, collabWeight } = useRecommendation();
  const { currentUser } = useAuth();

  const isColdStart = currentUser.id === 'guest_cold_start';
  const displayProducts = recommendedProducts.slice(0, 8);

  return (
    <section className="my-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-primary-50/50 via-white to-slate-50 border border-primary-100 shadow-sm relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold mb-2">
            <Sparkles size={13} className="text-primary-600 animate-spin-slow" />
            Machine Learning Engine
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Recommended For You
            <span className="text-xs sm:text-sm font-normal text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
              {currentUser.name}
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {isColdStart
              ? 'Showing cold-start popular baseline. Browse, search, or add items to cart to watch the algorithm personalize in real-time!'
              : `Dynamically calculated using Hybrid AI (${Math.round(contentWeight * 100)}% Content TF-IDF + ${Math.round(collabWeight * 100)}% Collaborative Filtering).`}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            to="/ai-dashboard"
            className="px-4 py-2 bg-white hover:bg-primary-50 text-primary-700 text-xs font-bold rounded-xl border border-primary-200 shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Sliders size={14} /> Tune Weights & View Analytics
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      {displayProducts.length > 0 ? (
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showAIMatch={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <HelpCircle size={36} className="mx-auto text-slate-400 mb-2" />
          <h4 className="text-sm font-bold text-slate-800">No recommendations available yet</h4>
          <p className="text-xs text-slate-500 mt-1">Interact with products to generate personalized recommendations.</p>
        </div>
      )}

      {/* Bottom Math Callout */}
      <div className="relative z-10 mt-8 pt-4 border-t border-primary-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <Info size={14} className="text-primary-600 flex-shrink-0" />
          <span>
            Hybrid Score = ({contentWeight} × CosineSim) + ({collabWeight} × CollaborativeScore). Excludes items already bought.
          </span>
        </div>
        <Link
          to="/architecture"
          className="text-primary-700 font-semibold hover:underline flex items-center gap-1"
        >
          View Algorithmic Equations <ArrowRight size={13} />
        </Link>
      </div>
    </section>
  );
}

