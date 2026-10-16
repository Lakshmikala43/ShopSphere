'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, X, Send, Bot, ShoppingBag } from 'lucide-react';

export default function AIFloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; products?: any[] }>>([
    {
      sender: 'ai',
      text: "Hello! I'm your StyleKart AI Shopping Assistant. Ask me anything like 'black sneakers under 2000' or 'wedding outfit suggestions'!",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const userText = inputQuery.trim();
    setInputQuery('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userText }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: data.reply || 'Here are some catalog recommendations:', products: data.products || [] },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, I had trouble processing your query. Please try again!' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group ring-4 ring-indigo-500/20"
      >
        <Sparkles className="w-6 h-6 animate-spin text-amber-300" style={{ animationDuration: '6s' }} />
        <span className="hidden group-hover:inline-block font-bold text-xs pr-1">Ask AI Assistant</span>
      </button>

      {/* Chat Modal Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[92vw] sm:w-[420px] h-[550px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm">StyleKart AI Assistant</h3>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live Real Catalog Query
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 text-white/80 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Product Recommendation Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2 w-full">
                    {msg.products.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.id}`}
                        onClick={() => setIsOpen(false)}
                        className="bg-white border border-slate-200 rounded-xl p-2 hover:border-indigo-500 transition-colors shadow-sm text-left group"
                      >
                        <img
                          src={p.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                          alt={p.name}
                          className="w-full h-24 object-cover rounded-lg mb-1.5"
                        />
                        <div className="font-bold text-[11px] text-slate-900 truncate group-hover:text-indigo-600">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-slate-500">{p.brand}</div>
                        <div className="font-extrabold text-xs text-indigo-600 mt-1">₹{p.price.toLocaleString('en-IN')}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
                <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" /> Searching real product database...
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => setInputQuery('black sneakers under 2000')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              👟 Black sneakers &lt; 2000
            </button>
            <button
              onClick={() => setInputQuery('laptop under 50000')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              💻 Laptop under 50k
            </button>
            <button
              onClick={() => setInputQuery('wedding dress suggestions')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              ✨ Wedding outfits
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              placeholder="Ask AI assistant..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
