import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">
              ₹
            </div>
            <span className="text-lg font-bold text-white tracking-tight">SmartShopping</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Intelligent electronics shopping assistant powered by historical price graph analytics, multi-seller comparisons, 5-year maintenance math, and resale projections.
          </p>
          <div className="text-[11px] text-cyan-400 font-mono">
            All prices natively formatted in Indian Rupees (₹).
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:text-cyan-400 transition-colors">Home Dashboard</Link></li>
            <li><Link to="/browse" className="hover:text-cyan-400 transition-colors">Browse All Products</Link></li>
            <li><Link to="/compare" className="hover:text-cyan-400 transition-colors">Product Comparison</Link></li>
            <li><Link to="/wishlist" className="hover:text-cyan-400 transition-colors">My Wishlist</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/browse?category=Laptops" className="hover:text-cyan-400 transition-colors">Gaming &amp; Work Laptops</Link></li>
            <li><Link to="/browse?category=Mobiles" className="hover:text-cyan-400 transition-colors">5G Mobiles</Link></li>
            <li><Link to="/browse?category=Headphones" className="hover:text-cyan-400 transition-colors">ANC Headphones</Link></li>
            <li><Link to="/browse?category=Smart%20Watches" className="hover:text-cyan-400 transition-colors">Smart Watches</Link></li>
            <li><Link to="/browse?category=Tablets" className="hover:text-cyan-400 transition-colors">Tablets</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Supported Retailers</h4>
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-slate-300">Amazon India</span>
            <span className="text-[11px] bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-slate-300">Flipkart</span>
            <span className="text-[11px] bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-slate-300">Reliance Digital</span>
            <span className="text-[11px] bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-slate-300">Croma</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} SmartShopping Inc. Built for CSE College Project.</p>
        <p className="mt-2 md:mt-0">Powered by React, Vite, Python Flask REST API &amp; SQLite</p>
      </div>
    </footer>
  );
}
