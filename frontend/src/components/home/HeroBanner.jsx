import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Sliders, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const HERO_SLIDES = [
  {
    tag: 'Next-Gen Personalization',
    title: 'Experience Intelligent Shopping Powered by Machine Learning',
    subtitle: 'Combining TF-IDF vectorization with user-item collaborative filtering to calculate genuine cosine recommendation scores in real time.',
    ctaText: 'View AI Recommendations',
    ctaLink: '/ai-dashboard',
    secondaryText: 'Explore Catalog',
    secondaryLink: '/shop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&auto=format&fit=crop&q=80',
    highlightBadge: 'Hybrid Engine (0.6 Content + 0.4 Collab)'
  },
  {
    tag: 'Studio Grade Audio & Tech',
    title: 'Precision Recommendations Tailored to Your Taste',
    subtitle: 'From noise-cancelling acoustics to ergonomic mechanical peripherals, discover items with transparent explainable AI matching.',
    ctaText: 'Shop Tech & Audio',
    ctaLink: '/shop?category=Headphones',
    secondaryText: 'See How It Works',
    secondaryLink: '/architecture',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80',
    highlightBadge: 'Dynamic TF-IDF Vector Space'
  },
  {
    tag: 'Lifestyle & Curated Luxury',
    title: 'Smart Fashion & Horology Matched to Your Style',
    subtitle: 'Switch user personas or browse freely. Our local interaction tracking adapts instantly as you view, like, and search.',
    ctaText: 'Browse Fashion & Watches',
    ctaLink: '/shop?category=Watches',
    secondaryText: 'Switch Test Persona',
    secondaryLink: '/ai-dashboard',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1000&auto=format&fit=crop&q=80',
    highlightBadge: 'User-User K-NN Collaborative Filtering'
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 text-white shadow-2xl border border-slate-800">
      {/* Background Glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Text & CTA */}
        <div className="lg:col-span-7 space-y-5 z-10">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles size={14} className="text-primary-400" />
            <span>{slide.tag}</span>
            <span className="w-1 h-1 rounded-full bg-primary-400"></span>
            <span className="text-white/80">{slide.highlightBadge}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            {slide.subtitle}
          </p>

          {/* Active Persona Indicator */}
          <div className="inline-flex items-center gap-3 p-2 pr-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 backdrop-blur-md">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-xl object-cover border border-primary-400"
            />
            <div className="text-left text-xs">
              <p className="text-slate-400 text-[10px] uppercase font-semibold">Active Profile</p>
              <p className="font-bold text-white">{currentUser.name}</p>
            </div>
            <Link
              to="/ai-dashboard"
              className="ml-2 text-[11px] text-primary-300 hover:text-white flex items-center gap-1 font-semibold underline underline-offset-2"
            >
              <Sliders size={12} /> Switch
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={slide.ctaLink}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary-600/30 flex items-center gap-2 transition-all duration-200 active:scale-95"
            >
              <Zap size={16} /> {slide.ctaText} <ArrowRight size={16} />
            </Link>

            <Link
              to={slide.secondaryLink}
              className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-xl border border-white/10 backdrop-blur-md transition-all duration-200"
            >
              {slide.secondaryText}
            </Link>
          </div>
        </div>

        {/* Right Column: Dynamic Visual Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 group">
            <img
              src={slide.image}
              alt="Showcase Product"
              className="w-full h-72 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80">
              <div className="flex items-center justify-between text-xs text-primary-400 font-semibold mb-1">
                <span>Real-Time AI Feature Map</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Active
                </span>
              </div>
              <p className="text-xs text-slate-200 font-medium">
                Recommendation scores update instantly upon user clicks, queries, and cart events.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation Dots & Arrows */}
      <div className="px-6 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === i ? 'w-8 bg-primary-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors border border-slate-700"
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors border border-slate-700"
            aria-label="Next slide"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

