'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Store, Plus, Package, Truck, DollarSign, CheckCircle, Clock } from 'lucide-react';

export default function SellerDashboardPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'add'>('products');
  const [loading, setLoading] = useState(true);

  // New product form
  const [newProd, setNewProd] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    discountPercent: '10',
    categoryId: '',
    imageUrl: '',
    size: 'M',
    color: 'Black',
    stock: '25',
  });
  const [savingProd, setSavingProd] = useState(false);

  // Order status update state
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('SHIPPED');
  const [trackingNum, setTrackingNum] = useState('');

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    setLoading(true);
    try {
      const [resProd, resOrd, resCat] = await Promise.all([
        fetch('/api/seller/products').then((r) => r.json()),
        fetch('/api/seller/orders').then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
      ]);

      setProducts(resProd.products || []);
      setOrders(resOrd.orderItems || []);
      setCategories(resCat.categories || []);
      if (resCat.categories && resCat.categories.length > 0) {
        setNewProd((prev) => ({ ...prev, categoryId: resCat.categories[0].id }));
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProd(true);
    try {
      const res = await fetch('/api/seller/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
      if (res.ok) {
        alert('Product added to catalog!');
        setActiveTab('products');
        fetchSellerData();
      }
    } catch (err) {
    } finally {
      setSavingProd(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string) => {
    try {
      const res = await fetch('/api/seller/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          trackingNumber: trackingNum || `TRK-${Date.now()}`,
        }),
      });
      if (res.ok) {
        setSelectedOrder(null);
        fetchSellerData();
      }
    } catch (err) {}
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 font-semibold text-xs">Loading seller portal & inventory...</p>
      </div>
    );
  }

  const totalSales = orders.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Store className="w-8 h-8 text-indigo-600" /> Seller Dashboard Portal
          </h1>
          <p className="text-slate-500 text-xs">Manage product listings, inventory stock, and order fulfillment</p>
        </div>

        <button
          onClick={() => setActiveTab('add')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Store Sales</div>
          <div className="text-2xl font-black text-slate-900">₹{totalSales.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-600 font-bold">Revenue generated</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Active Products</div>
          <div className="text-2xl font-black text-indigo-600">{products.length}</div>
          <div className="text-[10px] text-slate-500 font-medium">Catalog items</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Received Orders</div>
          <div className="text-2xl font-black text-purple-600">{orders.length}</div>
          <div className="text-[10px] text-slate-500 font-medium">Items ordered by customers</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 text-sm font-bold text-slate-500 gap-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 ${activeTab === 'products' ? 'border-b-2 border-indigo-600 text-indigo-600' : ''}`}
        >
          Products Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 ${activeTab === 'orders' ? 'border-b-2 border-indigo-600 text-indigo-600' : ''}`}
        >
          Orders Fulfillment ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`pb-3 ${activeTab === 'add' ? 'border-b-2 border-indigo-600 text-indigo-600' : ''}`}
        >
          Add Product
        </button>
      </div>

      {/* TAB 1: PRODUCTS INVENTORY */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-4">Product Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price (₹)</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.images[0]?.url} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                    <div>
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-400">{p.brand}</div>
                    </div>
                  </td>
                  <td className="p-4">{p.category?.name}</td>
                  <td className="p-4 font-bold">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-rose-600 font-bold">{p.discountPercent}% OFF</td>
                  <td className="p-4">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                      {p.variants[0]?.stock || 10} units
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: ORDERS FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-4">Order / Customer</th>
                <th className="p-4">Product</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {orders.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">#{item.order?.orderNumber}</div>
                    <div className="text-slate-400">{item.order?.user?.name}</div>
                  </td>
                  <td className="p-4 font-semibold">{item.product?.name}</td>
                  <td className="p-4 font-bold">{item.quantity}</td>
                  <td className="p-4">
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase">
                      {item.order?.orderStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedOrder(item.order)}
                      className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: ADD PRODUCT FORM */}
      {activeTab === 'add' && (
        <form onSubmit={handleCreateProduct} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-2xl">
          <h3 className="font-bold text-sm text-slate-900">Add New Product to Marketplace</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <input
              type="text"
              placeholder="Product Name"
              required
              value={newProd.name}
              onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
            <input
              type="text"
              placeholder="Brand Name"
              required
              value={newProd.brand}
              onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <select
              value={newProd.categoryId}
              onChange={(e) => setNewProd({ ...newProd, categoryId: e.target.value })}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Price (₹)"
              required
              value={newProd.price}
              onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
            <input
              type="number"
              placeholder="Discount %"
              value={newProd.discountPercent}
              onChange={(e) => setNewProd({ ...newProd, discountPercent: e.target.value })}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <input
            type="text"
            placeholder="Image URL (Unsplash or image link)"
            value={newProd.imageUrl}
            onChange={(e) => setNewProd({ ...newProd, imageUrl: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />

          <textarea
            placeholder="Detailed description..."
            value={newProd.description}
            onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs h-24"
          />

          <button
            type="submit"
            disabled={savingProd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md"
          >
            Publish Product
          </button>
        </form>
      )}

      {/* Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900">Update Order #{selectedOrder.orderNumber}</h3>
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700">Select New Status:</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="PACKED">PACKED</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Courier Tracking Code (e.g. TRK-889900)"
              value={trackingNum}
              onChange={(e) => setTrackingNum(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600">
                Cancel
              </button>
              <button
                onClick={() => handleUpdateOrderStatus(selectedOrder.id)}
                className="bg-indigo-600 text-white font-bold text-xs px-5 py-2 rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
