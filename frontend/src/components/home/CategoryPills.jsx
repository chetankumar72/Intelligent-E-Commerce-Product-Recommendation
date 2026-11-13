import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_METADATA } from '../../data/categories';
import { ArrowUpRight } from 'lucide-react';

export default function CategoryPills() {
  const navigate = useNavigate();

  const handleCategorySelect = (categoryName) => {
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Explore 10 curated departments with custom TF-IDF semantic profiles
          </p>
        </div>

        <button
          onClick={() => navigate('/shop')}
          className="text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
        >
          View All Departments
          <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {CATEGORY_METADATA.map((cat) => (
          <div
            key={cat.name}
            onClick={() => handleCategorySelect(cat.name)}
            className="group relative rounded-2xl overflow-hidden bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer aspect-square flex flex-col justify-end p-4 border border-slate-200/60"
          >
            {/* Background Image */}
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 opacity-75 group-hover:opacity-90"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Content */}
            <div className="relative z-10 text-white">
              <span className="text-[10px] font-semibold text-primary-300 tracking-wider uppercase">
                {cat.count}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-primary-300 transition-colors">
                {cat.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

