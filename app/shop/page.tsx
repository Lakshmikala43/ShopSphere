'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/product-card';
import { Filter, SlidersHorizontal, ChevronRight, RotateCcw, Search } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '0');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '1000');
  const [rating, setRating] = useState(searchParams.get('rating') || '0');
  const [discount, setDiscount] = useState(searchParams.get('discount') || '0');
  const [sort, setSort] = useState(searchParams.get('sort') || 'relevance');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, minPrice, maxPrice, rating, discount, sort, page]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (e) {}
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category: selectedCategory,
        search: searchQuery,
        minPrice,
        maxPrice,
        rating,
        discount,
        sort,
        page: page.toString(),
        limit: '12',
      });
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setMinPrice('0');
    setMaxPrice('1000');
    setRating('0');
    setDiscount('0');
    setSort('relevance');
    setPage(1);
    router.push('/shop');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <a href="/" className="hover:underline">Home</a>
        <ChevronRight className="w-3 h-3" />
        <span className="font-semibold text-slate-800">Shop Catalog</span>
        {selectedCategory && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="font-bold text-indigo-600 uppercase">{selectedCategory}</span>
          </>
        )}
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600" /> Filters
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name} ({c._count.products})</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Max Price (₹)</label>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-500 font-semibold">
              <span>₹0</span>
              <span className="text-indigo-600 font-bold">₹{parseInt(maxPrice).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Customer Rating</label>
            <div className="space-y-1 text-xs">
              {[4, 3, 2].map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-indigo-600">
                  <input
                    type="radio"
                    name="rating"
                    checked={rating === r.toString()}
                    onChange={() => { setRating(r.toString()); setPage(1); }}
                    className="accent-indigo-600"
                  />
                  <span>{r}★ & Above</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Discount Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Min Discount</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
              {['10', '20', '30'].map((d) => (
                <button
                  key={d}
                  onClick={() => { setDiscount(discount === d ? '0' : d); setPage(1); }}
                  className={`p-1.5 rounded-lg border text-center transition-colors ${
                    discount === d ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {d}%+
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-black text-lg text-slate-900">
                {selectedCategory ? `${selectedCategory.toUpperCase()} Products` : 'All Catalog Products'}
              </h1>
              <p className="text-xs text-slate-500">Showing {products.length} of {pagination.total} products</p>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-slate-100 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 flex-1 sm:flex-initial"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Product Grid / Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-slate-200 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <Search className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-lg">No matching products found</h3>
              <p className="text-xs text-slate-500">Try adjusting your filters or search keywords.</p>
              <button
                onClick={handleClearFilters}
                className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md hover:bg-indigo-700"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white disabled:opacity-50 hover:bg-slate-50"
              >
                Previous
              </button>
              <span className="text-xs font-bold text-slate-700 px-3">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white disabled:opacity-50 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
