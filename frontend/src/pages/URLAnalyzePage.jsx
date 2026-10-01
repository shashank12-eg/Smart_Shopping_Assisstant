import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { formatINR } from '../utils/formatters';
import {
  Link2, Search, AlertCircle, CheckCircle, ExternalLink,
  ShoppingBag, ArrowRight, Loader2, X, BarChart2, Shield, Star
} from 'lucide-react';
import DecisionEngineCard from '../components/DecisionEngineCard';
import ResaleForecastCard from '../components/ResaleForecastCard';
import ProductLifetimeCard from '../components/ProductLifetimeCard';
import PriceStatisticsCard from '../components/PriceStatisticsCard';
import AIPurchaseAdvisorCard from '../components/AIPurchaseAdvisorCard';
import DataQualityBadge from '../components/DataQualityBadge';

const SUPPORTED_RETAILERS = [
  { name: 'Amazon.in',       color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  { name: 'Flipkart',        color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/30' },
  { name: 'Meesho',          color: 'text-rose-400',   bg: 'bg-rose-500/10 border-rose-500/30' },
  { name: 'Myntra',          color: 'text-pink-400',   bg: 'bg-pink-500/10 border-pink-500/30' },
  { name: 'Croma',           color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  { name: 'Reliance Digital', color: 'text-cyan-400',  bg: 'bg-cyan-500/10 border-cyan-500/30' },
];

export default function URLAnalyzePage() {
  const navigate = useNavigate();
  const [url, setUrl]       = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.urlAnalyze.analyze(url.trim());
      setResult(data);
    } catch (err) {
      setError(err.data || { error: err.message || 'Analysis failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => { setUrl(''); setResult(null); setError(null); };
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleAnalyze(); };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/30">
            <Link2 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Product URL Analyzer</h1>
            <p className="text-xs text-slate-400">
              Paste a product URL from supported retailers to get instant price intelligence.
            </p>
          </div>
        </div>

        {/* URL INPUT */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste Amazon / Flipkart / Meesho / Myntra product URL here..."
              className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-500 rounded-2xl py-3 pl-11 pr-10 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              disabled={loading}
            />
            {url && (
              <button onClick={handleClear} className="absolute right-3 top-3 text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!url.trim() || loading}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-sm px-6 py-3 rounded-2xl transition-all flex items-center space-x-2 shadow-lg"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{loading ? 'Analyzing...' : 'Analyze'}</span>
          </button>
        </div>

        {/* SUPPORTED RETAILERS BADGES */}
        <div className="flex flex-wrap gap-2">
          <span className="text-[11px] text-slate-500 self-center">Supported:</span>
          {SUPPORTED_RETAILERS.map((r) => (
            <span key={r.name} className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${r.bg} ${r.color}`}>
              {r.name}
            </span>
          ))}
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <p className="text-white font-bold">Analyzing Product URL</p>
            <p className="text-xs text-slate-400 mt-1">Identifying retailer, matching product, running intelligence engine...</p>
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && !loading && (
        <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 bg-rose-500/5 space-y-3">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-rose-400">Analysis Failed</p>
              <p className="text-xs text-slate-300">{error.error}</p>
              {error.supported_retailers && (
                <p className="text-xs text-slate-400">Supported: {error.supported_retailers.join(', ')}</p>
              )}
              {error.suggestion && (
                <button onClick={() => navigate('/browse')} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline pt-1 block">
                  {error.suggestion}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {result && !loading && (
        <div className="space-y-6">

          {/* PRODUCT HEADER CARD */}
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    Product Identified — {result.retailer_detected}
                  </p>
                  <h2 className="text-lg font-extrabold text-white mt-0.5">{result.product?.name}</h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    {result.product?.brand && <span className="text-xs text-slate-400">{result.product.brand}</span>}
                    {result.product?.category && <span className="text-xs font-bold text-cyan-400">{result.product.category}</span>}
                    {result.product?.rating && (
                      <span className="text-xs text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3" /> {result.product.rating} / 5.0
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {result.product?.image && (
                <img
                  src={result.product.image}
                  alt={result.product.name}
                  className="w-20 h-20 object-contain bg-slate-900 p-2 rounded-xl border border-slate-800"
                />
              )}
            </div>

            {/* PRICE + ACTIONS */}
            {result.product?.price && (
              <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-800">
                <div>
                  <p className="text-[11px] text-slate-400">Current Price (last recorded)</p>
                  <p className="text-3xl font-black text-white">{formatINR(result.product.price)}</p>
                </div>
                {result.intelligence?.data_quality && (
                  <DataQualityBadge quality={result.intelligence.data_quality} />
                )}
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => navigate(`/product/${result.product.id}`)}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2"
                  >
                    <BarChart2 className="w-4 h-4" />
                    <span>Full AI Analysis</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* DISCLAIMER */}
            <div className="text-[11px] text-slate-500 flex items-start space-x-1.5 pt-1 border-t border-slate-800/50">
              <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{result.disclaimer}</span>
            </div>
          </div>

          {/* INTELLIGENCE CARDS */}
          {result.intelligence && !result.intelligence.error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.intelligence.price_analysis && (
                <PriceStatisticsCard
                  priceAnalysis={result.intelligence.price_analysis}
                  currentPrice={result.product?.price}
                />
              )}
              {result.intelligence.purchase_decision && (
                <DecisionEngineCard decision={result.intelligence.purchase_decision} />
              )}
              {result.intelligence.ai_advisor && (
                <div className="md:col-span-2">
                  <AIPurchaseAdvisorCard advisor={result.intelligence.ai_advisor} />
                </div>
              )}
              {result.intelligence.resale_projections && (
                <ResaleForecastCard
                  resale={result.intelligence.resale_projections}
                  currentPrice={result.product?.price}
                />
              )}
              {result.intelligence.product_lifetime && (
                <ProductLifetimeCard lifetime={result.intelligence.product_lifetime} />
              )}
            </div>
          )}

          {result.intelligence?.error && (
            <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 text-amber-400 text-xs">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              Intelligence analysis temporarily unavailable for this product.
            </div>
          )}

          {/* OTHER RETAILERS TABLE */}
          {result.sellers && result.sellers.length > 0 && (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                <span>Available From Other Retailers</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] text-slate-500 uppercase">
                      <th className="text-left py-2 pr-4">Retailer</th>
                      <th className="text-right py-2 px-4">Price</th>
                      <th className="text-center py-2 px-4">Availability</th>
                      <th className="text-right py-2">Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {result.sellers.map((seller) => (
                      <tr key={seller.id || seller.seller_name} className="hover:bg-slate-900/40">
                        <td className="py-2.5 pr-4 font-semibold">{seller.seller_name || 'Unknown'}</td>
                        <td className="py-2.5 px-4 text-right font-extrabold text-white">
                          {seller.current_price
                            ? formatINR(seller.current_price)
                            : <span className="text-slate-500 font-normal">Unavailable from current data source.</span>
                          }
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            seller.availability === 'in_stock'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {seller.availability === 'in_stock' ? 'In Stock' : seller.availability || 'Unknown'}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          {(() => {
                            const rawUrl = seller.product_url || seller.url || '';
                            let cleanUrl = rawUrl;
                            if (cleanUrl.includes('amazon.in/search?q=')) cleanUrl = cleanUrl.replace('amazon.in/search?q=', 'amazon.in/s?k=');
                            if (cleanUrl.includes('flipkart.in/search?q=')) cleanUrl = cleanUrl.replace('flipkart.in/search?q=', 'flipkart.com/search?q=');
                            if (cleanUrl.includes('croma.in/search?q=')) cleanUrl = cleanUrl.replace('croma.in/search?q=', 'croma.com/searchB?q=');
                            if (cleanUrl.includes('meesho.in/search?q=')) cleanUrl = cleanUrl.replace('meesho.in/search?q=', 'meesho.com/search?q=');
                            return cleanUrl ? (
                              <a href={cleanUrl} target="_blank" rel="noopener noreferrer"
                                className="text-cyan-400 hover:text-cyan-300 flex items-center justify-end space-x-1">
                                <span>View</span><ExternalLink className="w-3 h-3" />
                              </a>
                            ) : <span className="text-slate-600">—</span>;
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* HOW IT WORKS (shown only on empty state) */}
      {!result && !loading && !error && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">How URL Analysis Works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
            {[
              { step: '1', title: 'Paste URL', desc: 'Copy the product URL from Amazon, Flipkart, Meesho, Myntra, Croma, or Reliance Digital.' },
              { step: '2', title: 'We Identify', desc: 'We validate the retailer, extract the product ID, and safely match it to our database.' },
              { step: '3', title: 'AI Analysis', desc: 'Get full price history, BUY/WAIT recommendation, resale estimate, lifetime analysis, and more.' },
            ].map((s) => (
              <div key={s.step} className="flex items-start space-x-3">
                <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-black text-xs flex-shrink-0">
                  {s.step}
                </span>
                <div>
                  <p className="font-bold text-white mb-0.5">{s.title}</p>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px]">
            <strong>Data integrity notice:</strong> We never fabricate prices, ratings, or product data.
            If a product is not in our database, we will clearly tell you instead of showing invented information.
          </div>
        </div>
      )}
    </div>
  );
}
