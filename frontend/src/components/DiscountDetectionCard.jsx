import React from 'react';
import { formatINR } from '../utils/formatters';
import { Tag, Sparkles, AlertTriangle, TrendingDown, Clock, ShieldCheck } from 'lucide-react';
import DataQualityBadge from './DataQualityBadge';

export default function DiscountDetectionCard({ discountData }) {
  if (!discountData) return null;

  const {
    current_discount,
    anomalies,
    observed_patterns = [],
    upcoming_discount_windows = []
  } = discountData;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Tag className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-white">Discount &amp; Price Drop Detection</h3>
            <p className="text-xs text-slate-400">Pattern recognition distinguishing historically observed rhythms from projected sales</p>
          </div>
        </div>

        <DataQualityBadge quality="HIGH" />
      </div>

      {/* Current Discount & Anomaly Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Active Markdown</span>
            <span className="text-xl font-black text-emerald-400">
              {current_discount?.percentage > 0 ? `${current_discount.percentage}% OFF` : 'At Standard Price'}
            </span>
            <span className="text-[10px] text-slate-500 block">
              Savings: {formatINR(current_discount?.amount || 0)} vs launch/peak
            </span>
          </div>
          <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Price Anomaly Status</span>
            <span className="text-sm font-bold text-white block pt-1">
              {anomalies?.unusual_price_drop ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> Unusual Flash Price Drop Detected!
                </span>
              ) : anomalies?.unusual_price_spike ? (
                <span className="text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Unusual Price Spike Detected (Stock Low)
                </span>
              ) : (
                <span className="text-slate-300">Normal Market Liquidity</span>
              )}
            </span>
            <span className="text-[10px] text-slate-500 block">No artificial volatility</span>
          </div>
        </div>
      </div>

      {/* Historically Observed Patterns vs Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Section A: Historically Observed Patterns */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Historically Observed Patterns</span>
            </span>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold">
              Observed Past Data
            </span>
          </div>

          <div className="space-y-2">
            {observed_patterns.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1">
                <h5 className="text-xs font-bold text-white">{item.name}</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section B: Forecasted Upcoming Windows */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Likely Upcoming Discount Windows</span>
            </span>
            <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
              Forward Forecast
            </span>
          </div>

          <div className="space-y-2">
            {upcoming_discount_windows.map((win, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-white">{win.window_name}</h5>
                  <span className="text-[10px] text-amber-400 font-semibold">{win.timing}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Projected discount: <strong className="text-emerald-400">{win.projected_discount_depth}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
