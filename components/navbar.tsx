'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Sparkles,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Camera,
  Layers,
  LogOut,
  ShieldCheck,
  Store,
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchUserAndCounts();
    const interval = setInterval(fetchUserAndCounts, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserAndCounts = async () => {
    try {
      const [resMe, resCart, resWish] = await Promise.all([
        fetch('/api/auth/me').then((r) => r.json()),
        fetch('/api/cart').then((r) => r.json()),
        fetch('/api/wishlist').then((r) => r.json()),
      ]);

      if (resMe.user) setUser(resMe.user);
      if (resCart.cartItems) setCartCount(resCart.cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0));
      if (resWish.wishlistItems) setWishlistCount(resWish.wishlistItems.length);
    } catch (e) {
      // Ignore background errors
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 1) {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(val)}&limit=5`);
        const data = await res.json();
        setSuggestions(data.products || []);
        setShowSuggestions(true);
      } catch (err) {
        setSuggestions([]);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setCartCount(0);
    setWishlistCount(0);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              AI-Powered
            </span>
            <span>Free Express Delivery on orders over ₹999 | Use Code <strong>STYLE10</strong> for 10% Off</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/seller/dashboard" className="hover:underline flex items-center gap-1">
              <Store className="w-3.5 h-3.5" /> Sell on StyleKart
            </Link>
            <span>|</span>
            <Link href="/orders" className="hover:underline">Track Orders</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
            SK
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1">
              StyleKart <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">AI</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Next-Gen Marketplace</span>
          </div>
        </Link>

        {/* Location Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 cursor-pointer">
          <MapPin className="w-4 h-4 text-indigo-600" />
          <div>
            <div className="text-[10px] text-slate-400">Deliver to</div>
            <div className="font-semibold text-slate-800">Bengaluru 560103</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-2xl hidden md:block">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <div className="relative w-full flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                placeholder="Search 1,000+ products, brands, or try 'black sneakers under 2000'..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                className="w-full pl-10 pr-24 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-indigo-500 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <Link
                  href="/visual-search"
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-200/60 rounded-lg transition-colors"
                  title="Visual Search"
                >
                  <Camera className="w-4 h-4" />
                </Link>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Search Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                Matching Catalog Items
              </div>
              <div className="divide-y divide-slate-100">
                {suggestions.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center gap-3 p-3 hover:bg-indigo-50/50 transition-colors"
                  >
                    <img
                      src={p.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs text-slate-900 truncate">{p.name}</div>
                      <div className="text-[11px] text-slate-500">{p.brand} · {p.category.name}</div>
                    </div>
                    <div className="font-bold text-sm text-indigo-600">₹{p.price.toLocaleString('en-IN')}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* AI Stylist Button */}
          <Link
            href="/ai-stylist"
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md shadow-indigo-200 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
            <span>AI Stylist</span>
          </Link>

          {/* Wishlist */}
          <Link href="/wishlist" className="relative p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile / Auth */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors">
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
                <span className="hidden xl:block text-xs font-semibold text-slate-800">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 hidden group-hover:block z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="font-bold text-xs text-slate-900">{user.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                  <span className="inline-block mt-1 bg-indigo-50 text-indigo-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase">
                    Role: {user.role}
                  </span>
                </div>
                <Link href="/account" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <User className="w-4 h-4 text-slate-400" /> My Account & Addresses
                </Link>
                <Link href="/orders" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <ShoppingBag className="w-4 h-4 text-slate-400" /> Order History
                </Link>
                {user.role === 'SELLER' && (
                  <Link href="/seller/dashboard" className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50">
                    <Store className="w-4 h-4" /> Seller Dashboard
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-purple-600 hover:bg-purple-50">
                    <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 border-t border-slate-100"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Links Bar */}
      <nav className="border-t border-slate-100 bg-slate-50/70 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-6 text-xs font-semibold text-slate-700 py-2.5 overflow-x-auto">
          <Link href="/shop" className="hover:text-indigo-600 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-500" /> All Categories
          </Link>
          <Link href="/shop?category=fashion" className="hover:text-indigo-600">Fashion</Link>
          <Link href="/shop?category=footwear" className="hover:text-indigo-600">Footwear</Link>
          <Link href="/shop?category=electronics" className="hover:text-indigo-600">Electronics</Link>
          <Link href="/shop?category=accessories" className="hover:text-indigo-600">Accessories</Link>
          <Link href="/shop?category=beauty" className="hover:text-indigo-600">Beauty</Link>
          <Link href="/shop?category=home-kitchen" className="hover:text-indigo-600">Home & Kitchen</Link>
          <Link href="/shop?category=sports-fitness" className="hover:text-indigo-600">Sports</Link>
          <Link href="/shop?category=grocery" className="hover:text-indigo-600">Grocery</Link>
          <Link href="/ai-stylist" className="text-indigo-600 font-extrabold flex items-center gap-1 hover:underline">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> AI Fashion Stylist
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-4 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="p-2.5 bg-slate-50 rounded-lg text-slate-800">All Categories</Link>
            <Link href="/shop?category=fashion" onClick={() => setIsMenuOpen(false)} className="p-2.5 bg-slate-50 rounded-lg text-slate-800">Fashion</Link>
            <Link href="/shop?category=electronics" onClick={() => setIsMenuOpen(false)} className="p-2.5 bg-slate-50 rounded-lg text-slate-800">Electronics</Link>
            <Link href="/shop?category=footwear" onClick={() => setIsMenuOpen(false)} className="p-2.5 bg-slate-50 rounded-lg text-slate-800">Footwear</Link>
            <Link href="/ai-stylist" onClick={() => setIsMenuOpen(false)} className="p-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg col-span-2">✨ AI Fashion Stylist</Link>
          </div>
        </div>
      )}
    </header>
  );
}
