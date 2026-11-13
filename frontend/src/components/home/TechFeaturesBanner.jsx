import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Cpu, Network, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function TechFeaturesBanner() {
  return (
    <section className="my-16 rounded-3xl bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-semibold border border-primary-500/30">
            <Sparkles size={13} className="text-primary-400" />
            Academic Engineering AI Architecture
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Dual-Core Recommendation Architecture
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
            This project solves the e-commerce information overload and cold-start problems using a hybrid ensemble combining high-dimensional TF-IDF vector space modeling with user-user collaborative filtering.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Sublinear TF-IDF:</strong> 1 + ln(count) document normalization</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>L2 Cosine Metric:</strong> Dot product in unit-sphere space</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Implicit Interaction Weighting:</strong> View, Cart, Wishlist, Purchase</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Dynamic Persona Switching:</strong> Real-time demo evaluation</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            <Link
              to="/architecture"
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-primary-600/30 transition-all"
            >
              Examine System Architecture & Math <ArrowRight size={14} />
            </Link>
            <Link
              to="/ai-dashboard"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all"
            >
              Open Live AI Analytics
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-950/80 p-6 rounded-2xl border border-slate-800 font-mono text-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
            <span className="flex items-center gap-1.5 text-primary-400">
              <Network size={14} /> Hybrid Scoring Equation
            </span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">v2.4</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl text-primary-300 overflow-x-auto">
            <code>Score(u, i) = α · CosSim(Vᵤ, Vᵢ) + (1-α) · PredRating(u, i)</code>
          </div>

          <div className="space-y-1.5 text-slate-400 text-[11px]">
            <p>• <strong>Vᵤ:</strong> Normalized user profile feature vector</p>
            <p>• <strong>Vᵢ:</strong> Normalized product TF-IDF keyword vector</p>
            <p>• <strong>α:</strong> Configurable balance parameter (default: 0.6)</p>
            <p>• <strong>PredRating:</strong> K-NN user correlation rating predictor</p>
          </div>
        </div>
      </div>
    </section>
  );
}

