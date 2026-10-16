'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  MapPin,
  CheckCircle,
  CreditCard,
  QrCode,
  Landmark,
  Banknote,
  ShieldCheck,
  ArrowRight,
  Plus,
  Truck,
  Check,
  ShoppingBag,
} from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponCodeParam = searchParams.get('coupon') || '';

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [cartData, setCartData] = useState<any>({ cartItems: [], summary: { subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0 } });
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'COD'>('UPI');
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any>(null);

  // New address form state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: 'Priya Sharma',
    phone: '+91 98999 88877',
    line1: 'Flat 402, Green Glen Layout',
    line2: 'Outer Ring Road, Bellandur',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560103',
  });

  // Card simulator inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  useEffect(() => {
    fetchInitialCheckoutData();
  }, []);

  const fetchInitialCheckoutData = async () => {
    setLoading(true);
    try {
      const [resAddr, resCart] = await Promise.all([
        fetch('/api/addresses').then((r) => r.json()),
        fetch('/api/cart').then((r) => r.json()),
      ]);

      let currentAddrs = resAddr.addresses || [];

      // If no address exists for user, create a default shipping address automatically
      if (currentAddrs.length === 0) {
        const createRes = await fetch('/api/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: 'Priya Sharma',
            phone: '+91 98999 88877',
            line1: 'Flat 402, Green Glen Layout',
            line2: 'Outer Ring Road, Bellandur',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560103',
            country: 'India',
            isDefault: true,
          }),
        });
        const createdData = await createRes.json();
        if (createdData.address) {
          currentAddrs = [createdData.address];
        }
      }

      setAddresses(currentAddrs);
      if (currentAddrs.length > 0) {
        const defaultAddr = currentAddrs.find((a: any) => a.isDefault) || currentAddrs[0];
        setSelectedAddressId(defaultAddr.id);
      }

      if (resCart.cartItems) {
        setCartData(resCart);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAddress, isDefault: true }),
      });
      const data = await res.json();
      if (res.ok && data.address) {
        setAddresses((prev) => [data.address, ...prev]);
        setSelectedAddressId(data.address.id);
        setShowAddAddress(false);
      }
    } catch (err) {}
  };

  const handleContinueToReview = async () => {
    let targetAddressId = selectedAddressId;

    if (!targetAddressId && addresses.length > 0) {
      targetAddressId = addresses[0].id;
      setSelectedAddressId(targetAddressId);
    }

    if (!targetAddressId) {
      const createRes = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newAddress.fullName || 'Priya Sharma',
          phone: newAddress.phone || '+91 98999 88877',
          line1: newAddress.line1 || 'Flat 402, Green Glen Layout',
          line2: newAddress.line2 || 'Outer Ring Road, Bellandur',
          city: newAddress.city || 'Bengaluru',
          state: newAddress.state || 'Karnataka',
          postalCode: newAddress.postalCode || '560103',
          country: 'India',
          isDefault: true,
        }),
      });
      const createdData = await createRes.json();
      if (createdData.address) {
        setAddresses([createdData.address]);
        setSelectedAddressId(createdData.address.id);
      }
    }

    setStep(2);
  };

  const handleExecutePaymentAndOrder = async () => {
    let addrId = selectedAddressId || (addresses[0] ? addresses[0].id : '');

    if (!addrId) {
      alert('Please select or add a delivery address');
      return;
    }

    setProcessingPayment(true);

    try {
      // 1. Submit order checkout server-side
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: addrId,
          couponCode: couponCodeParam,
          paymentMethod,
        }),
      });

      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok) {
        alert(checkoutData.error || 'Checkout failed');
        setProcessingPayment(false);
        return;
      }

      if (paymentMethod === 'COD') {
        triggerSuccessCelebration(checkoutData.orderId);
        return;
      }

      // 2. Server-side payment verification (Razorpay / Sandbox simulation)
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: checkoutData.orderId,
          paymentId: `PAY_SANDBOX_${Date.now()}`,
          gatewayOrderId: checkoutData.paymentOrder?.gatewayOrderId,
          signature: 'SANDBOX_VERIFIED_SIGNATURE',
          paymentMethod,
        }),
      });

      const verifyData = await verifyRes.json();

      if (verifyRes.ok && verifyData.success) {
        triggerSuccessCelebration(checkoutData.orderId);
      } else {
        alert(verifyData.error || 'Payment verification failed');
      }
    } catch (err: any) {
      alert(err.message || 'Error processing payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  const triggerSuccessCelebration = (orderId: string) => {
    setOrderConfirmed({ orderId, date: new Date().toLocaleDateString('en-IN') });
    setStep(4);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 font-semibold text-xs">Initializing secure checkout session...</p>
      </div>
    );
  }

  // STEP 4: CONFIRMATION SCREEN
  if (step === 4 && orderConfirmed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle className="w-12 h-12 animate-bounce" />
        </div>
        <div className="space-y-2">
          <span className="bg-emerald-500/10 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            Order Confirmed & Payment Verified
          </span>
          <h1 className="text-3xl font-black text-slate-900">Thank You for Your Order!</h1>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Order Reference: <strong className="text-slate-900">{orderConfirmed.orderId}</strong>. We have dispatched your shipment details to your email and seller dashboard.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left max-w-md mx-auto space-y-3 text-xs">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Payment Status:</span>
            <span className="font-bold text-emerald-600">SUCCESS ({paymentMethod})</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Order Status:</span>
            <span className="font-bold text-indigo-600">CONFIRMED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Estimated Delivery:</span>
            <span className="font-bold text-slate-900">3 - 5 Business Days</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link
            href={`/orders/${orderConfirmed.orderId}`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-6 py-3.5 rounded-xl shadow-md transition-transform hover:scale-105"
          >
            Track Order Progress
          </Link>
          <Link
            href="/shop"
            className="bg-slate-900 text-white font-bold text-xs px-6 py-3.5 rounded-xl hover:bg-slate-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Progress Stepper */}
      <div className="max-w-3xl mx-auto flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-200 pb-4">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600' : ''}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>1</div>
          <span>Delivery Address</span>
        </div>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600' : ''}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>2</div>
          <span>Order Review</span>
        </div>
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-indigo-600' : ''}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>3</div>
          <span>Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Step Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: ADDRESS */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" /> Select Delivery Address
                </h2>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add New Address
                </button>
              </div>

              {/* Address List */}
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{addr.fullName}</div>
                        <div className="text-xs text-slate-600">{addr.line1}, {addr.line2}</div>
                        <div className="text-xs text-slate-600">{addr.city}, {addr.state} - {addr.postalCode}</div>
                        <div className="text-xs text-slate-500 font-semibold mt-1">Phone: {addr.phone}</div>
                      </div>
                      {selectedAddressId === addr.id && (
                        <div className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Address Form */}
              {showAddAddress && (
                <form onSubmit={handleSaveAddress} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-xs text-slate-900 uppercase">New Shipping Address</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      required
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Address Line 1 (Flat, House No, Building)"
                    required
                    value={newAddress.line1}
                    onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Address Line 2 (Street, Area, Landmark)"
                    value={newAddress.line2}
                    onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      required
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="PIN Code"
                      required
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                  <button type="submit" className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl">
                    Save & Select Address
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={handleContinueToReview}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-xl shadow-md text-xs flex items-center justify-center gap-2 hover:scale-[1.01] transition-all cursor-pointer"
              >
                <span>Continue to Order Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: REVIEW */}
          {step === 2 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600" /> Review Order Items
              </h2>

              <div className="divide-y divide-slate-100">
                {cartData.cartItems.map((item: any) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-slate-500">Qty: {item.quantity} · Size: {item.size}</div>
                      </div>
                    </div>
                    <div className="font-black text-slate-900">₹{item.subtotal.toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-xl shadow-md text-xs flex items-center justify-center gap-2"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 3 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" /> Select Payment Method
              </h2>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <button
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border flex items-center gap-2 transition-all ${
                    paymentMethod === 'UPI' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'
                  }`}
                >
                  <QrCode className="w-5 h-5" /> UPI / QR (GPay, PhonePe)
                </button>
                <button
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-4 rounded-2xl border flex items-center gap-2 transition-all ${
                    paymentMethod === 'CARD' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5" /> Credit / Debit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-4 rounded-2xl border flex items-center gap-2 transition-all ${
                    paymentMethod === 'NETBANKING' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'
                  }`}
                >
                  <Landmark className="w-5 h-5" /> Net Banking
                </button>
                <button
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border flex items-center gap-2 transition-all ${
                    paymentMethod === 'COD' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'
                  }`}
                >
                  <Banknote className="w-5 h-5" /> Cash on Delivery
                </button>
              </div>

              {/* CARD SIMULATOR DETAILS */}
              {paymentMethod === 'CARD' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Test Card Sandbox Filler:</span>
                    <button
                      onClick={() => {
                        setCardNumber('4111 2222 3333 4444');
                        setCardExpiry('12/28');
                        setCardCvv('999');
                      }}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      Fill Demo Test Card
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button onClick={() => setStep(2)} className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600">
                  Back
                </button>
                <button
                  onClick={handleExecutePaymentAndOrder}
                  disabled={processingPayment}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm"
                >
                  {processingPayment ? (
                    <span>Verifying & Processing Payment...</span>
                  ) : (
                    <span>PAY NOW & CONFIRM ORDER</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4 sticky top-24">
            <h3 className="font-black text-lg border-b border-slate-800 pb-3">Checkout Summary</h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">₹{cartData.summary.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Shipping</span>
                <span className="font-bold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span className="font-bold text-white">₹{cartData.summary.tax.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Total Payable</span>
              <span className="text-2xl font-black text-amber-400">
                ₹{cartData.summary.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading checkout session...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
