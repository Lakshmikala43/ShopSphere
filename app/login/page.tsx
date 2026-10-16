'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, UserCheck, ShieldCheck, Store } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.user.role === 'SELLER') router.push('/seller/dashboard');
        else if (data.user.role === 'ADMIN') router.push('/admin/dashboard');
        else router.push('/shop');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Server error during login');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role: 'CUSTOMER' | 'SELLER' | 'ADMIN') => {
    if (role === 'CUSTOMER') {
      setEmail('customer@stylekart.com');
      setPassword('password123');
    } else if (role === 'SELLER') {
      setEmail('seller@stylekart.com');
      setPassword('password123');
    } else if (role === 'ADMIN') {
      setEmail('admin@stylekart.com');
      setPassword('password123');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl mx-auto shadow-lg shadow-indigo-200">
          SK
        </div>
        <h1 className="text-2xl font-black text-slate-900">Sign in to StyleKart AI</h1>
        <p className="text-slate-500 text-xs">Access your customer profile, order history, or seller dashboard</p>
      </div>

      {/* Demo Credentials Quick Fill Buttons */}
      <div className="bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-100 space-y-2 text-xs">
        <div className="font-bold text-indigo-900 flex items-center gap-1">
          <UserCheck className="w-4 h-4 text-indigo-600" /> 1-Click Demo Accounts Fill:
        </div>
        <div className="grid grid-cols-3 gap-1.5 font-bold">
          <button
            type="button"
            onClick={() => fillDemoAccount('CUSTOMER')}
            className="p-1.5 bg-white border border-indigo-200 hover:bg-indigo-600 hover:text-white rounded-xl text-slate-800 text-[11px] transition-colors"
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount('SELLER')}
            className="p-1.5 bg-white border border-indigo-200 hover:bg-indigo-600 hover:text-white rounded-xl text-slate-800 text-[11px] transition-colors"
          >
            Seller
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount('ADMIN')}
            className="p-1.5 bg-white border border-indigo-200 hover:bg-indigo-600 hover:text-white rounded-xl text-slate-800 text-[11px] transition-colors"
          >
            Admin
          </button>
        </div>
      </div>

      <form onSubmit={handleLogin} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        {error && <div className="p-3 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl">{error}</div>}

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 uppercase">Email Address</label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="email"
              required
              placeholder="customer@stylekart.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 uppercase">Password</label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-xl shadow-md text-xs flex items-center justify-center gap-2"
        >
          <span>Sign In to Account</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <Link href="/register" className="font-bold text-indigo-600 hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}
