import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/product-card';
import { Sparkles, ArrowRight, Flame, ShieldCheck, Tag, Zap, Camera, Award, ShoppingBag } from 'lucide-react';

export default async function HomePage() {
  // Fetch real database catalog products
  const [featuredProducts, dealProducts, trendingProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true, isApproved: true },
      include: { images: true, variants: true, category: true, reviews: { select: { rating: true } } },
      take: 8,
    }),
    prisma.product.findMany({
      where: { discountPercent: { gte: 25 }, isApproved: true },
      include: { images: true, variants: true, category: true, reviews: { select: { rating: true } } },
      take: 4,
    }),
    prisma.product.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      include: { images: true, variants: true, category: true, reviews: { select: { rating: true } } },
      take: 8,
    }),
    prisma.category.findMany({
      take: 12,
      include: { _count: { select: { products: true } } },
    }),
  ]);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-2xl border-b border-indigo-900/50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-bold px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>StyleKart AI Marketplace 2.0</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Smart Shopping Powered by <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">AI Fashion Intelligence</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Browse 1,000+ products across Fashion, Electronics, Footwear, and Beauty. Experience our revolutionary <strong>AI Fashion Stylist</strong> that curates complete outfits under your budget!
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/ai-stylist"
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 text-sm transition-transform hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Launch AI Fashion Stylist</span>
              </Link>
              <Link
                href="/shop"
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors flex items-center gap-2"
              >
                <span>Explore Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-br from-indigo-900/60 to-purple-900/60 p-6 rounded-3xl border border-indigo-500/30 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-300 border-b border-indigo-500/20 pb-3">
                <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-amber-400" /> Featured AI Stylist Pick</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md">Under ₹5000</span>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80"
                  alt="AI Outfit"
                  className="w-24 h-24 object-cover rounded-2xl border border-indigo-400/30"
                />
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Executive Office Look</div>
                  <div className="font-bold text-sm text-white">Elysian Organic Linen Shirt + Formal Trousers</div>
                  <div className="font-extrabold text-indigo-300 text-base">Outfit Total: ₹3,398</div>
                </div>
              </div>
              <Link
                href="/ai-stylist"
                className="block text-center bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs py-2.5 rounded-xl transition-colors"
              >
                Curate Your Custom Look →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 2. TOP CATEGORIES GRID */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Top Marketplace Categories</h2>
              <p className="text-slate-500 text-xs mt-0.5">Dynamic database categories with 100% verified stock</p>
            </div>
            <Link href="/shop" className="text-indigo-600 font-bold text-xs hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group bg-white border border-slate-200/80 rounded-2xl p-3 flex flex-col items-center text-center shadow-sm hover:shadow-lg hover:border-indigo-500 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 mb-2 border border-slate-100 group-hover:scale-110 transition-transform">
                  <img src={cat.image || 'https://images.unsplash.com/photo-1483985988355-763728e1935b'} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{cat._count.products} Products</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. TODAY'S DEALS */}
        <section className="bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Tag className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">Today's Flash Deals</h2>
                <p className="text-xs text-pink-100">Up to 50% off on top trending items</p>
              </div>
            </div>
            <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-amber-300 border border-white/10">
              Limited Stock Offers
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dealProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* 4. AI STYLIST CALLOUT BANNER */}
        <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border border-indigo-500/30">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" /> Next-Gen AI Feature
            </div>
            <h2 className="text-3xl sm:text-4xl font-black">Need an Outfit for a Wedding, Party, or College?</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Tell our AI Fashion Stylist your budget (e.g. ₹5,000), preferred occasion, and style. It queries our live product database to assemble a complete head-to-toe look with 1-click cart checkout!
            </p>
            <div className="pt-2">
              <Link
                href="/ai-stylist"
                className="bg-white hover:bg-slate-100 text-slate-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
              >
                <span>Try AI Fashion Stylist</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. BEST SELLERS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-500" /> Best Sellers
              </h2>
              <p className="text-slate-500 text-xs">Top rated items customer loved the most</p>
            </div>
            <Link href="/shop?sort=rating" className="text-indigo-600 font-bold text-xs hover:underline flex items-center gap-1">
              Shop Best Sellers <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* 6. VISUAL SEARCH CALLOUT */}
        <section className="bg-slate-100 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
              <Camera className="w-4 h-4" /> Visual AI Search
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Have an Image of a Outfit You Love?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload any fashion picture or product photo. Our AI visual analyzer will identify the category, color, and style, then match similar items from our catalog.
            </p>
          </div>
          <Link
            href="/visual-search"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-colors whitespace-nowrap"
          >
            Upload & Search by Image
          </Link>
        </section>

        {/* 7. NEW ARRIVALS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Zap className="w-6 h-6 text-indigo-600" /> New Arrivals
              </h2>
              <p className="text-slate-500 text-xs">Fresh styles and electronic gadgets added today</p>
            </div>
            <Link href="/shop?sort=newest" className="text-indigo-600 font-bold text-xs hover:underline flex items-center gap-1">
              Explore New <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
