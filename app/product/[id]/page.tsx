'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/product-card';
import {
  Star,
  ShoppingCart,
  Heart,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Store,
  CheckCircle,
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  // Review submission form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    fetchProductDetails();
  }, [params.id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();
      if (data.product) {
        setProduct(data.product);
        setSimilarProducts(data.similarProducts || []);
        setSelectedImage(data.product.images[0]?.url || '');
        if (data.product.variants && data.product.variants.length > 0) {
          setSelectedVariant(data.product.variants[0]);
        }
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant?.id,
          quantity,
        }),
      });
      if (res.ok) {
        router.push('/cart');
      }
    } catch (err) {
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle || !reviewComment) return;
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviewMsg('Thank you! Your verified review has been published.');
        setReviewTitle('');
        setReviewComment('');
        fetchProductDetails();
      } else {
        setReviewMsg(data.error || 'Failed to submit review');
      }
    } catch (err) {
      setReviewMsg('Server error while submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 font-semibold text-xs">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product not found</h2>
        <Link href="/shop" className="text-indigo-600 font-bold text-xs underline">
          Return to Shop Catalog
        </Link>
      </div>
    );
  }

  const specs = JSON.parse(product.specifications || '{}');
  const originalPrice = Math.round(product.price / (1 - product.discountPercent / 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:underline">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="font-semibold text-slate-800 line-clamp-1">{product.name}</span>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="w-full aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-md relative">
            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
            {product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white font-black text-xs px-3 py-1 rounded-lg uppercase shadow-md">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img: any) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === img.url ? 'border-indigo-600 scale-105 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
              {product.brand} · {product.category?.name}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Rating & Seller */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-lg border border-amber-200">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{product.averageRating}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount} reviews)</span>
            </div>
            <span>|</span>
            <div className="flex items-center gap-1 text-slate-600 font-medium">
              <Store className="w-4 h-4 text-slate-400" />
              <span>Sold by <strong className="text-slate-800">{product.seller?.storeName}</strong></span>
            </div>
          </div>

          {/* Price Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
            {product.discountPercent > 0 && (
              <>
                <span className="text-sm font-semibold text-slate-400 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-rose-600">Save ₹{(originalPrice - product.price).toLocaleString('en-IN')}</span>
              </>
            )}
            <span className="ml-auto text-[11px] text-slate-500 font-medium">Inclusive of all taxes</span>
          </div>

          {/* Size / Color Variants Swatches */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Select Size / Option: <span className="text-indigo-600">{selectedVariant?.size || 'Standard'}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedVariant?.id === v.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400'
                      }`}
                    >
                      {v.size || 'Standard'} - {v.color || 'Default'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Status */}
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>In Stock ({selectedVariant?.stock || 10} items ready for immediate dispatch)</span>
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quantity:</span>
            <div className="flex items-center border border-slate-200 rounded-xl bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-slate-600 font-bold hover:bg-slate-100 rounded-l-xl"
              >
                -
              </button>
              <span className="px-4 py-1 text-xs font-bold text-slate-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-slate-600 font-bold hover:bg-slate-100 rounded-r-xl"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-sm transition-transform hover:scale-[1.02]"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Shopping Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-slate-950 hover:bg-slate-800 text-white font-black py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm transition-transform hover:scale-[1.02]"
            >
              <Zap className="w-5 h-5 text-amber-400" /> Buy Now
            </button>
          </div>

          {/* Value Props Badges */}
          <div className="grid grid-cols-3 gap-3 border-t border-slate-200 pt-4 text-center">
            <div className="flex flex-col items-center text-[11px] font-semibold text-slate-600">
              <Truck className="w-5 h-5 text-indigo-600 mb-1" /> Express Delivery
            </div>
            <div className="flex flex-col items-center text-[11px] font-semibold text-slate-600">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" /> 100% Genuine
            </div>
            <div className="flex flex-col items-center text-[11px] font-semibold text-slate-600">
              <RotateCcw className="w-5 h-5 text-purple-600 mb-1" /> 7 Day Returns
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Specifications / Reviews */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex border-b border-slate-200 gap-6 text-sm font-bold text-slate-500">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 transition-colors ${activeTab === 'desc' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'hover:text-slate-900'}`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 transition-colors ${activeTab === 'specs' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'hover:text-slate-900'}`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition-colors ${activeTab === 'reviews' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'hover:text-slate-900'}`}
          >
            Reviews ({product.reviews?.length || 0})
          </button>
        </div>

        {activeTab === 'desc' && (
          <div className="text-slate-700 text-sm leading-relaxed max-w-4xl space-y-3">
            <p>{product.description}</p>
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 text-xs text-indigo-900 space-y-1">
              <span className="font-bold flex items-center gap-1"><Sparkles className="w-4 h-4 text-indigo-600" /> AI Style Notes:</span>
              <p>This product pairs exceptionally well with tailored trousers, sneakers, or analog wristwatches.</p>
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="max-w-2xl divide-y divide-slate-100 text-xs">
            {Object.entries(specs).map(([key, val]: any) => (
              <div key={key} className="py-2.5 flex justify-between">
                <span className="font-bold text-slate-500 uppercase">{key}</span>
                <span className="font-semibold text-slate-900">{val}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8 max-w-3xl">
            {/* Submit Review Form */}
            <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-sm text-slate-900">Write a Verified Buyer Review</h4>
              {reviewMsg && <div className="text-xs font-bold text-indigo-600">{reviewMsg}</div>}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-700">Rating:</span>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(parseInt(e.target.value))}
                  className="bg-white border border-slate-200 rounded-lg p-1.5 font-bold"
                >
                  <option value={5}>5 Stars ★★★★★</option>
                  <option value={4}>4 Stars ★★★★☆</option>
                  <option value={3}>3 Stars ★★★☆☆</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Review headline (e.g. Excellent build quality!)"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
              />
              <textarea
                placeholder="Share details of your experience with this product..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium h-24"
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm"
              >
                Submit Review
              </button>
            </form>

            {/* Existing Reviews */}
            <div className="space-y-4">
              {product.reviews?.map((r: any) => (
                <div key={r.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                        {r.user.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{r.user.name}</div>
                        <div className="text-[10px] text-emerald-600 font-semibold">Verified Purchase</div>
                      </div>
                    </div>
                    <div className="text-amber-400 font-bold text-xs flex">
                      {'★'.repeat(r.rating)}
                    </div>
                  </div>
                  <h5 className="font-bold text-xs text-slate-900">{r.title}</h5>
                  <p className="text-xs text-slate-600">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-xl font-black text-slate-900">Customers Also Viewed</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
