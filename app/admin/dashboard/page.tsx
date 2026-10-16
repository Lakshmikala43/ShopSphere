'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, DollarSign, Users, Store, Package, ShoppingBag, TrendingUp, Tag, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminMetrics();
  }, []);

  const fetchAdminMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/metrics');
      const json = await res.json();
      setData(json);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 font-semibold text-xs">Loading admin platform metrics...</p>
      </div>
    );
  }

  if (!data || !data.metrics) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Admin Authorization Required</h2>
        <p className="text-xs text-slate-500">Log in as admin@stylekart.com to access platform administration.</p>
      </div>
    );
  }

  const { metrics, topCategories, recentOrders, salesChart } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-purple-600" /> Platform Admin Dashboard
        </h1>
        <p className="text-slate-500 text-xs">Global marketplace revenue, sellers approval, products, and coupon management</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Revenue</div>
          <div className="text-2xl font-black text-amber-400">₹{metrics.totalRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-400 font-bold">Processed via Sandbox</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Orders</div>
          <div className="text-2xl font-black text-indigo-600">{metrics.totalOrders}</div>
          <div className="text-[10px] text-slate-500 font-medium">{metrics.pendingOrders} pending delivery</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Registered Customers</div>
          <div className="text-2xl font-black text-slate-900">{metrics.totalUsers}</div>
          <div className="text-[10px] text-emerald-600 font-bold">Active user accounts</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Active Sellers & Products</div>
          <div className="text-2xl font-black text-purple-600">{metrics.totalSellers} / {metrics.totalProducts}</div>
          <div className="text-[10px] text-slate-500 font-medium">Verified stores</div>
        </div>
      </div>

      {/* Revenue Analytics Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" /> Revenue Growth & Sales Performance
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Bar dataKey="sales" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Top Categories & Recent Platform Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Categories (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-black text-sm text-slate-900">Top Categories Performance</h3>
          <div className="divide-y divide-slate-100 text-xs font-semibold text-slate-800">
            {topCategories.map((cat: any) => (
              <div key={cat.id} className="py-3 flex justify-between items-center">
                <span>{cat.name}</span>
                <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-bold">
                  {cat.productCount} Items
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-black text-sm text-slate-900">Recent Marketplace Transactions</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {recentOrders.map((ord: any) => (
              <div key={ord.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Order #{ord.orderNumber}</div>
                  <div className="text-slate-400">{ord.user?.name} ({ord.user?.email})</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900">₹{ord.totalAmount.toLocaleString('en-IN')}</div>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {ord.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
