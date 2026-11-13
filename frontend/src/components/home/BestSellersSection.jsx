import React from 'react';
import { Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRecommendation } from '../../context/RecommendationContext';
import ProductCard from '../common/ProductCard';

export default function BestSellersSection() {
  const { bestSellers } = useRecommendation();
  const displayItems = bestSellers.slice(0, 4);

  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Award size={20} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Best-Selling Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Highest lifetime verified purchases across all categories
            </p>
          </div>
        </div>

        <Link
          to="/shop?sort=rating"
          className="text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
        >
          Explore Best Sellers
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

