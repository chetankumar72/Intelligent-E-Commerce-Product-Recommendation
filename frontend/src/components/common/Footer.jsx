import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, Cpu, Database, Heart, Shield, Terminal, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Top Value Banner */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-900/60 text-primary-400 flex items-center justify-center flex-shrink-0">
              <Brain size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-white">TF-IDF Vectorization</h4>
              <p className="text-xs text-slate-400">Content-based feature cosine mapping</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-900/60 text-primary-400 flex items-center justify-center flex-shrink-0">
              <Cpu size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-white">Collaborative Filtering</h4>
              <p className="text-xs text-slate-400">User-item interaction correlation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-900/60 text-primary-400 flex items-center justify-center flex-shrink-0">
              <Database size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-white">Hybrid Scoring</h4>
              <p className="text-xs text-slate-400">Weighted ensemble recommendation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-900/60 text-primary-400 flex items-center justify-center flex-shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-white">Explainable AI (XAI)</h4>
              <p className="text-xs text-slate-400">Transparent match justification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-md">
                <Sparkles size={18} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                NexaShop<span className="text-primary-400">.ai</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              An intelligent, production-grade e-commerce application powered by advanced Content-Based and Collaborative Filtering algorithms. Built for real-time personalization, transparent recommendation justifications, and rich analytics.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-slate-800 rounded-md text-primary-300 font-mono text-[11px]">
                React 18 / Vite
              </span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-md text-primary-300 font-mono text-[11px]">
                Tailwind CSS
              </span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-md text-primary-300 font-mono text-[11px]">
                TF-IDF + Cosine
              </span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-md text-primary-300 font-mono text-[11px]">
                FastAPI Python Ready
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home Page</Link></li>
              <li><Link to="/shop" className="hover:text-primary-400 transition-colors">Product Catalog</Link></li>
              <li><Link to="/ai-dashboard" className="hover:text-primary-400 transition-colors">AI Intelligence Dashboard</Link></li>
              <li><Link to="/cart" className="hover:text-primary-400 transition-colors">Shopping Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-primary-400 transition-colors">Saved Wishlist</Link></li>
              <li><Link to="/orders" className="hover:text-primary-400 transition-colors">Order History</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop?category=Laptops" className="hover:text-primary-400 transition-colors">Laptops & Workstations</Link></li>
              <li><Link to="/shop?category=Smartphones" className="hover:text-primary-400 transition-colors">Flagship Smartphones</Link></li>
              <li><Link to="/shop?category=Headphones" className="hover:text-primary-400 transition-colors">Audio & Headphones</Link></li>
              <li><Link to="/shop?category=Electronics" className="hover:text-primary-400 transition-colors">Gaming & Peripherals</Link></li>
              <li><Link to="/shop?category=Fashion" className="hover:text-primary-400 transition-colors">Apparel & Denim</Link></li>
              <li><Link to="/shop?category=Home+Appliances" className="hover:text-primary-400 transition-colors">Culinary & Appliances</Link></li>
            </ul>
          </div>

          {/* Academic AI Project */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Academic & Defense</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/architecture" className="hover:text-primary-400 transition-colors">Model Mathematical Proofs</Link></li>
              <li><Link to="/architecture#tfidf" className="hover:text-primary-400 transition-colors">TF-IDF Vector Formulation</Link></li>
              <li><Link to="/architecture#collaborative" className="hover:text-primary-400 transition-colors">Cosine User-Item Matrix</Link></li>
              <li><Link to="/architecture#viva" className="hover:text-primary-400 transition-colors">Viva & Project Defense Q&A</Link></li>
              <li><Link to="/admin" className="hover:text-primary-400 transition-colors">Admin Management Panel</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} NexaShop AI. Intelligent E-Commerce Product Recommendation System.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart size={13} className="text-rose-500 fill-rose-500" /> for Academic Engineering Excellence
          </p>
        </div>
      </div>
    </footer>
  );
}

