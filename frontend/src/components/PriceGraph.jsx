import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { formatINR } from '../utils/formatters';

const CustomTooltip = ({ active, payload, label, avgPrice }) => {
  if (active && payload && payload.length) {
    const price = payload[0].value;
    const diff = price - avgPrice;
    const pct = ((diff / avgPrice) * 100).toFixed(1);

    return (
      <div className="glass-panel p-3.5 rounded-xl text-xs space-y-1 shadow-xl border border-slate-700">
        <p className="font-semibold text-slate-300 border-b border-slate-700/60 pb-1">{label}</p>
        <p className="text-cyan-400 font-bold text-sm">
          Price: {formatINR(price)}
        </p>
        <p className={`text-[11px] font-medium ${diff <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {diff <= 0 ? `${Math.abs(pct)}% below 12-mo average` : `${pct}% above 12-mo average`}
        </p>
      </div>
    );
  }
  return null;
};

export default function PriceGraph({ historyData, avgPrice }) {
  if (!historyData || historyData.length === 0) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📈 12-Month Price History Graph</span>
          </h3>
          <p className="text-xs text-slate-400">Track historical price fluctuations and compare with 12-month average</p>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-cyan-400 rounded"></span>
            <span className="text-slate-300">Historical Price (₹)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-amber-400 border border-dashed border-amber-400"></span>
            <span className="text-slate-300">Average ({formatINR(avgPrice)})</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historyData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis 
              stroke="#64748b" 
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} 
              domain={['dataMin - 2000', 'dataMax + 2000']}
            />
            <Tooltip content={<CustomTooltip avgPrice={avgPrice} />} />
            {avgPrice && (
              <ReferenceLine y={avgPrice} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: '12M Avg', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }} />
            )}
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#06b6d4" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#06b6d4', strokeWidth: 2, stroke: '#090d16' }}
              activeDot={{ r: 7, fill: '#38bdf8', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
