'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  RotateCcw,
  AlertCircle,
  MapPin,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function SingleOrderTrackingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('Size mismatch');
  const [returnComments, setReturnComments] = useState('');
  const [submittingReturn, setSubmittingReturn] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [params.id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      const data = await res.json();
      setOrder(data.order || null);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await fetch(`/api/orders/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL' }),
      });
      if (res.ok) fetchOrderDetails();
    } catch (err) {}
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReturn(true);
    try {
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: params.id,
          reason: returnReason,
          comments: returnComments,
        }),
      });
      if (res.ok) {
        setShowReturnModal(false);
        fetchOrderDetails();
      }
    } catch (err) {
    } finally {
      setSubmittingReturn(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 font-semibold text-xs">Loading order tracking timeline...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Order Not Found</h2>
        <Link href="/orders" className="text-indigo-600 font-bold text-xs underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const stages = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentStageIndex = stages.indexOf(order.orderStatus);

  const address = JSON.parse(order.shippingAddress || '{}');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/orders" className="hover:underline">My Orders</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="font-semibold text-slate-800">Order #{order.orderNumber}</span>
      </div>

      {/* Header Info */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-indigo-600 uppercase">StyleKart Order Details</div>
          <h1 className="text-2xl font-black text-slate-900">Order #{order.orderNumber}</h1>
          <div className="text-xs text-slate-500">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
        </div>

        <div className="flex items-center gap-2">
          {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && (
            <button
              onClick={handleCancelOrder}
              className="bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
            >
              Cancel Order
            </button>
          )}

          {order.orderStatus === 'DELIVERED' && (
            <button
              onClick={() => setShowReturnModal(true)}
              className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Request Return / Refund
            </button>
          )}
        </div>
      </div>

      {/* Visual Tracking Timeline */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="font-black text-base flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-400" /> Live Visual Tracking Timeline
          </h3>
          <span className="text-xs text-slate-400 font-semibold">
            Courier: <strong className="text-indigo-300">{order.courierName}</strong> ({order.trackingNumber})
          </span>
        </div>

        {/* Progress Bar Stages */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center text-xs">
          {stages.map((stg, i) => {
            const isPassed = currentStageIndex >= i;
            return (
              <div key={stg} className="flex flex-col items-center space-y-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                    isPassed
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/50'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                >
                  {isPassed ? '✓' : i + 1}
                </div>
                <span className={`font-bold text-[10px] uppercase ${isPassed ? 'text-indigo-300' : 'text-slate-500'}`}>
                  {stg.replace(/_/g, ' ')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Order Items + Address Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Items List (8 cols) */}
        <div className="md:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Ordered Items ({order.items.length})</h3>
          <div className="divide-y divide-slate-100">
            {order.items.map((item: any) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product?.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                    alt={item.product?.name}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-100"
                  />
                  <div>
                    <div className="font-bold text-slate-900 line-clamp-1">{item.product?.name}</div>
                    <div className="text-slate-500">Seller: {item.seller?.storeName}</div>
                    <div className="text-slate-500">Quantity: {item.quantity}</div>
                  </div>
                </div>
                <div className="font-black text-slate-900">₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Address & Payment Info (4 cols) */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-600" /> Delivery Address
            </h4>
            <div className="font-bold text-slate-800">{address.fullName}</div>
            <div className="text-slate-600">{address.line1}, {address.line2}</div>
            <div className="text-slate-600">{address.city}, {address.state} - {address.postalCode}</div>
            <div className="text-slate-500 font-semibold">Phone: {address.phone}</div>
          </div>

          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider">Payment Information</h4>
            <div className="flex justify-between">
              <span className="text-slate-500">Method:</span>
              <span className="font-bold text-slate-800">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Status:</span>
              <span className="font-bold text-emerald-600">{order.paymentStatus}</span>
            </div>
            <div className="flex justify-between font-black text-sm border-t border-slate-200 pt-2 text-slate-900">
              <span>Total Paid:</span>
              <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleReturnSubmit} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900">Request Product Return / Refund</h3>
            <div className="space-y-2 text-xs">
              <label className="font-semibold text-slate-700">Select Return Reason:</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
              >
                <option value="Size mismatch">Size mismatch / Doesn't fit</option>
                <option value="Defective item">Defective or damaged product</option>
                <option value="Wrong item received">Wrong item received</option>
                <option value="Product not as expected">Product not as described</option>
              </select>
            </div>
            <textarea
              placeholder="Additional comments for pickup agent..."
              value={returnComments}
              onChange={(e) => setReturnComments(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs h-24"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingReturn}
                className="bg-indigo-600 text-white font-bold text-xs px-5 py-2 rounded-xl"
              >
                Submit Return Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
