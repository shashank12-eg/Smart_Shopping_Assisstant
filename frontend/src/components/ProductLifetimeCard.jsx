import React from 'react';
import { ShieldCheck, BatteryCharging, Wrench, AlertTriangle, Layers, CheckCircle2 } from 'lucide-react';
import DataQualityBadge from './DataQualityBadge';

export default function ProductLifetimeCard({ lifetimeData }) {
  if (!lifetimeData) return null;

  const {
    estimated_lifetime,
    warranty_coverage,
    battery_service_considerations,
    software_support_horizon,
    hardware_limitations,
    maintenance_milestones = [],
    confidence
  } = lifetimeData;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-teal-400" />
          <div>
            <h3 className="text-base font-bold text-white">Product Usable Lifetime &amp; Service Cycle</h3>
            <p className="text-xs text-slate-400">Lifecycle estimates based on category durability and battery degradation rates</p>
          </div>
        </div>

        <DataQualityBadge quality={confidence || 'HIGH'} />
      </div>

      {/* Top 3 Lifetime Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Expected Usable Lifetime</span>
          <span className="text-xl font-extrabold text-teal-400 block pt-1">{estimated_lifetime}</span>
          <span className="text-[10px] text-slate-500 block">Under standard daily consumer usage</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Warranty Protection</span>
          <span className="text-sm font-extrabold text-white block pt-1">{warranty_coverage}</span>
          <span className="text-[10px] text-slate-500 block">Official brand authorized support</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Software Support Horizon</span>
          <span className="text-sm font-extrabold text-white block pt-1">{software_support_horizon}</span>
          <span className="text-[10px] text-slate-500 block">Security and firmware updates</span>
        </div>
      </div>

      {/* Maintenance Milestones Timeline */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Wrench className="w-4 h-4 text-teal-400" />
          <span>Major Lifecycle Maintenance Milestones</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {maintenance_milestones.map((m, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850 flex items-start space-x-3">
              <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] font-bold mt-0.5 whitespace-nowrap">
                {m.year}
              </span>
              <p className="text-xs text-slate-300 leading-snug">{m.event}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Battery Considerations & Limitations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-white">
            <BatteryCharging className="w-4 h-4 text-amber-400" />
            <span>Battery Degradation Considerations</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {battery_service_considerations}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-white">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Hardware Service Limitations</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {hardware_limitations}
          </p>
        </div>
      </div>
    </div>
  );
}
