import React from 'react';
import { PersonnelItem } from '../../types';
import { X, User, Shield, Radio, Clock, MapPin } from 'lucide-react';

interface PersonnelDetailModalProps {
  personnel: PersonnelItem | null;
  onClose: () => void;
}

export const PersonnelDetailModal: React.FC<PersonnelDetailModalProps> = ({
  personnel,
  onClose,
}) => {
  if (!personnel) return null;

  let availBg = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
  if (personnel.availability === 'On Assignment') availBg = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
  if (personnel.availability === 'Unavailable') availBg = 'bg-red-500/20 text-red-400 border-red-500/40';
  if (personnel.availability === 'Off Shift') availBg = 'bg-slate-700/30 text-slate-400 border-slate-600/30';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 select-none">
      <div className="glass-panel-glow rounded-2xl w-full max-w-lg p-5 bg-slate-900 border border-cyan-500/40 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-bold text-sm">
              {personnel.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{personnel.name}</h3>
                <span className="text-xs font-mono font-bold text-cyan-400">{personnel.id}</span>
              </div>
              <span className="text-xs text-slate-300 font-medium">{personnel.role}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Details */}
        <div className="space-y-4 text-xs">
          {/* Status Badge */}
          <div className="flex items-center justify-between glass-card p-2.5 rounded-xl border border-white/5">
            <span className="text-slate-400 font-semibold">Availability Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${availBg}`}>
              {personnel.availability}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-3 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Current Assignment</span>
              </div>
              <p className="text-white font-bold text-xs pl-5">{personnel.assignment}</p>
            </div>

            <div className="glass-card p-3 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Active Shift</span>
              </div>
              <p className="text-white font-bold text-xs pl-5">{personnel.shift}</p>
            </div>
          </div>

          {/* Skills Tag Cloud */}
          <div className="glass-card p-3 rounded-xl border border-white/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Certified Specializations & Skills</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {personnel.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Contact & Activity */}
          <div className="glass-card p-3 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>Radio Comms:</span>
              </div>
              <span className="font-mono text-white font-bold">{personnel.contactStatus}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300 border-t border-white/5 pt-1.5">
              <div className="flex items-center gap-1.5 text-slate-400">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Console Activity:</span>
              </div>
              <span className="text-slate-300 font-medium">{personnel.lastActivity}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end mt-4 pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-neonCyan"
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
};
