import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { formatINR } from '../utils/formatters';
import { Sliders, Award, X, Plus, Star, Search, Filter, AlertCircle, ArrowRight } from 'lucide-react';
import { getCompareIds, saveCompareIds, addCompareId, removeCompareId } from '../utils/compareStorage';

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idsParam = searchParams.get('ids') || '';
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [bestOverall, setBestOverall] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [categoryFilterOverride, setCategoryFilterOverride] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');

  // Determine category bucket of selected products
  const selectedCategory = products.length > 0 ? products[0].category : null;
  const activeCategory = categoryFilterOverride || selectedCategory;

  useEffect(() => {
    let idArray = idsParam.split(',').filter(Boolean).map(Number);

    // If URL has no ids param, fall back to stored compare IDs
    if (idArray.length === 0) {
      const stored = getCompareIds();
      if (stored.length > 0) {
        setSearchParams({ ids: stored.join(',') }, { replace: true });
        return;
      }
    } else {
      // Sync URL ids to localStorage
      saveCompareIds(idArray);
    }

    if (idArray.length === 0) {
      setProducts([]);
      setBestOverall(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    api.products.compare(idArray)
      .then((res) => {
        setProducts(res.products || []);
        setBestOverall(res.best_overall);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [idsParam]);

  // Fetch search results / suggestions when query or category changes
  useEffect(() => {
    const timer = setTimeout(() => {
      performComparisonSearch();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory, products]);

  const performComparisonSearch = () => {
    setSearching(true);
    const params = {};
    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }
    if (activeCategory) {
      params.category = activeCategory;
    }

    api.products.getAll(params)
      .then((res) => {
        // Filter out already selected product IDs
        const selectedIds = new Set(products.map((p) => p.id));
        const filtered = (res.products || []).filter((p) => !selectedIds.has(p.id));
        setSearchResults(filtered);
        setSearching(false);
      })
      .catch((err) => {
        console.error(err);
        setSearching(false);
      });
  };

  const handleAddProduct = (product) => {
    const currentIds = products.map((p) => p.id);
    if (currentIds.includes(product.id)) return;

    if (currentIds.length >= 4) {
      showAlert('You can compare up to 4 products.');
      return;
    }

    // Same-category enforcement (client-side)
    if (products.length > 0) {
      const norm = (c = '') => {
        const lc = c.toLowerCase().trim();
        if (['mobile', 'smartphone', 'phone', 'mobiles'].some((k) => lc.includes(k))) return 'mobiles';
        if (['laptop', 'notebook', 'laptops'].some((k) => lc.includes(k))) return 'laptops';
        if (['tablet', 'ipad', 'tablets'].some((k) => lc.includes(k))) return 'tablets';
        if (['watch', 'smartwatch', 'smart watches'].some((k) => lc.includes(k))) return 'smartwatches';
        if (['headphone', 'earphone', 'earbud', 'headphones'].some((k) => lc.includes(k))) return 'headphones';
        return lc;
      };
      if (norm(products[0].category) !== norm(product.category)) {
        showAlert(
          `Only products from the same category can be compared. ` +
          `You are comparing "${products[0].category}" products — ` +
          `you cannot add a "${product.category}" product.`
        );
        return;
      }
    }

    const res = addCompareId(product.id);
    if (!res.success) {
      showAlert(res.message);
      return;
    }
    setSearchParams({ ids: res.ids.join(',') });
    setSearchQuery('');
  };

  const handleRemoveProduct = (idToRemove) => {
    const updatedIds = removeCompareId(idToRemove);
    if (updatedIds.length > 0) {
      setSearchParams({ ids: updatedIds.join(',') });
    } else {
      setSearchParams({});
      setCategoryFilterOverride(null);
    }
  };

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(''), 4000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 text-sm">Building side-by-side comparison matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* PAGE TITLE & ALERT BANNER */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Sliders className="w-6 h-6 text-cyan-400" />
              <span>Compare Products</span>
            </h1>
            <p className="text-xs text-slate-400">
              Category-aware side-by-side comparison matrix. Compare prices in ₹, ratings, specifications, and total ownership costs.
            </p>
          </div>

          {products.length > 0 && (
            <div className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {products.length} of 4 Products Selected
            </div>
          )}
        </div>

        {alertMessage && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{alertMessage}</span>
          </div>
        )}

        {/* COMPARISON PAGE SEARCH BAR */}
        <div className="space-y-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products to compare (e.g. iPhone, Samsung, Nitro, MacBook)... 🔍"
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-cyan-500 rounded-2xl py-3 pl-11 pr-10 text-xs text-white placeholder-slate-400 shadow-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Badge */}
          {activeCategory && (
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Category Filter:</span>
              <span className="inline-flex items-center space-x-1.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 px-3 py-1 rounded-full font-bold">
                <Filter className="w-3 h-3" />
                <span>{activeCategory}</span>
                {categoryFilterOverride && (
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setCategoryFilterOverride(null)} />
                )}
              </span>
              <span className="text-[11px] text-slate-500">
                (Prioritizing products from the same category)
              </span>
            </div>
          )}
        </div>

        {/* SEARCH & SUGGESTIONS RESULTS GRID */}
        {(searchQuery.trim() || activeCategory) && searchResults.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>{searchQuery ? `Search results for "${searchQuery}"` : `Suggested products in ${activeCategory}`}</span>
              <span className="text-slate-500">{searchResults.length} available</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-1">
              {searchResults.slice(0, 8).map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between space-x-3 transition-colors group"
                >
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-10 h-10 object-contain bg-slate-950 p-1 rounded-lg border border-slate-800 flex-shrink-0" />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 truncate">{p.name}</h4>
                      <span className="text-[11px] font-extrabold text-cyan-400 block">{formatINR(p.price)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddProduct(p)}
                    title="Add to Compare"
                    className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 font-bold border border-cyan-500/40 transition-colors flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BEST OVERALL RECOMMENDATION BANNER */}
      {bestOverall && products.length >= 2 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/40 shadow-xl space-y-3">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-cyan-500 text-slate-950 flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400">Top Rated + Best Value</span>
                <span className="text-xs font-bold text-white bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-0.5 rounded-full">
                  Winner: {bestOverall.product_name}
                  {bestOverall.score && <span className="ml-1 text-cyan-300">({bestOverall.score}/100)</span>}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{bestOverall.reason}</p>
            </div>
          </div>
          {bestOverall.scoring_methodology && (
            <div className="text-[11px] text-slate-400 bg-slate-900/60 rounded-xl p-3 border border-slate-800">
              <strong className="text-slate-300">Scoring methodology:</strong> {bestOverall.scoring_methodology}
            </div>
          )}
        </div>
      )}

      {/* INITIAL / EMPTY STATE */}
      {products.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl text-center space-y-4 border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-cyan-400 flex items-center justify-center mx-auto border border-slate-800">
            <Search className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Search for a product to start comparing</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Use the search bar above or browse products to add 2 to 4 items into the comparison matrix.
          </p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md inline-flex items-center space-x-2"
          >
            <span>Browse Products Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* COMPARISON MATRIX TABLE */
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80">
                <th className="p-4 min-w-[180px] text-xs font-bold text-slate-400 uppercase tracking-wider">Features / Specs</th>
                {products.map((p) => (
                  <th key={p.id} className="p-4 min-w-[220px] text-center relative border-l border-slate-800/80">
                    <button
                      onClick={() => handleRemoveProduct(p.id)}
                      title="Remove product"
                      className="absolute top-2 right-2 p-1.5 rounded-full text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <img src={p.image} alt={p.name} className="w-24 h-24 object-contain mx-auto mb-2 bg-slate-900 p-2 rounded-xl border border-slate-800" />
                    <span className="text-[11px] font-semibold text-cyan-400 block">{p.brand}</span>
                    <h3 className="font-extrabold text-white text-xs line-clamp-2 mb-1">{p.name}</h3>
                    <span className="text-base font-black text-white block">{formatINR(p.price)}</span>
                    {bestOverall && bestOverall.product_id === p.id && (
                      <span className="mt-2 inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <Award className="w-3 h-3" />
                        <span>Best Overall</span>
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Category</td>
                {products.map((p) => <td key={p.id} className="p-4 text-center border-l border-slate-800/60">{p.category}</td>)}
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Price (INR)</td>
                {products.map((p) => <td key={p.id} className="p-4 text-center border-l border-slate-800/60 font-extrabold text-white text-sm">{formatINR(p.price)}</td>)}
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Rating</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center border-l border-slate-800/60 font-bold text-amber-400">
                    ⭐ {p.rating} / 5.0
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Processor / Chipset</td>
                {products.map((p) => <td key={p.id} className="p-4 text-center border-l border-slate-800/60 font-semibold">{p.processor || 'N/A'}</td>)}
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-300 bg-slate-950/40">RAM Memory</td>
                {products.map((p) => <td key={p.id} className="p-4 text-center border-l border-slate-800/60 font-semibold">{p.ram || 'N/A'}</td>)}
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Storage Capacity</td>
                {products.map((p) => <td key={p.id} className="p-4 text-center border-l border-slate-800/60 font-semibold">{p.storage || 'N/A'}</td>)}
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Graphics / GPU</td>
                {products.map((p) => <td key={p.id} className="p-4 text-center border-l border-slate-800/60 font-semibold">{p.gpu || 'N/A'}</td>)}
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Display &amp; Refresh Rate</td>
                {products.map((p) => <td key={p.id} className="p-4 text-center border-l border-slate-800/60 font-semibold">{p.display ? `${p.display} (${p.refresh_rate || '60Hz'})` : 'N/A'}</td>)}
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Battery Capacity</td>
                {products.map((p) => <td key={p.id} className="p-4 text-center border-l border-slate-800/60 font-semibold">{p.battery || 'N/A'}</td>)}
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Camera Specs</td>
                {products.map((p) => <td key={p.id} className="p-4 text-center border-l border-slate-800/60 text-slate-300">{p.camera || 'N/A'}</td>)}
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-300 bg-slate-950/40">ANC / Noise Cancellation</td>
                {products.map((p) => <td key={p.id} className="p-4 text-center border-l border-slate-800/60 text-slate-300">{p.anc || 'N/A'}</td>)}
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Operating System</td>
                {products.map((p) => <td key={p.id} className="p-4 text-center border-l border-slate-800/60 text-slate-300">{p.operating_system || 'N/A'}</td>)}
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Warranty</td>
                {products.map((p) => <td key={p.id} className="p-4 text-center border-l border-slate-800/60 text-slate-400">{p.warranty || 'N/A'}</td>)}
              </tr>
              {/* PRICE INTELLIGENCE ROWS */}
              <tr className="bg-slate-950/60">
                <td className="p-4 font-bold text-cyan-400 text-[11px] uppercase tracking-wider" colSpan={products.length + 1}>
                  Price Intelligence
                </td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Historical Lowest</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center border-l border-slate-800/60 font-extrabold text-emerald-400">
                    {p.historical_lowest ? formatINR(p.historical_lowest) : <span className="text-slate-600 font-normal text-[11px]">No history</span>}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Historical Average</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center border-l border-slate-800/60 font-semibold text-slate-200">
                    {p.historical_average ? formatINR(p.historical_average) : <span className="text-slate-600 text-[11px]">No history</span>}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Price vs Average</td>
                {products.map((p) => {
                  const pct = p.price_vs_avg_pct;
                  return (
                    <td key={p.id} className="p-4 text-center border-l border-slate-800/60 font-bold">
                      {pct != null
                        ? <span className={pct < 0 ? 'text-emerald-400' : pct > 0 ? 'text-rose-400' : 'text-slate-400'}>
                            {pct > 0 ? '+' : ''}{pct}%
                          </span>
                        : <span className="text-slate-600 text-[11px]">No history</span>
                      }
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-slate-900/80">
                <td className="p-4 font-bold text-cyan-400">Full Analysis</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center border-l border-slate-800/60">
                    <button
                      onClick={() => navigate(`/product/${p.id}`)}
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-md"
                    >
                      Analyze Product
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
