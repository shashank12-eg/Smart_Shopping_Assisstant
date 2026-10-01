import React from 'react';
import { formatINR } from '../utils/formatters';
import { ShoppingBag, Clock, Compass, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import DataQualityBadge from './DataQualityBadge';

export default function DecisionEngineCard({ decision }) {
  if (!decision) return null;

  const {
    recommendation,
    confidence,
    expected_price_range,
    expected_waiting_period,
    reasoning,
    data_quality,
    volatility_score,
    seller_spread_pct,
    disclaimer
  } = decision;

  const getTheme = (rec) => {
    if (rec === 'BUY NOW') {
      return {
        bg: 'from-emerald-500/20 via-teal-500/10 to-slate-900',
        badge: 'bg-emerald-500 text-slate-950',
        border: 'border-emerald-500/40',
        glow: 'shadow-emerald-500/10',
        text: 'text-emerald-400'
      };
    } else if (rec.includes('WAIT')) {
      return {
        bg: 'from-rose-500/20 via-orange-500/10 to-slate-900',
        badge: 'bg-rose-500 text-white',
        border: 'border-rose-500/40',
        glow: 'shadow-rose-500/10',
        text: 'text-rose-400'
      };
    } else {
      return {
        bg: 'from-amber-500/20 via-yellow-500/10 to-slate-900',
        badge: 'bg-amber-400 text-slate-950',
        border: 'border-amber-500/40',
        glow: 'shadow-amber-500/10',
        text: 'text-amber-400'
      };
    }
  };

  const theme = getTheme(recommendation);

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border bg-gradient-to-br ${theme.bg} ${theme.border} shadow-2xl ${theme.glow} space-y-6 relative overflow-hidden`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-md">
            <Compass className={`w-6 h-6 ${theme.text}`} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">AI Purchase Decision Engine</span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <span>{recommendation}</span>
              <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${theme.badge}`}>
                {confidence}% Confidence
              </span>
            </h3>
          </div>
        </div>

        <DataQualityBadge quality={data_quality || 'HIGH'} />
      </div>

      {/* Decision Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Recommended Horizon</span>
          <div className="flex items-center space-x-2 pt-1 text-white font-bold text-sm">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>{expected_waiting_period}</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Expected Entry Target</span>
          <div className="pt-1 text-white font-bold text-sm">
            {expected_price_range && expected_price_range.length === 2 ? (
              <span>{formatINR(expected_price_range[0])} - {formatINR(expected_price_range[1])}</span>
            ) : (
              <span>Market standard</span>
            )}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Observed Volatility</span>
          <div className="pt-1 text-white font-bold text-sm">
            <span>{volatility_score || 2.5}% historical variance</span>
          </div>
        </div>
      </div>

      {/* Reasoning Breakdown */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>Algorithmic Rationale &amp; Market Drivers:</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
          {reasoning}
        </p>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-500 italic">
        * {disclaimer || "Predictions are probabilistic estimates based on observed historical patterns; market certainty is never claimed."}
      </p>
    </div>
  );
}
