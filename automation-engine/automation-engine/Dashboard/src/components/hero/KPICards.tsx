import React from 'react';
import { Component, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface KPICardsProps {
  stats: {
    total: number;
    operational: number;
    atRisk: number;
    critical: number;
  };
}

export const KPICards: React.FC<KPICardsProps> = ({ stats }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Total Components */}
      <div className="glass-panel rounded-xl px-4 py-2 flex items-center gap-3 border border-white/10 bg-slate-900/65 backdrop-blur-xl shadow-lg min-w-[130px]">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
          <Component className="w-4 h-4" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-lg font-bold text-white leading-none">{stats.total}</span>
          <span className="text-[10px] text-slate-300 font-medium mt-0.5">Total Components</span>
        </div>
      </div>

      {/* Operational */}
      <div className="glass-panel rounded-xl px-4 py-2 flex items-center gap-3 border border-white/10 bg-slate-900/65 backdrop-blur-xl shadow-lg min-w-[130px]">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-lg font-bold text-white leading-none">{stats.operational}</span>
          <span className="text-[10px] text-slate-300 font-medium mt-0.5">Operational</span>
        </div>
      </div>

      {/* At Risk */}
      <div className="glass-panel rounded-xl px-4 py-2 flex items-center gap-3 border border-white/10 bg-slate-900/65 backdrop-blur-xl shadow-lg min-w-[130px]">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-lg font-bold text-white leading-none">{stats.atRisk}</span>
          <span className="text-[10px] text-slate-300 font-medium mt-0.5">At Risk</span>
        </div>
      </div>

      {/* Critical */}
      <div className="glass-panel rounded-xl px-4 py-2 flex items-center gap-3 border border-white/10 bg-slate-900/65 backdrop-blur-xl shadow-lg min-w-[130px]">
        <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400 shrink-0">
          <XCircle className="w-4 h-4" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-lg font-bold text-white leading-none">{stats.critical}</span>
          <span className="text-[10px] text-slate-300 font-medium mt-0.5">Critical</span>
        </div>
      </div>
    </div>
  );
};
