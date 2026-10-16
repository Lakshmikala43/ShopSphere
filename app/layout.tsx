import React from 'react';
import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import AIFloatingAssistant from '@/components/ai-floating-assistant';

export const metadata = {
  title: 'StyleKart AI - Modern Multi-Category E-Commerce Marketplace',
  description: 'Shop 1,000+ top products across Fashion, Electronics, Footwear, and Beauty with AI Fashion Stylist outfit curation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <AIFloatingAssistant />
      </body>
    </html>
  );
}
