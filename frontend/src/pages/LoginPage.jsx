import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Zap,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES_LIST } from '../data/products';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, quickDemoLogin } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Login inputs
  const [email, setEmail] = useState('demo@nexashop.ai');
  const [password, setPassword] = useState('password123');

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCategory, setRegCategory] = useState('Laptops');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(email, password);
    navigate(from, { replace: true });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;
    register({
      name: regName,
      email: regEmail,
      preferredCategory: regCategory
    });
    navigate(from, { replace: true });
  };

  const handleQuickDemo = () => {
    quickDemoLogin('Demo User', 'demo@nexashop.ai');
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header & Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 mb-8 space-y-2">
        <div className="inline-flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
            <Sparkles size={22} />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            NexaShop<span className="text-primary-400">.ai</span>
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Intelligent E-Commerce Recommendation System
        </h1>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Sign in to initialize your personalized machine learning recommendation profile.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 space-y-6 border border-slate-100">

          {/* Tab Selector */}
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setIsRegisterMode(false)}
              className={`flex-1 py-2.5 rounded-xl transition-all duration-200 ${
                !isRegisterMode
                  ? 'bg-white text-primary-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegisterMode(true)}
              className={`flex-1 py-2.5 rounded-xl transition-all duration-200 ${
                isRegisterMode
                  ? 'bg-white text-primary-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          {!isRegisterMode ? (
            /* --- SIGN IN FORM --- */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl text-xs border border-slate-200 outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-medium text-slate-800"
                  />
                  <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl text-xs border border-slate-200 outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-medium text-slate-800"
                  />
                  <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                Sign In to Store <ArrowRight size={15} />
              </button>

              {/* Quick 1-Click Demo Access Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="w-full py-2.5 bg-slate-50 hover:bg-primary-50 text-slate-700 hover:text-primary-700 border border-slate-200 hover:border-primary-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Zap size={14} className="text-primary-600" />
                  Quick Demo Access (1-Click)
                </button>
              </div>
            </form>
          ) : (
            /* --- CREATE ACCOUNT FORM --- */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl text-xs border border-slate-200 outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-medium text-slate-800"
                  />
                  <User size={16} className="absolute left-3.5 top-3 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl text-xs border border-slate-200 outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-medium text-slate-800"
                  />
                  <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl text-xs border border-slate-200 outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-medium text-slate-800"
                  />
                  <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Primary Shopping Interest
                </label>
                <div className="relative">
                  <select
                    value={regCategory}
                    onChange={(e) => setRegCategory(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl text-xs border border-slate-200 outline-none font-semibold text-slate-800 cursor-pointer"
                  >
                    {CATEGORIES_LIST.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <Tag size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Initializes your personalized AI preference vector.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                Create Account & Enter <ArrowRight size={15} />
              </button>
            </form>
          )}

          {/* Trust Badge */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
            <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
            <span>Academic Demonstration Mode • Local Storage Persistence</span>
          </div>

        </div>
      </div>
    </div>
  );
}
