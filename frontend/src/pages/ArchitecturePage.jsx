import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Cpu,
  Network,
  Sparkles,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Sliders,
  ArrowRight
} from 'lucide-react';

export default function ArchitecturePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-950 via-primary-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-semibold border border-primary-500/30">
          <BookOpen size={14} className="text-primary-400" />
          Academic AI Engineering Project Documentation
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Recommendation Algorithm Architecture & Math
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Comprehensive technical specifications, mathematical equations, vector space derivations, and viva defense questions for the <em>Intelligent E-Commerce Product Recommendation System</em>.
        </p>
      </div>

      {/* Architecture Flow Diagram */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Network size={22} className="text-primary-600" />
          1. System Architecture & Information Flow
        </h2>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs overflow-x-auto text-slate-700 leading-relaxed">
          <pre>{`
  [User Actions (View, Search, Cart, Wishlist, Buy)]
                       │
                       ▼
         [Interaction Weighting Engine]
  ┌────────────────────────────────────────────────────────┐
  │ View: 1.5x | Search: 2.5x | Wishlist: 3.5x             │
  │ Cart: 4.0x | Purchase: 5.0x (Recency decay λ)           │
  └────────────────────────┬───────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
  [A. Content-Based Pipeline]    [B. Collaborative Pipeline]
  • Document Text Concatenation   • User-Item Interaction Matrix R
  • Tokenization & Stop Words     • Pre-seeded Persona Archetypes
  • Sublinear TF & Smooth IDF     • User-User Cosine Similarity
  • L2 Normalization              • K-NN Rating Prediction
  • User Vector Synthesis         • Item-Item Co-occurrence
             │                           │
             └─────────────┬─────────────┘
                           │
                           ▼
            [C. Hybrid Ensemble Scorer]
        Score = α · Content + (1 - α) · Collab
        Filter: Exclude Purchased Alternatives
                           │
                           ▼
          [Explainable AI & Match Badge]
         (e.g., 94% Match • "Browsing Electronics")
          `}</pre>
        </div>
      </section>

      {/* Mathematical Formulations */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Brain size={22} className="text-primary-600" />
          2. Mathematical Formulations & Derivations
        </h2>

        {/* Content-Based Formula */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-primary-700 uppercase tracking-wider">
              A. Content-Based TF-IDF & Cosine Similarity
            </h3>
            <span className="text-[11px] font-mono bg-primary-50 px-2 py-0.5 rounded text-primary-700">
              Vector Space Model
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <p>
              Each product in the catalog is represented as a high-dimensional vector in a bag-of-words vector space derived from its <strong>Title</strong>, <strong>Category</strong>, <strong>Brand</strong>, <strong>Description</strong>, <strong>Tags</strong>, and <strong>Technical Specs</strong>.
            </p>

            <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl font-mono space-y-2">
              <p className="text-primary-300 font-bold">1. Sublinear Term Frequency (TF):</p>
              <code>TF(t, d) = 1 + ln(count(t, d))  if count(t, d) &gt; 0, else 0</code>

              <p className="text-primary-300 font-bold pt-2">2. Smoothed Inverse Document Frequency (IDF):</p>
              <code>IDF(t) = ln( (1 + N) / (1 + DF(t)) ) + 1</code>
              <p className="text-[11px] text-slate-400">where N is total products (42+) and DF(t) is number of products containing term t.</p>

              <p className="text-primary-300 font-bold pt-2">3. L2 Normalization & Cosine Similarity:</p>
              <code>V_norm = V / sqrt( sum(V_i^2) )</code>
              <code>CosineSim(u, i) = dot_product(V_u_norm, V_i_norm) = sum( V_u[k] * V_i[k] )</code>
            </div>

            <p>
              The user profile vector <code>V_u</code> is constructed by aggregating product vectors from items the user interacted with, weighted by their action weights:
            </p>
            <div className="p-3 bg-slate-100 rounded-xl font-mono text-[11px]">
              V_u = sum( w_action * lambda_recency * V_item ) + sum( w_search * V_query )
            </div>
          </div>
        </div>

        {/* Collaborative Filtering Formula */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider">
              B. User-User Collaborative Filtering (K-Nearest Neighbors)
            </h3>
            <span className="text-[11px] font-mono bg-indigo-50 px-2 py-0.5 rounded text-indigo-700">
              Implicit Feedback Matrix
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <p>
              Collaborative filtering leverages implicit ratings from multiple shopping archetypes. Cosine correlation is computed between active user vector <code>R_u</code> and neighbor vectors <code>R_v</code> across shared product dimensions:
            </p>

            <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl font-mono space-y-2">
              <p className="text-indigo-300 font-bold">1. User Cosine Correlation:</p>
              <code>Sim(u, v) = (R_u • R_v) / ( ||R_u||_2 * ||R_v||_2 )</code>

              <p className="text-indigo-300 font-bold pt-2">2. K-NN Predicted Rating:</p>
              <code>R_hat(u, i) = sum( Sim(u, v) * R(v, i) ) / sum( |Sim(u, v)| )</code>

              <p className="text-indigo-300 font-bold pt-2">3. Normalized Collaborative Score:</p>
              <code>CollabScore(u, i) = clip( R_hat(u, i) / 5.0, 0.0, 1.0 )</code>
            </div>
          </div>
        </div>

        {/* Hybrid Combination Formula */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">
              C. Hybrid Ensemble & Cold-Start Solution
            </h3>
            <span className="text-[11px] font-mono bg-emerald-50 px-2 py-0.5 rounded text-emerald-700">
              Ensemble Re-ranking
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl font-mono space-y-2">
              <code>HybridScore(u, i) = α * ContentSim(u, i) + (1 - α) * CollabScore(u, i) + RatingBonus(i)</code>
              <p className="text-[11px] text-slate-400">Where default α = 0.6 (configurable from 0.0 to 1.0 in the AI Dashboard slider).</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800">Cold-Start Mitigation:</span>
                <p className="text-[11px] text-slate-500">
                  When a new user arrives with zero prior history (Cold-Start Persona), the system falls back to a Bayesian rating prior blended with product review volume: <code>0.7 * (Rating/5) + 0.3 * (Popularity/1000)</code> with diverse category distribution.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800">Purchased Item Exclusion:</span>
                <p className="text-[11px] text-slate-500">
                  Products already purchased by the user are automatically removed from recommendation trays when suitable alternatives exist, preventing redundant suggestions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Academic Viva & Interview Questions */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle size={22} className="text-primary-600" />
            3. Project Defense & Viva Voce Q&A
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Standard questions asked by examiners during computer science and AI engineering project evaluations:
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">
              Q1: What is the difference between Content-Based and Collaborative Filtering in your project?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              <strong>Answer:</strong> Content-Based Filtering inspects the intrinsic metadata of products (brand, category, description keywords) using TF-IDF vectors and computes cosine similarity with the user's interaction history. Collaborative Filtering does not read product text; instead, it looks at the user-item interaction matrix, identifying users who shared similar browsing/purchasing habits and recommending items those similar users enjoyed.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">
              Q2: Why did you use TF-IDF rather than simple keyword frequency (Bag of Words)?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              <strong>Answer:</strong> Simple frequency rewards common generic words like "quality" or "device" that appear everywhere. TF-IDF applies an inverse document frequency penalty, heavily prioritizing unique, discriminative terms like "Mechanical", "OLED", "Espresso", or "Selvedge" which truly define the product's semantic essence.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">
              Q3: How does your system solve the User Cold-Start problem?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              <strong>Answer:</strong> When a user has 0 interactions, collaborative filtering cannot find neighbors. Our system smoothly switches to a Bayesian smoothed popularity baseline (weighting verified review counts and star ratings across diverse categories). Furthermore, the very first product click immediately updates the user's vector, adapting the feed in sub-second time.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">
              Q4: What makes your AI "Explainable" (XAI)?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              <strong>Answer:</strong> Every single recommended product has an explicit attribution reason (e.g. "Because you frequently browse Headphones", "Complementary to items in your wishlist", or "High feature overlap with MacBook Pro"). We compute which factor had the dominant dot-product or neighbor correlation, rather than presenting a black-box list.
            </p>
          </div>
        </div>
      </section>

      {/* CTA to live dashboard */}
      <div className="p-6 rounded-3xl bg-primary-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold">Experience the Live Recommendations</h3>
          <p className="text-xs text-primary-100">Test the math on the interactive dashboard with real-time sliders.</p>
        </div>
        <Link
          to="/ai-dashboard"
          className="px-5 py-2.5 bg-white text-primary-700 hover:bg-primary-50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md flex-shrink-0"
        >
          <Sliders size={14} /> Open Live AI Dashboard
        </Link>
      </div>
    </div>
  );
}

