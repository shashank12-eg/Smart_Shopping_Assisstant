import React from 'react';
import { formatINR } from '../utils/formatters';
import { DollarSign, TrendingDown, Info } from 'lucide-react';

export default function ResaleValueCard({ resaleData }) {
  if (!resaleData || resaleData.length === 0) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📉 5-Year Resale Value &amp; Depreciation Projection</span>
          </h3>
          <p className="text-xs text-slate-400">Estimated value retention projection over a 5-year device lifespan</p>
        </div>
        <div className="flex items-center space-x-1 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
          <Info className="w-3.5 h-3.5" />
          <span>Estimated Rule-Based Projection</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/60 uppercase tracking-wider text-[11px] text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Ownership Year</th>
              <th className="py-3 px-4">Retained Value %</th>
              <th className="py-3 px-4">Estimated Resale Price</th>
              <th className="py-3 px-4 text-right">Cumulative Depreciation Loss</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {resaleData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3 px-4 font-bold text-white">{row.year}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2 rounded-full" 
                        style={{ width: `${row.retained_pct}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-cyan-400">{row.retained_pct}%</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-extrabold text-white text-sm">
                  {formatINR(row.resale_value)}
                </td>
                <td className="py-3 px-4 text-right font-medium text-rose-400">
                  -{formatINR(row.depreciation_loss)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
