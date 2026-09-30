import React from 'react';
import { formatINR } from '../utils/formatters';
import { TrendingDown, TrendingUp, Minus, ShieldCheck, HelpCircle } from 'lucide-react';

export default function BuyWaitBadge({ intelligence, showLegend = true }) {
  if (!intelligence) return null;

  const { recommendation, status_color, pct_diff, estimated_savings, confidence, reason } = intelligence;

  let bgGradient = 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400';
  let badgeColor = 'bg-emerald-500 text-slate-950 font-bold';
  let Icon = TrendingDown;
  let statusText = "Good Time to Buy";

  if (status_color === 'YELLOW') {
    bgGradient = 'from-amber-500/20 to-yellow-500/10 border-amber-500/40 text-amber-400';
    badgeColor = 'bg-amber-400 text-slate-950 font-bold';
    Icon = Minus;
    statusText = "Average Price (Neutral)";
  } else if (status_color === 'RED') {
    bgGradient = 'from-rose-500/20 to-red-500/10 border-rose-500/40 text-rose-400';
    badgeColor = 'bg-rose-500 text-white font-bold';
    Icon = TrendingUp;
    statusText = "Consider Waiting";
  }

  return (
    <div className="space-y-4">
      <div className={`p-6 rounded-2xl border bg-gradient-to-br ${bgGradient} shadow-xl backdrop-blur-md relative overflow-hidden`}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center space-x-3">
            <span className={`px-4 py-1.5 rounded-full text-sm tracking-wide shadow-md flex items-center gap-1.5 ${badgeColor}`}>
              <Icon className="w-4 h-4" />
              {recommendation}
            </span>
            <span className="text-xs font-medium text-slate-300 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-700/50">
              {statusText}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Confidence: <strong className="text-white">{confidence}%</strong></span>
          </div>
        </div>

        <p className="text-slate-200 text-sm leading-relaxed mb-4">
          {reason}
        </p>

        {estimated_savings > 0 && (
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1.5 rounded-xl text-xs font-semibold">
            <span>🎉 Estimated Savings:</span>
            <span className="font-bold text-sm text-emerald-300">{formatINR(estimated_savings)}</span>
          </div>
        )}
      </div>

      {showLegend && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center space-x-1.5 font-semibold text-slate-300 mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Recommendation Legend &amp; Decision Formula</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
            <div className="flex items-start space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 flex-shrink-0"></span>
              <div>
                <strong className="text-emerald-400">GREEN = BUY NOW</strong>
                <p className="text-[11px] text-slate-400">Price is &ge; 3% below 12-month historical average.</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 flex-shrink-0"></span>
              <div>
                <strong className="text-amber-400">YELLOW = AVERAGE PRICE</strong>
                <p className="text-[11px] text-slate-400">Price is within &plusmn;3% of 12-month average.</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 mt-1 flex-shrink-0"></span>
              <div>
                <strong className="text-rose-400">RED = WAIT</strong>
                <p className="text-[11px] text-slate-400">Price is &gt; 3% above 12-month average.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
