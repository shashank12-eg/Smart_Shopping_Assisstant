import React from 'react';
import { formatINR } from '../utils/formatters';
import { TrendingDown, TrendingUp, Minus, BarChart3, Activity } from 'lucide-react';
import DataQualityBadge from './DataQualityBadge';

export default function PriceStatisticsCard({ priceAnalysis }) {
  if (!priceAnalysis) return null;

  const {
    current_price,
    today_change,
    change_7d,
    change_30d,
    lowest_historical_price,
    highest_historical_price,
    historical_average,
    pct_difference_from_average,
    data_quality
  } = priceAnalysis;

  const renderDelta = (delta) => {
    if (!delta) return <span className="text-slate-500 text-xs">--</span>;
    const isDown = delta.amount < 0;
    const isUp = delta.amount > 0;
    const Icon = isDown ? TrendingDown : (isUp ? TrendingUp : Minus);
    const color = isDown ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : (isUp ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-slate-400 bg-slate-800/40 border-slate-700/40');

    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md border text-xs font-bold ${color}`}>
        <Icon className="w-3 h-3" />
        <span>{isDown ? '-' : (isUp ? '+' : '')}{formatINR(Math.abs(delta.amount))}</span>
        <span className="opacity-80">({Math.abs(delta.percentage)}%)</span>
      </div>
    );
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-base font-bold text-white">Current Price &amp; Trajectory Statistics</h3>
            <p className="text-xs text-slate-400">Multi-interval shifts compared with long-term historical average</p>
          </div>
        </div>
        <DataQualityBadge quality={data_quality || 'HIGH'} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Current Price */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Current Price</span>
          <span className="text-xl font-extrabold text-white block">{formatINR(current_price)}</span>
          <span className="text-[11px] text-slate-400 block">
            {pct_difference_from_average < 0 ? (
              <strong className="text-emerald-400">{Math.abs(pct_difference_from_average)}% below avg</strong>
            ) : pct_difference_from_average > 0 ? (
              <strong className="text-rose-400">{pct_difference_from_average}% above avg</strong>
            ) : (
              <strong className="text-amber-400">At historical avg</strong>
            )}
          </span>
        </div>

        {/* Today's Change */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Today's Shift</span>
          <div className="pt-1">{renderDelta(today_change)}</div>
          <span className="text-[10px] text-slate-500 block pt-1">vs immediate previous</span>
        </div>

        {/* Last 7 Days Change */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Last 7 Days</span>
          <div className="pt-1">{renderDelta(change_7d)}</div>
          <span className="text-[10px] text-slate-500 block pt-1">Weekly interval shift</span>
        </div>

        {/* Last 30 Days Change */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Last 30 Days</span>
          <div className="pt-1">{renderDelta(change_30d)}</div>
          <span className="text-[10px] text-slate-500 block pt-1">Monthly cycle movement</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* Lowest Historical Price */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Historical Lowest</span>
            <span className="text-base font-bold text-emerald-400">{formatINR(lowest_historical_price)}</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded">All-Time Low</span>
        </div>

        {/* Highest Historical Price */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Historical Highest</span>
            <span className="text-base font-bold text-rose-400">{formatINR(highest_historical_price)}</span>
          </div>
          <span className="text-[10px] font-bold text-rose-500/80 bg-rose-500/10 px-2 py-0.5 rounded">Launch / Peak</span>
        </div>

        {/* Historical Average */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Historical Mean</span>
            <span className="text-base font-bold text-amber-400">{formatINR(historical_average)}</span>
          </div>
          <span className="text-[10px] font-bold text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded">Fair Benchmark</span>
        </div>
      </div>
    </div>
  );
}
