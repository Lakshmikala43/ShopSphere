'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, ShoppingCart, Check } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    discountPercent: number;
    images: Array<{ url: string; isPrimary?: boolean }>;
    category?: { name: string };
    averageRating?: number;
    reviewCount?: number;
    variants?: Array<{ id: string; stock: number }>;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const primaryImage = product.images?.find((i) => i.isPrimary)?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30';
  const originalPrice = Math.round(product.price / (1 - product.discountPercent / 100));

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
    } catch (err) {
      // Revert if error
      setIsWishlisted(isWishlisted);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      const variantId = product.variants?.[0]?.id;
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, variantId, quantity: 1 }),
      });
      if (res.ok) {
        setAddedSuccess(true);
        setTimeout(() => setAddedSuccess(false), 2000);
      }
    } catch (err) {
      // Ignore
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Discount Badge */}
      {product.discountPercent > 0 && (
        <span className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
          {product.discountPercent}% OFF
        </span>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-pink-500 shadow-sm transition-colors"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-pink-500 text-pink-500' : ''}`} />
      </button>

      {/* Product Image Link */}
      <Link href={`/product/${product.id}`} className="block relative w-full aspect-square bg-slate-100 overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
            {product.brand}
          </div>
          <Link href={`/product/${product.id}`} className="block font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </Link>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="text-xs font-bold text-slate-700 ml-1">
              {product.averageRating || 4.5}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">({product.reviewCount || 12})</span>
        </div>

        {/* Price & Add To Cart Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            <div className="font-black text-base text-slate-900">₹{product.price.toLocaleString('en-IN')}</div>
            {product.discountPercent > 0 && (
              <div className="text-[11px] text-slate-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
              addedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white'
            }`}
            title="Add to Cart"
          >
            {addedSuccess ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
