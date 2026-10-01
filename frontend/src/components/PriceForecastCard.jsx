import React, { useState } from 'react';
import { formatINR } from '../utils/formatters';
import { LineChart, Calendar, AlertCircle, Info, ArrowRight } from 'lucide-react';
import DataQualityBadge from './DataQualityBadge';

export default function PriceForecastCard({ forecastData }) {
  if (!forecastData) return null;

  if (forecastData.status === 'insufficient_data') {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 text-center">
        <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400">
          <AlertCircle className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-white">Future Price Estimation</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          {forecastData.message || 'Insufficient historical observations to establish an accurate forecasting model.'}
        </p>
      </div>
    );
  }

  const forecasts = forecastData.forecasts || {};
  const periods = Object.keys(forecasts);
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0] || '7 Days');

  const current = forecasts[selectedPeriod] || {};

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-base font-bold text-white">Future Price Estimation Range</h3>
            <p className="text-xs text-slate-400">Transparent linear regression forecasting with category mean-reversion</p>
          </div>
        </div>

        <DataQualityBadge quality={forecastData.data_quality || 'HIGH'} />
      </div>

      {/* Interval Pill Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        {periods.map((p) => {
          const isSelected = selectedPeriod === p;
          return (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Forecast Detail Display */}
      {current && (
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Expected Midpoint</span>
              <span className="text-xl font-extrabold text-white block pt-1">{formatINR(current.expected_price)}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Confidence Band</span>
              <span className="text-base font-extrabold text-cyan-400 block pt-1">
                {formatINR(current.min_price)} - {formatINR(current.max_price)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Statistical Confidence</span>
              <span className="text-base font-extrabold text-emerald-400 block pt-1">
                {current.confidence}% Probability
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-2 text-xs text-slate-400 pt-1">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Forecasting Rationale:</strong> {current.rationale}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
