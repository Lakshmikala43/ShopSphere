'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'SELLER'>('CUSTOMER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, role }),
      });
      const data = await res.json();
      if (res.ok) {
        if (role === 'SELLER') router.push('/seller/dashboard');
        else router.push('/shop');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Server error during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl mx-auto shadow-lg shadow-indigo-200">
          SK
        </div>
        <h1 className="text-2xl font-black text-slate-900">Create StyleKart AI Account</h1>
        <p className="text-slate-500 text-xs">Join thousands of shoppers and sellers on our marketplace</p>
      </div>

      <form onSubmit={handleRegister} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        {error && <div className="p-3 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl">{error}</div>}

        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('CUSTOMER')}
            className={`flex-1 py-2 rounded-lg transition-colors ${role === 'CUSTOMER' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}
          >
            Customer Account
          </button>
          <button
            type="button"
            onClick={() => setRole('SELLER')}
            className={`flex-1 py-2 rounded-lg transition-colors ${role === 'SELLER' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}
          >
            Seller Store Account
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 uppercase">Full Name</label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              required
              placeholder="Priya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 uppercase">Email Address</label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="email"
              required
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 uppercase">Phone Number</label>
          <div className="relative flex items-center">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
          <span>Create Account</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-indigo-600 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
