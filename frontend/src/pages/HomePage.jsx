import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Laptop, 
  Smartphone, 
  Headphones, 
  Watch, 
  Tablet, 
  TrendingDown, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  History,
  Sliders
} from 'lucide-react';

import { getCompareIds, toggleCompareId } from '../utils/compareStorage';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState(getCompareIds());

  useEffect(() => {
    const handleSync = () => setCompareIds(getCompareIds());
    window.addEventListener('compareListChanged', handleSync);
    return () => window.removeEventListener('compareListChanged', handleSync);
  }, []);

  useEffect(() => {
    loadProducts();
    if (user) {
      loadRecentlyViewed();
    }
  }, [user, selectedCategory]);

  const loadProducts = () => {
    setLoading(true);
    const params = selectedCategory !== 'All' ? { category: selectedCategory } : {};
    api.products.getAll(params)
      .then((res) => {
        setProducts(res.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const loadRecentlyViewed = () => {
    api.recentlyViewed.get()
      .then((res) => setRecentlyViewed(res.recently_viewed || []))
      .catch((err) => console.error(err));
  };

  const handleCompareToggle = (product) => {
    toggleCompareId(product.id);
  };

  const categories = [
    { name: 'Headphones', icon: Headphones, color: 'from-purple-500/20 to-indigo-500/10' },
    { name: 'Laptops', icon: Laptop, color: 'from-cyan-500/20 to-blue-500/10' },
    { name: 'Mobiles', icon: Smartphone, color: 'from-emerald-500/20 to-teal-500/10' },
    { name: 'Smart Watches', icon: Watch, color: 'from-amber-500/20 to-orange-500/10' },
    { name: 'Tablets', icon: Tablet, color: 'from-rose-500/20 to-pink-500/10' },
  ];

  return (
    <div className="space-y-16 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* HERO SECTION */}
      <section className="relative text-center pt-8 pb-12 space-y-8 overflow-hidden">
        {/* Glow Accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center space-x-2 bg-slate-900/80 border border-cyan-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-cyan-400 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent Product Price &amp; Purchase Decision Assistant</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
            Stop Blind Shopping.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Buy Smarter with Price Intelligence.
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            SmartShopping analyzes 12-month price history trends in <strong className="text-white">Indian Rupees (₹)</strong>, compares Amazon, Flipkart &amp; Reliance Digital sellers, estimates 5-year ownership costs, and tells you whether to <strong className="text-emerald-400">BUY NOW</strong> or <strong className="text-rose-400">WAIT</strong>.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="pt-2">
          <SearchBar />
        </div>
      </section>

      {/* CATEGORIES BAR */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Explore Categories</h2>
          <button
            onClick={() => setSelectedCategory('All')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              selectedCategory === 'All'
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                : 'text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            All Categories
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center space-y-2.5 transition-all duration-200 group ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/10'
                    : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className={`p-3 rounded-xl bg-slate-900/80 group-hover:scale-110 transition-transform ${isSelected ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* URL ANALYZER SHORTCUT */}
      <section className="glass-panel p-5 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-indigo-500/5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400">🔗</span> Got a product URL?
            </h3>
            <p className="text-xs text-slate-400">
              Paste any Amazon, Flipkart, Meesho, or Myntra URL to get instant AI price intelligence.
            </p>
          </div>
          <Link
            to="/analyze-url"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 flex-shrink-0 shadow-md"
          >
            <span>Analyze a URL</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* POPULAR PRODUCTS GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {selectedCategory === 'All' ? 'Popular Products' : `${selectedCategory} Products`}
            </h2>
            <p className="text-xs text-slate-400">Fetched from MySQL product database</p>
          </div>

          <Link
            to="/browse"
            className="flex items-center space-x-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card h-80 rounded-2xl animate-pulse p-4"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-3 border border-slate-800">
            <p className="text-slate-400 text-sm">No products found in this category.</p>
            <button onClick={() => setSelectedCategory('All')} className="text-xs font-bold text-cyan-400 hover:underline">
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onWishlistToggle={loadProducts}
                onCompareToggle={handleCompareToggle}
                isCompared={compareIds.includes(product.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* RECENTLY VIEWED PRODUCTS SECTION (For Authenticated Users) */}
      {user && recentlyViewed.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-slate-900">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Recently Viewed</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {recentlyViewed.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="glass-card p-4 rounded-xl flex items-center space-x-3 border border-slate-800 hover:border-cyan-500/40 transition-all group"
              >
                <img src={p.image} alt={p.name} className="w-12 h-12 object-contain bg-slate-900 p-1 rounded-lg border border-slate-800" />
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 truncate">{p.name}</h4>
                  <span className="text-[11px] font-semibold text-slate-400 block">₹{p.price.toLocaleString('en-IN')}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FLOATING COMPARE BAR */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 glass-panel p-4 rounded-2xl border border-cyan-500/40 shadow-2xl flex items-center space-x-4 animate-bounce">
          <div className="flex items-center space-x-2 text-xs text-slate-200">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Comparing <strong className="text-cyan-400">{compareIds.length}</strong> products</span>
          </div>
          <button
            onClick={() => navigate(`/compare?ids=${compareIds.join(',')}`)}
            className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md"
          >
            Compare Now
          </button>
        </div>
      )}
    </div>
  );
}
