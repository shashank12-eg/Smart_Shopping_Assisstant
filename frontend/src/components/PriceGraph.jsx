import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, ReferenceDot } from 'recharts';
import { formatINR } from '../utils/formatters';
import { Calendar, TrendingDown, TrendingUp } from 'lucide-react';

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
          {diff <= 0 ? `${Math.abs(pct)}% below average` : `${pct}% above average`}
        </p>
      </div>
    );
  }
  return null;
};

export default function PriceGraph({ historyData = [], avgPrice, currentPrice }) {
  const [timeframe, setTimeframe] = useState('1Y'); // '7D', '30D', '3M', '6M', '1Y', 'MAX'

  // Filter history data according to timeframe
  const filteredData = useMemo(() => {
    if (!historyData || historyData.length === 0) return [];
    const len = historyData.length;
    if (timeframe === '7D') {
      return historyData.slice(Math.max(0, len - 2));
    } else if (timeframe === '30D') {
      return historyData.slice(Math.max(0, len - 3));
    } else if (timeframe === '3M') {
      return historyData.slice(Math.max(0, len - 4));
    } else if (timeframe === '6M') {
      return historyData.slice(Math.max(0, len - 6));
    } else if (timeframe === '1Y') {
      return historyData.slice(Math.max(0, len - 12));
    }
    return historyData;
  }, [historyData, timeframe]);

  if (!historyData || historyData.length === 0) return null;

  const prices = filteredData.map(d => Number(d.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const latestPrice = prices[prices.length - 1];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📈 Interactive Historical Price Trajectory</span>
          </h3>
          <p className="text-xs text-slate-400">
            Multi-interval Recharts tracking showing Lowest, Highest &amp; Current price points clearly
          </p>
        </div>

        {/* Timeframe Selector Pills */}
        <div className="flex flex-wrap items-center space-x-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: '7D', label: '7 Days' },
            { id: '30D', label: '30 Days' },
            { id: '3M', label: '3 Months' },
            { id: '6M', label: '6 Months' },
            { id: '1Y', label: '1 Year' },
            { id: 'MAX', label: 'Max History' }
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeframe === tf.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Markers Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span>Current: <strong className="text-white">{formatINR(latestPrice)}</strong></span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span>Lowest: <strong className="text-emerald-400">{formatINR(minPrice)}</strong></span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
          <span>Highest: <strong className="text-rose-400">{formatINR(maxPrice)}</strong></span>
        </div>
        {avgPrice && (
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-amber-400 border border-dashed border-amber-400"></span>
            <span>Average: <strong className="text-amber-400">{formatINR(avgPrice)}</strong></span>
          </div>
        )}
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis 
              stroke="#64748b" 
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} 
              domain={['dataMin - 1500', 'dataMax + 1500']}
            />
            <Tooltip content={<CustomTooltip avgPrice={avgPrice} />} />
            
            {/* Average Reference Line */}
            {avgPrice && (
              <ReferenceLine 
                y={avgPrice} 
                stroke="#f59e0b" 
                strokeDasharray="4 4" 
                label={{ value: 'Mean', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }} 
              />
            )}

            {/* Lowest Reference Line */}
            <ReferenceLine 
              y={minPrice} 
              stroke="#10b981" 
              strokeDasharray="3 3" 
              label={{ value: 'Lowest', fill: '#10b981', fontSize: 9, position: 'insideBottomRight' }} 
            />

            {/* Highest Reference Line */}
            <ReferenceLine 
              y={maxPrice} 
              stroke="#f43f5e" 
              strokeDasharray="3 3" 
              label={{ value: 'Highest', fill: '#f43f5e', fontSize: 9, position: 'insideTopLeft' }} 
            />

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
