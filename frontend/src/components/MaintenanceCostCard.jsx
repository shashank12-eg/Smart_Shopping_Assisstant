import React from 'react';
import { formatINR } from '../utils/formatters';
import { Wrench, Calculator, ShieldAlert } from 'lucide-react';

export default function MaintenanceCostCard({ maintenance, productPrice }) {
  if (!maintenance) return null;

  const { battery_replacement, annual_servicing, electricity_power, accessories_chargers, total_maintenance_5yr, total_ownership_cost_5yr } = maintenance;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>🔧 5-Year Estimated Maintenance &amp; Ownership Cost</span>
        </h3>
        <p className="text-xs text-slate-400">Estimated cumulative post-purchase expense breakdown over 5 years of ownership</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Battery Replacement</span>
          <span className="text-sm font-bold text-slate-200">{formatINR(battery_replacement)}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Annual Servicing (5 Yrs)</span>
          <span className="text-sm font-bold text-slate-200">{formatINR(annual_servicing)}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Electricity / Charging</span>
          <span className="text-sm font-bold text-slate-200">{formatINR(electricity_power)}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Accessories &amp; Chargers</span>
          <span className="text-sm font-bold text-slate-200">{formatINR(accessories_chargers)}</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Total 5-Year Maintenance</span>
          <span className="text-lg font-extrabold text-cyan-400">{formatINR(total_maintenance_5yr)}</span>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">5-Year Total Ownership Cost</span>
          <span className="text-xl font-black text-white">{formatINR(total_ownership_cost_5yr)}</span>
          <span className="text-[10px] text-slate-400 block">(Purchase Price {formatINR(productPrice)} + Maintenance)</span>
        </div>
      </div>
    </div>
  );
}
