import React from 'react';
import { formatINR } from '../utils/formatters';
import { ExternalLink, Tag, ShieldCheck } from 'lucide-react';

export default function SellerComparisonTable({ sellers }) {
  if (!sellers || sellers.length === 0) return null;

  const lowestPrice = Math.min(...sellers.map(s => s.price));

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛒 Live Seller Price Comparison</span>
          </h3>
          <p className="text-xs text-slate-400">Compare top Indian electronics retailers to find the lowest available price</p>
        </div>
        <span className="text-[11px] text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full">
          Stored Database Comparison
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/60 uppercase tracking-wider text-[11px] text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Seller / Retailer</th>
              <th className="py-3 px-4">Offered Price</th>
              <th className="py-3 px-4 text-center">Price Badge</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sellers.map((s) => {
              const isBest = s.price === lowestPrice;
              return (
                <tr key={s.id} className={`hover:bg-slate-900/60 transition-colors ${isBest ? 'bg-emerald-500/5' : ''}`}>
                  <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>{s.seller_name}</span>
                  </td>

                  <td className="py-3.5 px-4 font-extrabold text-sm text-slate-100">
                    {formatINR(s.price)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {isBest ? (
                      <span className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        <Tag className="w-3 h-3" />
                        <span>BEST PRICE</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">Standard</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={s.product_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl font-semibold transition-all text-xs ${
                        isBest
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      <span>Buy on {s.seller_name}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
