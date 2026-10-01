import React, { useState } from 'react';
import { formatINR } from '../utils/formatters';
import { Calculator, DollarSign, Battery, Wrench, Shield, Check, SlidersHorizontal } from 'lucide-react';
import DataQualityBadge from './DataQualityBadge';

export default function TotalOwnershipCard({ ownershipData, productPrice = 0 }) {
  if (!ownershipData) return null;

  const { assumptions, breakdown, ownership_horizons, confidence } = ownershipData;

  // Editable assumption overrides for interactive customization
  const [includeBattery, setIncludeBattery] = useState(true);
  const [extendedAccessories, setExtendedAccessories] = useState(false);
  const [selectedHorizon, setSelectedHorizon] = useState('5_years');

  const currPrice = Number(productPrice);
  const batteryCost = includeBattery ? (breakdown?.battery_replacement || 3500) : 0;
  const accessoriesCost = extendedAccessories 
    ? (breakdown?.five_year_accessories || 3000) * 1.5 
    : (breakdown?.five_year_accessories || 3000);
  const servicingCost = breakdown?.five_year_servicing || 5000;
  const electricityCost = breakdown?.five_year_electricity || 4000;

  const totalCalculatedMaintenance = batteryCost + accessoriesCost + servicingCost + electricityCost;
  const resaleYear5 = ownership_horizons?.['5_years']?.estimated_resale || (currPrice * 0.22);
  const trueNetCost5Yr = (currPrice + totalCalculatedMaintenance) - resaleYear5;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-base font-bold text-white">Total Cost of Ownership (TCO) Calculator</h3>
            <p className="text-xs text-slate-400">
              True Net Cost = (Purchase Price + 5-Year Maintenance) - Estimated 5-Year Resale Value
            </p>
          </div>
        </div>

        <DataQualityBadge quality={confidence || 'HIGH'} />
      </div>

      {/* Hero 5-Year Net Ownership Highlight */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-slate-900 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
            5-Year Net Cost of Ownership
          </span>
          <div className="flex items-baseline space-x-2 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {formatINR(trueNetCost5Yr)}
            </span>
            <span className="text-xs text-slate-400">
              (~{formatINR(Math.round(trueNetCost5Yr / 60))}/month)
            </span>
          </div>
        </div>

        <div className="text-right text-xs text-slate-400 space-y-0.5">
          <div>Purchase: <strong className="text-white">{formatINR(currPrice)}</strong></div>
          <div>+ Total Maintenance: <strong className="text-rose-400">+{formatINR(totalCalculatedMaintenance)}</strong></div>
          <div>- Year 5 Resale: <strong className="text-emerald-400">-{formatINR(resaleYear5)}</strong></div>
        </div>
      </div>

      {/* Multi-Horizon Cards: 1-Year, 3-Years, 5-Years */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {['1_year', '3_years', '5_years'].map((key) => {
          const h = ownership_horizons?.[key];
          if (!h) return null;
          const isSelected = selectedHorizon === key;
          return (
            <div
              key={key}
              onClick={() => setSelectedHorizon(key)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">{h.period} Horizon</span>
                <span className="text-[10px] text-amber-400 font-semibold">{formatINR(h.monthly_cost)}/mo</span>
              </div>
              <div className="text-lg font-black text-slate-100">{formatINR(h.true_net_ownership_cost)}</div>
              <div className="text-[11px] text-slate-500 pt-1">
                Maint: {formatINR(h.maintenance)} &bull; Resale: {formatINR(h.estimated_resale)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Assumptions Toggles */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Maintenance Assumptions:</span>
        </span>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={includeBattery} 
              onChange={(e) => setIncludeBattery(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0" 
            />
            <span>Include Mid-Life Battery Replacement ({formatINR(breakdown?.battery_replacement || 3500)})</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={extendedAccessories} 
              onChange={(e) => setExtendedAccessories(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0" 
            />
            <span>Include Premium Cases, Docks &amp; Surge Protectors</span>
          </label>
        </div>
      </div>
    </div>
  );
}
