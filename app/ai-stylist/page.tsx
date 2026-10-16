'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ShoppingBag, Check, ArrowRight, DollarSign, Tag, RefreshCw } from 'lucide-react';

export default function AIFashionStylistPage() {
  const router = useRouter();

  // Wizard selections
  const [occasion, setOccasion] = useState('Wedding');
  const [style, setStyle] = useState('Traditional');
  const [budget, setBudget] = useState(999);
  const [colorPref, setColorPref] = useState('Crimson / Red');
  const [categoryPref, setCategoryPref] = useState('All');

  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [addingAll, setAddingAll] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const occasions = ['College', 'Office', 'Wedding', 'Party', 'Casual', 'Date', 'Travel', 'Festival', 'Sports'];
  const styles = ['Casual', 'Formal', 'Streetwear', 'Traditional', 'Minimal', 'Trendy', 'Luxury'];

  const handleGenerateOutfit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setRecommendation(null);
    try {
      const res = await fetch('/api/ai/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          style,
          budget,
          colorPreference: colorPref,
          categoryPreference: categoryPref,
        }),
      });
      const data = await res.json();
      setRecommendation(data);
    } catch (err) {
      alert('Failed to generate outfit');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntireOutfitToCart = async () => {
    if (!recommendation || !recommendation.items) return;
    setAddingAll(true);
    try {
      for (const item of recommendation.items) {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: item.productId,
            variantId: item.variantId,
            quantity: 1,
          }),
        });
      }
      setAddedSuccess(true);
      setTimeout(() => {
        router.push('/cart');
      }, 1200);
    } catch (err) {
      alert('Failed to add complete outfit to cart');
    } finally {
      setAddingAll(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 text-white p-8 rounded-3xl shadow-2xl border border-indigo-500/30 text-center relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3.5 py-1 rounded-full border border-indigo-400/30">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" /> AI Personal Fashion Assistant
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">StyleKart AI Fashion Stylist</h1>
          <p className="text-slate-300 text-xs leading-relaxed">
            Specify your occasion, desired vibe, and budget limit. Our AI stylist queries our database catalog in real time to engineer a complete, coordinated outfit!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Wizard Form Sidebar (5 cols) */}
        <form onSubmit={handleGenerateOutfit} className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="font-black text-base text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> Outfit Curator Criteria
          </h2>

          {/* 1. Occasion */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">1. Select Occasion</label>
            <div className="grid grid-cols-3 gap-2">
              {occasions.map((o) => (
                <button
                  type="button"
                  key={o}
                  onClick={() => setOccasion(o)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-colors ${
                    occasion === o
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Style Aesthetic */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">2. Aesthetic Vibe</label>
            <div className="grid grid-cols-3 gap-2">
              {styles.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-colors ${
                    style === s
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Budget Limit */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <label className="text-slate-800 uppercase tracking-wider">3. Max Outfit Budget (₹)</label>
              <span className="text-indigo-600 text-sm font-black">₹{budget.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="200"
              max="1000"
              step="50"
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          {/* 4. Preferred Color */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">4. Color Preference</label>
            <input
              type="text"
              placeholder="e.g. White, Black, Crimson, Pastel Blue"
              value={colorPref}
              onChange={(e) => setColorPref(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm transition-transform hover:scale-[1.02]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Querying Database & Matching Style...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" /> Curate Complete Outfit Now
              </span>
            )}
          </button>
        </form>

        {/* Results Outfit Breakdown Area (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!recommendation && !loading && (
            <div className="bg-slate-50 rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-3">
              <Sparkles className="w-12 h-12 text-indigo-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-lg">Ready to Curate Your Look</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select your occasion and budget on the left, then click "Curate Complete Outfit Now".
              </p>
            </div>
          )}

          {recommendation && (
            <div className="space-y-6">
              {/* Outfit Header Summary Card */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    AI Curated Result
                  </span>
                  <h3 className="text-xl font-black mt-1">{recommendation.outfitTitle}</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md">{recommendation.explanation}</p>
                </div>
                <div className="text-right sm:border-l border-slate-800 sm:pl-6">
                  <div className="text-xs text-slate-400">Total Outfit Price</div>
                  <div className="text-2xl font-black text-amber-400">₹{recommendation.totalCost.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">
                    Budget Saved: ₹{recommendation.remainingBudget.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Items Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendation.items.map((item: any) => (
                  <div key={item.productId} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-slate-100" />
                      <div className="flex-1 min-w-0">
                        <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                          {item.categoryRole}
                        </span>
                        <div className="font-bold text-xs text-slate-900 line-clamp-1 mt-1">{item.name}</div>
                        <div className="text-[11px] text-slate-500">{item.brand}</div>
                        <div className="font-black text-xs text-indigo-600 mt-0.5">₹{item.price.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 italic border border-slate-100">
                      "{item.reason}"
                    </div>
                  </div>
                ))}
              </div>

              {/* One Click Add Complete Outfit to Cart */}
              <button
                onClick={handleAddEntireOutfitToCart}
                disabled={addingAll}
                className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:scale-[1.01]'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-5 h-5" /> Outfit Added to Cart! Redirecting...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> ADD COMPLETE OUTFIT TO CART (₹{recommendation.totalCost.toLocaleString('en-IN')})
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
