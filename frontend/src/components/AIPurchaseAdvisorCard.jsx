import React from 'react';
import { formatINR } from '../utils/formatters';
import { Sparkles, Compass, Target, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import DataQualityBadge from './DataQualityBadge';

export default function AIPurchaseAdvisorCard({ advisorData }) {
  if (!advisorData) return null;

  const {
    verdict,
    confidence,
    why_verdict,
    actionable_advice,
    attractive_target_price,
    potential_savings_vs_avg,
    catalysts_to_watch = [],
    risk_summary,
    data_quality
  } = advisorData;

  const isBuy = verdict === 'BUY NOW';

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-cyan-950/20 to-slate-900 space-y-6 shadow-2xl relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">Expert Consultation</span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              AI Purchase Advisor Executive Verdict
            </h3>
          </div>
        </div>

        <DataQualityBadge quality={data_quality || 'HIGH'} />
      </div>

      {/* Why Buy Now / Why Wait Section */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{isBuy ? "Why Buy Now?" : "Why Wait?"}</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed font-normal">
          {why_verdict}
        </p>
      </div>

      {/* Actionable Advice & Attractive Target Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-white">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Target Attractive Entry Price</span>
          </div>
          <span className="text-2xl font-black text-emerald-400 block">
            {formatINR(attractive_target_price)}
          </span>
          <p className="text-xs text-slate-400">
            {potential_savings_vs_avg > 0 ? (
              <span>Potential savings vs average: <strong>{formatINR(potential_savings_vs_avg)}</strong></span>
            ) : (
              <span>Currently at or below ideal entry band</span>
            )}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-white">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Tactical Advice</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {actionable_advice}
          </p>
        </div>
      </div>

      {/* What could cause the recommendation to change? (Catalysts) */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>What Could Cause This Recommendation to Change?</span>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-300">
          {catalysts_to_watch.map((cat, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="text-cyan-400 font-bold mt-0.5">&bull;</span>
              <span>{cat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Risk Assessment */}
      {risk_summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Risk of Buying Today:</span>
            <span className="text-slate-300 font-medium block pt-0.5">{risk_summary.risk_of_buying_now}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Risk of Waiting:</span>
            <span className="text-slate-300 font-medium block pt-0.5">{risk_summary.risk_of_waiting}</span>
          </div>
        </div>
      )}
    </div>
  );
}
