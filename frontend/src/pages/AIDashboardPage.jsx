import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Sliders,
  RotateCcw,
  Activity,
  Layers,
  Brain,
  Eye,
  ShoppingBag,
  Heart,
  CreditCard,
  Search,
  ExternalLink,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useRecommendation } from '../context/RecommendationContext';
import { useAuth } from '../context/AuthContext';
import { useInteractions } from '../context/InteractionContext';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/common/ProductCard';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#14b8a6', '#f43f5e'];

export default function AIDashboardPage() {
  const {
    recommendedProducts,
    categoryAffinityData,
    userFeatureKeywords,
    contentWeight,
    collabWeight,
    setContentWeight,
    setCollabWeight
  } = useRecommendation();

  const { currentUser } = useAuth();
  const { interactions, resetInteractions, getStats } = useInteractions();
  const { products } = useProducts();

  const stats = getStats();
  const [activeTab, setActiveTab] = useState('overview');
  const [backendStatus, setBackendStatus] = useState('checking'); // 'connected' | 'offline'

  // Probe optional Python FastAPI backend
  React.useEffect(() => {
    fetch('http://127.0.0.1:8000/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'healthy') setBackendStatus('connected');
        else setBackendStatus('offline');
      })
      .catch(() => setBackendStatus('offline'));
  }, []);

  // Prepare interaction pie data
  const interactionPieData = [
    { name: 'Product Views', value: stats.views, icon: Eye, color: '#6366f1' },
    { name: 'Search Queries', value: stats.searches, icon: Search, color: '#8b5cf6' },
    { name: 'Cart Additions', value: stats.carts, icon: ShoppingBag, color: '#f59e0b' },
    { name: 'Wishlist Saves', value: stats.wishlists, icon: Heart, color: '#ec4899' },
    { name: 'Purchases', value: stats.purchases, icon: CreditCard, color: '#10b981' },
  ].filter(d => d.value > 0);

  // Fallback if empty for cold start visualization
  const safePieData = interactionPieData.length > 0 ? interactionPieData : [
    { name: 'Cold Start Baseline', value: 1, color: '#cbd5e1' }
  ];

  // Prepare score decomposition comparison data for top 6 items
  const scoreDecompData = recommendedProducts.slice(0, 6).map(p => {
    const shortName = p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name;
    return {
      name: shortName,
      fullName: p.name,
      'Content Similarity': Math.round((p.contentScore || 0) * 100),
      'Collaborative Score': Math.round((p.collabScore || 0) * 100),
      'Hybrid Match': p.matchPercentage
    };
  });

  // Handle weight slider change
  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setContentWeight(parseFloat(val.toFixed(2)));
    setCollabWeight(parseFloat((1 - val).toFixed(2)));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-primary-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-primary-800/60 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/40 text-primary-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles size={13} className="text-primary-400" />
              Machine Learning Analytics & Explainability Studio
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              AI Recommendation Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time visualization of your personalized feature vectors, TF-IDF keyword weights, user-item collaborative correlation, and hybrid ensemble math.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${backendStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-primary-400'}`}></span>
              <span>Engine: <strong>{backendStatus === 'connected' ? 'Python FastAPI Active' : 'Client-Side TF-IDF (Standalone)'}</strong></span>
            </div>
            <button
              type="button"
              onClick={resetInteractions}
              className="px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
              title="Reset interaction history to demonstrate Cold-Start"
            >
              <RotateCcw size={14} /> Reset Session Data (Cold Start)
            </button>
            <Link
              to="/architecture"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-all"
            >
              <Brain size={14} /> View Mathematical Proofs
            </Link>
          </div>
        </div>

      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Events</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</p>
          <span className="text-[10px] text-primary-600 font-medium">Logged in session</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Product Views</span>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">{stats.views}</p>
          <span className="text-[10px] text-slate-400">Weight: 1.5x</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Search Queries</span>
          <p className="text-2xl font-extrabold text-purple-600 mt-1">{stats.searches}</p>
          <span className="text-[10px] text-slate-400">Weight: 2.5x</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Cart Additions</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{stats.carts}</p>
          <span className="text-[10px] text-slate-400">Weight: 4.0x</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Wishlist Items</span>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">{stats.wishlists}</p>
          <span className="text-[10px] text-slate-400">Weight: 3.5x</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Purchases</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.purchases}</p>
          <span className="text-[10px] text-slate-400">Weight: 5.0x (Excluded)</span>
        </div>
      </div>

      {/* Interactive Hybrid Algorithm Tuning Controls */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-primary-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders size={18} className="text-primary-600" /> Interactive Hybrid Weight Balancer
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Drag the slider to adjust the ensemble blending ratio between Content-Based TF-IDF and Collaborative Filtering.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">
              Content: {Math.round(contentWeight * 100)}%
            </span>
            <span className="text-slate-400">+</span>
            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg border border-purple-200">
              Collab: {Math.round(collabWeight * 100)}%
            </span>
          </div>
        </div>

        {/* Slider */}
        <div className="space-y-2 pt-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={contentWeight}
            onChange={handleSliderChange}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
            <span>0% Content / 100% Collaborative (Social Clustering)</span>
            <span className="text-primary-600 font-bold">Default (60/40 Hybrid Balance)</span>
            <span>100% Content / 0% Collaborative (Pure TF-IDF)</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Category Preference Distribution (Radar / Bar) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Category Affinity Distribution</h3>
              <p className="text-xs text-slate-500">Relative interest score synthesized from interaction history</p>
            </div>
            <span className="text-[11px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded font-bold">
              Affinity %
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryAffinityData.slice(0, 6)} layout="vertical">
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <YAxis dataKey="category" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Interest Score']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', borderColor: '#e2e8f0' }}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {categoryAffinityData.slice(0, 6).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top-6 Recommendation Score Decomposition */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recommendation Score Decomposition</h3>
              <p className="text-xs text-slate-500">Breakdown of Content vs Collaborative contribution for top items</p>
            </div>
            <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
              Top 6 Matches
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDecompData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', borderColor: '#e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Content Similarity" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Collaborative Score" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: TF-IDF Extracted User Keywords & Interaction Event Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: TF-IDF User Profile Keywords Vector */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Brain size={16} className="text-primary-600" /> User Profile Feature Vector (Top TF-IDF Terms)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Top terms extracted from your interacted items and weighted with sublinear IDF:
            </p>
          </div>

          {userFeatureKeywords.length > 0 ? (
            <div className="space-y-2">
              {userFeatureKeywords.map((item, idx) => {
                const percentage = Math.round(item.weight * 100);
                return (
                  <div key={item.term} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-slate-800">
                        {idx + 1}. #{item.term}
                      </span>
                      <span className="text-[11px] font-semibold text-primary-600 font-mono">
                        TF-IDF: {item.weight.toFixed(4)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-primary-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(10, percentage))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
              No keywords extracted yet. Start browsing or viewing items to construct your vector!
            </div>
          )}
        </div>

        {/* Right: Live Interaction Log Table */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Activity size={16} className="text-emerald-600" /> Real-Time Interaction Event Stream
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every event updates the user feature vector locally in browser storage
              </p>
            </div>
            <span className="text-[11px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
              {interactions.length} Events
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 pr-1">
            {interactions.length > 0 ? (
              interactions.map((evt) => {
                const prod = evt.productId ? products.find(p => p.id === evt.productId) : null;
                return (
                  <div key={evt.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        evt.type === 'purchase' ? 'bg-emerald-100 text-emerald-800' :
                        evt.type === 'cart' ? 'bg-amber-100 text-amber-800' :
                        evt.type === 'wishlist' ? 'bg-rose-100 text-rose-800' :
                        evt.type === 'search' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {evt.type}
                      </span>
                      <span className="font-semibold text-slate-800 truncate">
                        {evt.query ? `Search: "${evt.query}"` : (prod ? prod.name : evt.productId)}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No events recorded yet. Click products or search to trigger interactions.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top AI Recommended Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Top Ranked Recommendations for {currentUser.name}
            </h2>
            <p className="text-xs text-slate-500">
              Evaluated with {Math.round(contentWeight * 100)}% Content + {Math.round(collabWeight * 100)}% Collaborative blend
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {recommendedProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showAIMatch={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

