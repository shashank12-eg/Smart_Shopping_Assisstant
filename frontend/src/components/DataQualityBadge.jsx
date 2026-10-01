import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function DataQualityBadge({ quality = 'HIGH', score, subtitle }) {
  const level = (typeof quality === 'object' ? quality.level : quality) || 'HIGH';
  const displayScore = (typeof quality === 'object' ? quality.score : score);

  const config = {
    HIGH: {
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: ShieldCheck,
      text: 'HIGH CONFIDENCE',
      desc: 'Based on verified multi-retailer history'
    },
    MEDIUM: {
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
      text: 'MEDIUM CONFIDENCE',
      desc: 'Estimated within trend limits'
    },
    LOW: {
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      icon: ShieldAlert,
      text: 'LOW CONFIDENCE',
      desc: 'Limited data; category heuristics used'
    }
  };

  const current = config[level] || config.MEDIUM;
  const Icon = current.icon;

  return (
    <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-wider uppercase ${current.color}`}>
      <Icon className="w-3 h-3 flex-shrink-0" />
      <span>{current.text}</span>
      {displayScore && <span className="opacity-75">({displayScore}%)</span>}
    </div>
  );
}
