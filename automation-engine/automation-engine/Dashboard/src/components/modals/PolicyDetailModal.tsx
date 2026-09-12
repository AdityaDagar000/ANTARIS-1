import React from 'react';
import { PolicyItem } from '../../types';
import { X, FileCheck, Shield, Calendar, Building, CheckSquare } from 'lucide-react';

interface PolicyDetailModalProps {
  policy: PolicyItem | null;
  onClose: () => void;
}

export const PolicyDetailModal: React.FC<PolicyDetailModalProps> = ({
  policy,
  onClose,
}) => {
  if (!policy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 select-none">
      <div className="glass-panel-glow rounded-2xl w-full max-w-xl max-h-[85vh] p-5 bg-slate-900 border border-cyan-500/40 shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">{policy.id}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {policy.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-white leading-tight mt-0.5">{policy.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Policy Document Body */}
        <div className="space-y-4 text-xs">
          {/* Metadata */}
          <div className="grid grid-cols-3 gap-2 glass-card p-3 rounded-xl border border-white/5">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Building className="w-3 h-3 text-cyan-400" />
                <span>Governance Body</span>
              </span>
              <span className="font-bold text-white truncate mt-0.5">{policy.owner}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-cyan-400" />
                <span>Effective Date</span>
              </span>
              <span className="font-bold text-white mt-0.5">{policy.effectiveDate}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Shield className="w-3 h-3 text-cyan-400" />
                <span>Version</span>
              </span>
              <span className="font-mono font-bold text-cyan-400 mt-0.5">{policy.version}</span>
            </div>
          </div>

          {/* Purpose & Scope */}
          <div className="glass-card p-3 rounded-xl border border-white/5 space-y-2">
            <div>
              <span className="text-cyan-400 font-bold block mb-0.5">Policy Purpose</span>
              <p className="text-slate-200 leading-relaxed">{policy.purpose}</p>
            </div>
            <div className="border-t border-white/5 pt-2">
              <span className="text-slate-400 font-semibold block mb-0.5">Operational Scope</span>
              <p className="text-slate-300">{policy.scope}</p>
            </div>
          </div>

          {/* Mandatory Rules / Requirements */}
          <div className="space-y-2">
            <span className="text-white font-bold text-xs block flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <span>Mandatory Policy Requirements & Compliance Rules</span>
            </span>
            <div className="space-y-2">
              {policy.requirements.map((req, idx) => (
                <div key={idx} className="glass-card p-3 rounded-xl border border-white/5 bg-slate-950/40 text-slate-200 leading-relaxed font-medium">
                  {req}
                </div>
              ))}
            </div>
          </div>

          {/* Audit Timestamps */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/10">
            <span>Last Audit Review: <strong className="text-slate-200">{policy.lastReviewed}</strong></span>
            <span>Scheduled Next Review: <strong className="text-cyan-400">{policy.nextReview}</strong></span>
          </div>
        </div>

        {/* Modal Action */}
        <div className="flex items-center justify-end mt-4 pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-neonCyan"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
