import React from 'react';
import { Clock } from 'lucide-react';
import { useRecommendation } from '../../context/RecommendationContext';
import ProductCard from '../common/ProductCard';

export default function RecentlyViewedSection() {
  const { recentlyViewedProducts } = useRecommendation();

  if (!recentlyViewedProducts || recentlyViewedProducts.length === 0) {
    return null;
  }

  return (
    <section className="my-12 pt-8 border-t border-slate-200/80">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
          <Clock size={18} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Recently Viewed
          </h2>
          <p className="text-xs text-slate-500">
            Products you checked out during this session
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {recentlyViewedProducts.slice(0, 6).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showAIMatch={false}
          />
        ))}
      </div>
    </section>
  );
}

