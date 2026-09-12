import React from 'react';
import { Search, Bell, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useClock } from '../../hooks/useClock';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSettingsClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm, onSettingsClick }) => {
  const { timeStr, dateStr } = useClock();

  return (
    <header className="w-full flex items-center justify-between gap-4 py-2 px-4 z-20">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search components, tickets, or systems..."
          className="w-full bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            className="relative p-1.5 rounded-lg bg-slate-900/60 border border-white/10 hover:bg-slate-800/60 text-slate-300 transition-colors"
            title="View automation alerts"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            onClick={onSettingsClick}
            className="p-1.5 rounded-lg bg-slate-900/60 border border-white/10 hover:bg-slate-800/60 text-slate-300 transition-colors"
            title="Open settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-900/60 border border-white/10 hover:bg-slate-800/60 cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-slate-700 border border-cyan-500/40 flex items-center justify-center text-xs font-bold text-cyan-400">
            MV
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-white leading-tight">Mark Vance</span>
            <span className="text-[10px] text-slate-400 leading-tight">Operations Engineer</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </div>

        <div className="flex flex-col text-right pl-2 border-l border-white/10">
          <span className="text-xs font-mono font-bold text-white tracking-wide">{timeStr}</span>
          <span className="text-[10px] text-slate-400 font-medium">{dateStr}</span>
        </div>
      </div>
    </header>
  );
};
