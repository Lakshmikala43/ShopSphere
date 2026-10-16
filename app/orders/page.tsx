'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronRight, Package, Truck, Clock } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 font-semibold text-xs">Fetching order history...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800">No Orders Placed Yet</h2>
        <p className="text-slate-500 text-xs">When you place orders, you can track their status and delivery live here.</p>
        <Link href="/shop" className="inline-block bg-indigo-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <ShoppingBag className="w-7 h-7 text-indigo-600" /> My Orders ({orders.length})
        </h1>
        <p className="text-slate-500 text-xs">Track shipment status and view invoices</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3 text-xs">
              <div>
                <span className="font-bold text-slate-900">Order #{order.orderNumber}</span>
                <div className="text-slate-400 text-[11px]">{new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                  order.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {order.orderStatus}
                </span>
                <span className="font-extrabold text-sm text-slate-900">
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product?.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                    alt={item.product?.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 line-clamp-1">{item.product?.name}</div>
                    <div className="text-slate-500">Qty: {item.quantity} · Price: ₹{item.unitPrice.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Truck className="w-4 h-4 text-indigo-600" /> Tracking: {order.trackingNumber || 'Processing'}
              </span>
              <Link
                href={`/orders/${order.id}`}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-4 py-2 rounded-xl flex items-center gap-1 transition-colors"
              >
                <span>Track & View Details</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
