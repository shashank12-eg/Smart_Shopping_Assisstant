import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/formatters';
import BuyWaitBadge from '../components/BuyWaitBadge';
import PriceGraph from '../components/PriceGraph';
import SellerComparisonTable from '../components/SellerComparisonTable';
import MaintenanceCostCard from '../components/MaintenanceCostCard';
import ResaleValueCard from '../components/ResaleValueCard';
import SpecModal from '../components/SpecModal';
import { 
  Heart, 
  Sliders, 
  Bell, 
  Star, 
  Cpu, 
  HardDrive, 
  Monitor, 
  Battery, 
  ShieldCheck, 
  ExternalLink,
  CheckCircle,
  HelpCircle,
  TrendingDown
} from 'lucide-react';

import { getCompareIds, addCompareId } from '../utils/compareStorage';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCompareClick = () => {
    if (!product) return;
    const current = getCompareIds();
    const numId = Number(product.id);
    if (!current.includes(numId)) {
      if (current.length >= 4) {
        alert('You can compare up to 4 products at a time.');
        return;
      }
      const res = addCompareId(product.id);
      navigate(`/compare?ids=${res.ids.join(',')}`);
    } else {
      navigate(`/compare?ids=${current.join(',')}`);
    }
  };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Spec Modal state
  const [selectedSpec, setSelectedSpec] = useState(null);
  
  // Price Alert form state
  const [alertTargetPrice, setAlertTargetPrice] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    loadDetail();
  }, [id, user]);

  const loadDetail = () => {
    setLoading(true);
    api.products.getDetail(id)
      .then((res) => {
        setData(res);
        setAlertTargetPrice(Math.round(res.product.price * 0.95).toString());
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load product details.');
        setLoading(false);
      });
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (data.product.is_wishlisted) {
        await api.wishlist.remove(data.product.id);
      } else {
        await api.wishlist.add(data.product.id);
      }
      loadDetail();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePriceAlert = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!alertTargetPrice || isNaN(alertTargetPrice)) return;

    try {
      const res = await api.priceAlerts.create(data.product.id, Number(alertTargetPrice));
      setAlertMessage(res.message);
      loadDetail();
      setTimeout(() => setAlertMessage(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 text-sm">Analyzing price history &amp; specification intelligence...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center space-y-4">
        <p className="text-rose-400 text-base">{error || 'Product not found.'}</p>
        <button onClick={() => navigate('/browse')} className="text-xs font-bold text-cyan-400 hover:underline">
          Return to Browse Products
        </button>
      </div>
    );
  }

  const { product, price_history, sellers, price_intelligence, maintenance_cost, resale_depreciation, spec_explanations } = data;

  // Specifications array formatted for interactive clicks
  const specsList = [
    { key: 'Processor', value: product.processor, icon: Cpu },
    { key: 'RAM', value: product.ram, icon: Cpu },
    { key: 'Storage', value: product.storage, icon: HardDrive },
    { key: 'GPU', value: product.gpu, icon: Cpu },
    { key: 'Display', value: product.display, icon: Monitor },
    { key: 'Refresh Rate', value: product.refresh_rate, icon: Monitor },
    { key: 'Battery', value: product.battery, icon: Battery },
    { key: 'Operating System', value: product.operating_system, icon: Cpu },
    { key: 'Warranty', value: product.warranty, icon: ShieldCheck },
    { key: 'Camera', value: product.camera, icon: Cpu },
    { key: 'Charging', value: product.charging, icon: Battery },
    { key: 'ANC', value: product.anc, icon: Cpu },
  ].filter(s => Boolean(s.value));

  return (
    <div className="space-y-12 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* TOP PRODUCT HEADER & ACTION CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
        
        {/* Product Image */}
        <div className="lg:col-span-5 bg-slate-900/60 p-8 rounded-2xl flex items-center justify-center border border-slate-800/80">
          <img 
            src={product.image} 
            alt={product.name} 
            className="max-h-80 object-contain hover:scale-105 transition-transform duration-300" 
          />
        </div>

        {/* Product Info & Quick Summary */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                {product.brand} &bull; {product.category}
              </span>
              <div className="flex items-center space-x-1 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800 text-xs text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-white">{product.rating} / 5.0</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {product.name}
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Current Retail Price</span>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {formatINR(product.price)}
                </span>
                <span className="text-xs text-slate-400">
                  (12M Avg: <strong className="text-amber-400">{formatINR(price_intelligence.avg_price)}</strong>)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  const lowestSeller = sellers.length > 0 ? sellers[0] : null;
                  if (lowestSeller && lowestSeller.product_url) {
                    window.open(lowestSeller.product_url, '_blank');
                  } else {
                    alert(`Demo buy action for ${product.name} at ${formatINR(product.price)}`);
                  }
                }}
                className="flex-1 min-w-[160px] bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-center flex items-center justify-center space-x-2"
              >
                <span>Buy Now ({formatINR(product.price)})</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`p-3 rounded-xl border transition-all flex items-center space-x-2 text-xs font-semibold ${
                  product.is_wishlisted
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${product.is_wishlisted ? 'fill-rose-500' : ''}`} />
                <span>{product.is_wishlisted ? 'Wishlisted' : 'Wishlist'}</span>
              </button>

              <button
                onClick={handleCompareClick}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center space-x-2"
              >
                <Sliders className="w-4 h-4" />
                <span>Compare</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1. PRICE INTELLIGENCE RECOMMENDATION (BUY NOW vs WAIT) */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">Price Intelligence Recommendation</h2>
        <BuyWaitBadge intelligence={price_intelligence} showLegend={true} />
      </section>

      {/* 2. PRICE SUMMARY STAT CARDS */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Current Price</span>
          <span className="text-lg font-black text-white">{formatINR(price_intelligence.current_price)}</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">12-Month Lowest</span>
          <span className="text-lg font-black text-emerald-400">{formatINR(price_intelligence.lowest_price)}</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">12-Month Highest</span>
          <span className="text-lg font-black text-rose-400">{formatINR(price_intelligence.highest_price)}</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">12-Month Average</span>
          <span className="text-lg font-black text-amber-400">{formatINR(price_intelligence.avg_price)}</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Est. Savings</span>
          <span className="text-lg font-black text-cyan-400">{formatINR(price_intelligence.estimated_savings)}</span>
        </div>
      </section>

      {/* 3. 12-MONTH HISTORICAL PRICE GRAPH (RECHARTS) */}
      <section>
        <PriceGraph historyData={price_history} avgPrice={price_intelligence.avg_price} />
      </section>

      {/* 4. LIVE SELLER PRICE COMPARISON */}
      <section>
        <SellerComparisonTable sellers={sellers} />
      </section>

      {/* 5. HARDWARE SPECIFICATIONS WITH CLICKABLE EXPLANATIONS */}
      <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>⚡ Complete Hardware Specifications</span>
            </h3>
            <p className="text-xs text-slate-400">Click any spec title to open a beginner-friendly explanation guide</p>
          </div>
          <span className="text-[11px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Click spec for guide
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {specsList.map((spec) => (
            <div
              key={spec.key}
              onClick={() => setSelectedSpec({ key: spec.key, value: spec.value, explanation: spec_explanations[spec.key] })}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-1 group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300 group-hover:text-cyan-400">{spec.key}</span>
                <HelpCircle className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
              </div>
              <p className="text-xs font-bold text-white truncate">{spec.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SPEC EXPLANATION POPUP MODAL */}
      {selectedSpec && (
        <SpecModal
          specKey={selectedSpec.key}
          specValue={selectedSpec.value}
          explanation={selectedSpec.explanation}
          onClose={() => setSelectedSpec(null)}
        />
      )}

      {/* 6. 5-YEAR MAINTENANCE & OWNERSHIP COST */}
      <section>
        <MaintenanceCostCard maintenance={maintenance_cost} productPrice={product.price} />
      </section>

      {/* 7. 5-YEAR RESALE VALUE & DEPRECIATION */}
      <section>
        <ResaleValueCard resaleData={resale_depreciation} />
      </section>

      {/* 8. CREATE PRICE ALERT FORM */}
      <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-base font-bold text-white">Create Target Price Alert</h3>
            <p className="text-xs text-slate-400">Receive in-app alerts when {product.name} drops below your target price</p>
          </div>
        </div>

        {alertMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>{alertMessage}</span>
          </div>
        )}

        <form onSubmit={handleCreatePriceAlert} className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-4 top-3 text-xs text-slate-400 font-bold">₹</span>
            <input
              type="number"
              value={alertTargetPrice}
              onChange={(e) => setAlertTargetPrice(e.target.value)}
              placeholder="Target price in ₹"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-8 pr-4 text-xs text-white focus:outline-none focus:border-cyan-500 font-bold"
            />
          </div>
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md"
          >
            Set Price Alert
          </button>
        </form>
      </section>
    </div>
  );
}
