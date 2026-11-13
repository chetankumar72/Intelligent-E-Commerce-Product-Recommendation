import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRecommendation } from '../../context/RecommendationContext';
import ProductCard from '../common/ProductCard';

export default function TrendingSection() {
  const { trendingProducts } = useRecommendation();
  const displayItems = trendingProducts.slice(0, 4);

  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Flame size={20} className="fill-orange-500" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Trending Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              High interaction momentum and customer engagement
            </p>
          </div>
        </div>

        <Link
          to="/shop?sort=popularity"
          className="text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
        >
          View All Trending
          <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {displayItems.map((product) => (
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

