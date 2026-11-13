import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import CategoryPills from '../components/home/CategoryPills';
import RecommendedSection from '../components/home/RecommendedSection';
import TrendingSection from '../components/home/TrendingSection';
import BestSellersSection from '../components/home/BestSellersSection';
import RecentlyViewedSection from '../components/home/RecentlyViewedSection';
import TechFeaturesBanner from '../components/home/TechFeaturesBanner';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <HeroBanner />
      <CategoryPills />
      <RecommendedSection />
      <TrendingSection />
      <TechFeaturesBanner />
      <BestSellersSection />
      <RecentlyViewedSection />
    </div>
  );
}

