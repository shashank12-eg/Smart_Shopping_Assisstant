import React from 'react';
import { formatINR } from '../utils/formatters';
import { ExternalLink, Tag, AlertCircle, ShieldAlert } from 'lucide-react';

export default function SellerComparisonTable({ sellers = [], providerStatuses = {} }) {
  // All tracked platforms
  const targetRetailers = [
    { name: 'Amazon', providerKey: 'Amazon' },
    { name: 'Flipkart', providerKey: 'Flipkart' },
    { name: 'Reliance Digital', providerKey: null },
    { name: 'Croma', providerKey: null },
    { name: 'Meesho', providerKey: 'Meesho' },
    { name: 'Myntra', providerKey: 'Myntra' }
  ];

  // Map existing seller offers by name
  const sellerMap = {};
  sellers.forEach(s => {
    sellerMap[s.seller_name.toLowerCase()] = s;
  });

  const availablePrices = sellers.map(s => Number(s.price)).filter(p => p > 0);
  const lowestPrice = availablePrices.length > 0 ? Math.min(...availablePrices) : null;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛒 Live Retailer Price &amp; Availability Intelligence</span>
          </h3>
          <p className="text-xs text-slate-400">
            Real prices from verified platforms. Platforms with no active API feed or out-of-stock data display "Data unavailable".
          </p>
        </div>
        <span className="text-[11px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full font-semibold">
          Multi-Provider Comparison
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/60 uppercase tracking-wider text-[11px] text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Retailer / Platform</th>
              <th className="py-3 px-4">Offered Price</th>
              <th className="py-3 px-4 text-center">Availability / Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {targetRetailers.map((retailer) => {
              const offer = sellerMap[retailer.name.toLowerCase()];
              const isAvailable = Boolean(offer && offer.price > 0);
              const isBest = isAvailable && offer.price === lowestPrice;

              return (
                <tr 
                  key={retailer.name} 
                  className={`hover:bg-slate-900/60 transition-colors ${
                    isBest ? 'bg-emerald-500/5' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
                    <span>{retailer.name}</span>
                  </td>

                  <td className="py-3.5 px-4 font-extrabold text-sm">
                    {isAvailable ? (
                      <span className="text-slate-100">{formatINR(offer.price)}</span>
                    ) : (
                      <span className="text-slate-500 text-xs font-medium italic">Data unavailable</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {isBest ? (
                      <span className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        <Tag className="w-3 h-3" />
                        <span>BEST PRICE</span>
                      </span>
                    ) : isAvailable ? (
                      <span className="text-[11px] text-slate-400 font-medium">In Stock</span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 bg-slate-900 text-slate-500 border border-slate-800 px-2 py-0.5 rounded-full text-[10px]">
                        <AlertCircle className="w-3 h-3" />
                        <span>Feed Offline</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {isAvailable ? (
                      <a
                        href={(() => {
                          const u = offer.product_url || '';
                          if (u.includes('amazon.in/search?q=')) return u.replace('amazon.in/search?q=', 'amazon.in/s?k=');
                          if (u.includes('flipkart.in/search?q=')) return u.replace('flipkart.in/search?q=', 'flipkart.com/search?q=');
                          if (u.includes('croma.in/search?q=')) return u.replace('croma.in/search?q=', 'croma.com/searchB?q=');
                          if (u.includes('meesho.in/search?q=')) return u.replace('meesho.in/search?q=', 'meesho.com/search?q=');
                          return u || '#';
                        })()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl font-semibold transition-all text-xs ${
                          isBest
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        <span>Buy on {retailer.name}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="px-3 py-1.5 rounded-xl text-slate-600 text-xs border border-slate-800/80 cursor-not-allowed"
                      >
                        Unavailable
                      </button>
                    )}
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
