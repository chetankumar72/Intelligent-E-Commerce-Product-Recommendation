import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User, Mail, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES_LIST } from '../data/products';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferredCategory, setPreferredCategory] = useState('Laptops');

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    register({ name, email, preferredCategory });
    navigate('/ai-dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Sparkles size={24} />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create AI Shopper Profile
        </h1>
        <p className="text-xs text-slate-500">
          Register with a seed category preference to jumpstart your recommendations
        </p>
      </div>

      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] text-emerald-800 flex items-center gap-2">
        <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
        <span>Demonstration profile. Saves to local browser storage automatically.</span>
      </div>

      <form onSubmit={handleRegister} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Lin"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl text-xs border border-slate-200 outline-none focus:bg-white focus:border-primary-500"
            />
            <User size={15} className="absolute left-3 top-3 text-slate-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maya.lin@example.com"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl text-xs border border-slate-200 outline-none focus:bg-white focus:border-primary-500"
            />
            <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Seed Category Preference (Cold-Start Priors)
          </label>
          <select
            value={preferredCategory}
            onChange={(e) => setPreferredCategory(e.target.value)}
            className="w-full p-2.5 bg-slate-50 rounded-xl text-xs border border-slate-200 outline-none font-semibold text-slate-800"
          >
            {CATEGORIES_LIST.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <p className="text-[10px] text-slate-400 mt-1">
            Gives the recommendation engine an initial prior before you log any views.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/25 flex items-center justify-center gap-1.5 transition-all"
        >
          Create Profile & Enter Studio <ArrowRight size={14} />
        </button>

        <div className="text-center text-xs text-slate-500 pt-1">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </form>
    </div>
  );
}

