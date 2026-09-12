import React from 'react';
import { ProcedureItem } from '../../types';
import { X, ClipboardList, AlertTriangle, CheckCircle, User } from 'lucide-react';

interface ProcedureDetailModalProps {
  procedure: ProcedureItem | null;
  onClose: () => void;
}

export const ProcedureDetailModal: React.FC<ProcedureDetailModalProps> = ({
  procedure,
  onClose,
}) => {
  if (!procedure) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 select-none">
      <div className="glass-panel-glow rounded-2xl w-full max-w-xl max-h-[85vh] p-5 bg-slate-900 border border-cyan-500/40 shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">{procedure.id}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {procedure.version}
                </span>
              </div>
              <h3 className="text-base font-bold text-white leading-tight mt-0.5">{procedure.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-xs">
          {/* Metadata Bar */}
          <div className="grid grid-cols-3 gap-2 glass-card p-2.5 rounded-xl border border-white/5">
            <div>
              <span className="text-slate-400 text-[10px] block">Category</span>
              <span className="font-bold text-white">{procedure.category}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Author / Owner</span>
              <span className="font-bold text-white">{procedure.owner}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Last Updated</span>
              <span className="font-bold text-white">{procedure.lastUpdated}</span>
            </div>
          </div>

          {/* Purpose */}
          <div className="glass-card p-3 rounded-xl border border-white/5 space-y-1">
            <span className="text-cyan-400 font-bold block">Operational Purpose</span>
            <p className="text-slate-200 leading-relaxed">{procedure.purpose}</p>
          </div>

          {/* Safety Warnings */}
          {procedure.warnings && procedure.warnings.length > 0 && (
            <div className="glass-card p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Critical Safety Notes & Hazards</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-amber-200 pl-1">
                {procedure.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Prerequisites */}
          <div className="glass-card p-3 rounded-xl border border-white/5 space-y-1">
            <span className="text-slate-300 font-bold block">Mandatory Prerequisites</span>
            <ul className="space-y-1 text-slate-300">
              {procedure.prerequisites.map((req, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Numbered Steps */}
          <div className="space-y-2">
            <span className="text-white font-bold text-xs block">Operational Response Steps</span>
            <div className="space-y-2">
              {procedure.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 glass-card p-2.5 rounded-xl border border-white/5">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-slate-200 font-medium leading-normal pt-0.5">
                    {typeof step === 'string' ? step : step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center justify-end mt-4 pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-neonCyan"
          >
            Close Procedure
          </button>
        </div>
      </div>
    </div>
  );
};
