'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({ subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0 });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setCartItems(data.cartItems || []);
      setSummary(data.summary || { subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0 });
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId, quantity: newQty }),
      });
      fetchCart();
    } catch (err) {}
  };

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await fetch(`/api/cart?id=${cartItemId}`, { method: 'DELETE' });
      fetchCart();
    } catch (err) {}
  };

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (code === 'STYLE10') {
      setAppliedCoupon({ code: 'STYLE10', discountPercent: 10 });
      setCouponMsg('10% discount coupon applied successfully!');
    } else if (code === 'WELCOME20') {
      setAppliedCoupon({ code: 'WELCOME20', discountPercent: 20 });
      setCouponMsg('20% welcome coupon applied successfully!');
    } else if (code === 'FESTIVE30') {
      setAppliedCoupon({ code: 'FESTIVE30', discountPercent: 30 });
      setCouponMsg('30% festive coupon applied successfully!');
    } else {
      setCouponMsg('Invalid promo code. Try STYLE10 or WELCOME20.');
    }
  };

  // Recalculate summary with applied coupon discount
  const couponDiscount = appliedCoupon
    ? Math.round((summary.subtotal * appliedCoupon.discountPercent) / 100)
    : 0;
  const finalTotal = Math.max(0, summary.subtotal - summary.discount - couponDiscount + summary.shipping + summary.tax);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 font-semibold text-xs">Loading shopping cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto border border-indigo-100">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Your Shopping Cart is Empty</h2>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Explore our multi-category marketplace or let our AI Stylist curate a look for you!
          </p>
        </div>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/shop"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-transform hover:scale-105"
          >
            Explore Shop Catalog
          </Link>
          <Link
            href="/ai-stylist"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-transform hover:scale-105 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> AI Fashion Stylist
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-indigo-600" /> Shopping Cart ({cartItems.length} Items)
        </h1>
        <p className="text-slate-500 text-xs">Review your selected items and apply coupons before checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Item List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl border border-slate-100 flex-shrink-0"
                />
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{item.brand}</div>
                  <Link href={`/product/${item.productId}`} className="font-bold text-sm text-slate-900 hover:text-indigo-600 line-clamp-1">
                    {item.name}
                  </Link>
                  <div className="text-xs text-slate-500">
                    Size: <span className="font-semibold text-slate-800">{item.size}</span> · Color:{' '}
                    <span className="font-semibold text-slate-800">{item.color}</span>
                  </div>
                  <div className="font-extrabold text-sm text-slate-900 sm:hidden">
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Price */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 border-t sm:border-0 pt-3 sm:pt-0 border-slate-100">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 font-bold text-slate-600 hover:bg-slate-200 rounded-l-xl text-xs"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-bold text-xs text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 font-bold text-slate-600 hover:bg-slate-200 rounded-r-xl text-xs"
                  >
                    +
                  </button>
                </div>

                <div className="hidden sm:block text-right">
                  <div className="font-black text-base text-slate-900">₹{item.subtotal.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-400">₹{item.price.toLocaleString('en-IN')} each</div>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <Link href="/shop" className="text-xs font-bold text-indigo-600 hover:underline">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-indigo-600" /> Have a Promo Coupon?
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter code e.g. STYLE10"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold uppercase focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                Apply
              </button>
            </div>
            {couponMsg && <div className="text-[11px] font-bold text-indigo-600">{couponMsg}</div>}
          </div>

          {/* Itemized Order Summary */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
            <h3 className="font-black text-lg border-b border-slate-800 pb-3">Order Summary</h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} Items)</span>
                <span className="font-bold text-white">₹{summary.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-rose-400 font-semibold">
                  <span>Product Discount</span>
                  <span>-₹{summary.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Shipping Fee</span>
                <span className="font-bold text-emerald-400">
                  {summary.shipping === 0 ? 'FREE' : `₹${summary.shipping}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST Tax (5%)</span>
                <span className="font-bold text-white">₹{summary.tax.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
              <div>
                <div className="text-xs text-slate-400 font-semibold">Final Total</div>
                <div className="text-[10px] text-slate-500">Recalculated Server-Side</div>
              </div>
              <div className="text-2xl font-black text-amber-400">
                ₹{finalTotal.toLocaleString('en-IN')}
              </div>
            </div>

            <button
              onClick={() => {
                const params = appliedCoupon ? `?coupon=${appliedCoupon.code}` : '';
                router.push(`/checkout${params}`);
              }}
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-black py-4 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 text-sm transition-transform hover:scale-[1.02]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-bit SSL Encrypted Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
