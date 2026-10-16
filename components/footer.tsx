import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Headphones, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 mt-20">
      {/* Features Bar */}
      <div className="border-b border-slate-900 bg-slate-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Truck className="w-8 h-8 text-indigo-400 mb-2" />
            <span className="font-bold text-slate-200 text-sm">Express Shipping</span>
            <span className="text-[11px] text-slate-400">Free delivery on orders over ₹999</span>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-8 h-8 text-cyan-400 mb-2" />
            <span className="font-bold text-slate-200 text-sm">Secure Sandbox Payments</span>
            <span className="text-[11px] text-slate-400">Razorpay ready & 256-bit SSL</span>
          </div>
          <div className="flex flex-col items-center">
            <RotateCcw className="w-8 h-8 text-purple-400 mb-2" />
            <span className="font-bold text-slate-200 text-sm">Easy Returns</span>
            <span className="text-[11px] text-slate-400">7-day hassle-free doorstep returns</span>
          </div>
          <div className="flex flex-col items-center">
            <Sparkles className="w-8 h-8 text-amber-400 mb-2" />
            <span className="font-bold text-slate-200 text-sm">AI Fashion Assistant</span>
            <span className="text-[11px] text-slate-400">Personalized outfit curation</span>
          </div>
        </div>
      </div>

      {/* Main Sitemap */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg">
              SK
            </div>
            <span className="font-extrabold text-lg text-white">StyleKart AI</span>
          </div>
          <p className="text-slate-400 leading-relaxed max-w-sm">
            India's premier AI-driven e-commerce marketplace featuring 1,000+ top products across Fashion, Electronics, Footwear, and Beauty with smart outfit recommendations.
          </p>
          <div className="text-xs text-slate-400 pt-2">
            Registered Address: StyleKart AI Tech Towers, Bellandur, Bengaluru, KA 560103
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-200 text-sm mb-3">Shop Categories</h4>
          <ul className="space-y-2">
            <li><Link href="/shop?category=fashion" className="hover:text-white">Men & Women Fashion</Link></li>
            <li><Link href="/shop?category=footwear" className="hover:text-white">Footwear & Sneakers</Link></li>
            <li><Link href="/shop?category=electronics" className="hover:text-white">Mobiles & Laptops</Link></li>
            <li><Link href="/shop?category=accessories" className="hover:text-white">Watches & Accessories</Link></li>
            <li><Link href="/shop?category=beauty" className="hover:text-white">Beauty & Skincare</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-200 text-sm mb-3">AI Experience</h4>
          <ul className="space-y-2">
            <li><Link href="/ai-stylist" className="text-indigo-400 font-semibold hover:underline">✨ AI Fashion Stylist</Link></li>
            <li><Link href="/visual-search" className="hover:text-white">Visual Image Search</Link></li>
            <li><Link href="/shop" className="hover:text-white">Personalized Catalog</Link></li>
            <li><Link href="/seller/dashboard" className="hover:text-white">Seller Dashboard</Link></li>
            <li><Link href="/admin/dashboard" className="hover:text-white">Admin Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-200 text-sm mb-3">Customer Care</h4>
          <ul className="space-y-2">
            <li><Link href="/orders" className="hover:text-white">Order History & Tracking</Link></li>
            <li><Link href="/account" className="hover:text-white">Address Book</Link></li>
            <li><Link href="/cart" className="hover:text-white">Shopping Cart</Link></li>
            <li><Link href="/wishlist" className="hover:text-white">Wishlist</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-900 py-6 text-center text-slate-400 text-xs">
        <p>© 2026 StyleKart AI Marketplace. Built with Next.js, Prisma SQLite, & Razorpay-ready Architecture.</p>
      </div>
    </footer>
  );
}
