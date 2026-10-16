'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, MapPin, ShoppingBag, Heart, LogOut, ShieldCheck } from 'lucide-react';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccountDetails();
  }, []);

  const fetchAccountDetails = async () => {
    setLoading(true);
    try {
      const [resMe, resAddr] = await Promise.all([
        fetch('/api/auth/me').then((r) => r.json()),
        fetch('/api/addresses').then((r) => r.json()),
      ]);

      if (resMe.user) setUser(resMe.user);
      if (resAddr.addresses) setAddresses(resAddr.addresses);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 font-semibold text-xs">Loading profile & address book...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Please Sign In</h2>
        <p className="text-xs text-slate-500">You must be logged in to view your account profile.</p>
        <Link href="/login" className="inline-block bg-indigo-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
        <img
          src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-100"
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">{user.name}</h1>
            <span className="bg-indigo-50 text-indigo-700 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
              {user.role}
            </span>
          </div>
          <div className="text-xs text-slate-500">{user.email} · {user.phone || 'No phone added'}</div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/orders" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500 transition-colors flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900">My Orders</div>
            <div className="text-[11px] text-slate-500">Track & return orders</div>
          </div>
        </Link>

        <Link href="/wishlist" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-pink-500 transition-colors flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900">Wishlist</div>
            <div className="text-[11px] text-slate-500">Saved favorite products</div>
          </div>
        </Link>

        <Link href="/shop" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-500 transition-colors flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900">Style Preferences</div>
            <div className="text-[11px] text-slate-500">AI recommendations</div>
          </div>
        </Link>
      </div>

      {/* Saved Addresses Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-600" /> Saved Delivery Addresses ({addresses.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {addresses.map((addr) => (
            <div key={addr.id} className="p-4 rounded-2xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">{addr.fullName}</div>
              <div className="text-slate-600">{addr.line1}, {addr.line2}</div>
              <div className="text-slate-600">{addr.city}, {addr.state} - {addr.postalCode}</div>
              <div className="text-slate-500 font-semibold pt-1">Phone: {addr.phone}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
