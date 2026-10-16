'use client';

import React, { useState } from 'react';
import ProductCard from '@/components/product-card';
import { Camera, Upload, Sparkles, Image as ImageIcon, Search } from 'lucide-react';

export default function VisualSearchPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [features, setFeatures] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        analyzeVisualImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeVisualImage = async (base64: string) => {
    setAnalyzing(true);
    setFeatures(null);
    setMatches([]);
    try {
      const res = await fetch('/api/visual-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const data = await res.json();
      setFeatures(data.features);
      setMatches(data.matches || []);
    } catch (err) {
      alert('Failed to analyze image');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          <Camera className="w-8 h-8 text-indigo-600" /> AI Visual Search
        </h1>
        <p className="text-slate-500 text-xs">Upload an outfit or product photo to discover similar items in our catalog</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Dropzone (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-center">
          <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors block bg-slate-50">
            {imagePreview ? (
              <img src={imagePreview} alt="Uploaded" className="w-48 h-48 object-cover rounded-xl shadow-md mb-2" />
            ) : (
              <>
                <Upload className="w-10 h-10 text-indigo-500 mb-2" />
                <span className="font-bold text-xs text-slate-800">Click to Upload Image</span>
                <span className="text-[11px] text-slate-400 mt-1">Supports JPG, PNG, WEBP</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          {analyzing && (
            <div className="p-4 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-amber-500" /> Analyzing visual attributes & matching database...
            </div>
          )}

          {features && (
            <div className="bg-slate-900 text-white p-4 rounded-2xl text-left text-xs space-y-2">
              <div className="font-bold text-indigo-300 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> Detected Visual Tags:
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {features.suggestedKeywords.map((kw: string) => (
                  <span key={kw} className="bg-white/10 text-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {matches.length === 0 && !analyzing && (
            <div className="bg-slate-50 rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-lg">No Visual Matches Displayed Yet</h3>
              <p className="text-xs text-slate-500">Upload an image on the left to start searching.</p>
            </div>
          )}

          {matches.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-black text-lg text-slate-900">Visually Similar Catalog Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {matches.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
