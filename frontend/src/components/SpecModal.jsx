import React from 'react';
import { X, Cpu, Info, CheckCircle2 } from 'lucide-react';

export default function SpecModal({ specKey, specValue, explanation, onClose }) {
  if (!specKey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">{specKey} Explanation</h3>
            <p className="text-xs text-cyan-400 font-mono">{specValue}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-6 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Beginner Guide</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {explanation || `Learn how ${specKey} impacts your daily device usage, performance, and longevity.`}
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-md"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}
