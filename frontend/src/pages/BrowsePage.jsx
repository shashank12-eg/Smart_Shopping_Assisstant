import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { api } from '../services/api';
import { SlidersHorizontal, ArrowUpDown, Filter, X, Sliders } from 'lucide-react';
import { getCompareIds, toggleCompareId } from '../utils/compareStorage';

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState('relevance');
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState(getCompareIds());

  useEffect(() => {
    const handleSync = () => setCompareIds(getCompareIds());
    window.addEventListener('compareListChanged', handleSync);
    return () => window.removeEventListener('compareListChanged', handleSync);
  }, []);

  useEffect(() => {
    api.products.getCategories()
      .then((res) => setCategories(['All', ...(res.categories || [])]))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setCategory(searchParams.get('category') || 'All');
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    loadProducts();
  }, [category, search, sort]);

  const loadProducts = () => {
    setLoading(true);
    const params = {};
    if (category && category !== 'All') params.category = category;
    if (search) params.search = search;
    if (sort) params.sort = sort;

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

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setCategory('All');
    setSearch('');
    setSort('relevance');
    setSearchParams({});
  };

  const handleCompareToggle = (product) => {
    toggleCompareId(product.id);
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Search Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h1 className="text-2xl font-extrabold text-white">Browse All Products</h1>
        <SearchBar placeholder="Search by product name, brand, processor, RAM or specs..." />

        {/* Active Filter Badges */}
        {(category !== 'All' || search) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-medium">Active Filters:</span>
            {category !== 'All' && (
              <span className="inline-flex items-center space-x-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 px-3 py-1 rounded-full font-semibold">
                <span>Category: {category}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => handleCategorySelect('All')} />
              </span>
            )}
            {search && (
              <span className="inline-flex items-center space-x-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-3 py-1 rounded-full font-semibold">
                <span>Search: "{search}"</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchParams({ category })} />
              </span>
            )}
            <button onClick={handleClearFilters} className="text-slate-400 hover:text-rose-400 underline font-semibold ml-2">
              Clear All
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 text-white font-bold text-sm">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span>Filter Categories</span>
            </div>

            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    category === cat
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <span>{cat}</span>
                  {category === cat && <span className="w-2 h-2 rounded-full bg-cyan-400"></span>}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="text-slate-400">
              Showing <strong className="text-white">{products.length}</strong> matching products
            </div>

            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400 font-medium">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-semibold"
              >
                <option value="relevance">Relevance</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card h-80 rounded-2xl animate-pulse p-4"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl text-center space-y-4 border border-slate-800">
              <p className="text-slate-400 text-base">No products match your search or filter criteria.</p>
              <button
                onClick={handleClearFilters}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
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
        </main>
      </div>

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
