import React from 'react';
import { formatINR } from '../utils/formatters';
import { RefreshCw, Info, TrendingDown } from 'lucide-react';
import DataQualityBadge from './DataQualityBadge';

export default function ResaleForecastCard({ resaleData }) {
  if (!resaleData) return null;

  const { model, confidence, projections = [], note } = resaleData;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-base font-bold text-white">Resale Value &amp; Depreciation Forecast Range</h3>
            <p className="text-xs text-slate-400">{model || 'Secondary Market Depreciation Model'}</p>
          </div>
        </div>

        <DataQualityBadge quality={confidence || 'HIGH'} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/60 uppercase tracking-wider text-[11px] text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Ownership Horizon</th>
              <th className="py-3 px-4">Retained Value Range</th>
              <th className="py-3 px-4">Estimated Resale Value Range</th>
              <th className="py-3 px-4 text-right">Depreciation Loss</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {projections.map((p) => (
              <tr key={p.period} className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">
                  {p.period}
                </td>

                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {p.retention_range}
                  </span>
                </td>

                <td className="py-3.5 px-4 font-extrabold text-sm text-cyan-400">
                  {formatINR(p.estimated_min)} - {formatINR(p.estimated_max)}
                </td>

                <td className="py-3.5 px-4 text-right font-medium text-rose-400">
                  -{formatINR(p.depreciation_loss)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {note && (
        <div className="flex items-start space-x-2 text-[11px] text-slate-400 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p>{note}</p>
        </div>
      )}
    </div>
  );
}
