import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  AlertTriangle, 
  Boxes, 
  Layers,
  Users,
  Ticket, 
  ClipboardList,
  Zap, 
  FileCheck,
  Settings,
  Sun,
  Wind
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Digital Twin', label: 'Digital Twin', icon: Layers },
    { id: 'Station Health', label: 'Station Health', icon: Activity },
    { id: 'Faulty Components', label: 'Faulty Components', icon: AlertTriangle },
    { id: 'Components', label: 'Components', icon: Boxes },
    { id: 'Personnel', label: 'Personnel', icon: Users },
    { id: 'Tickets', label: 'Tickets', icon: Ticket },
    { id: 'Standard Procedures', label: 'Standard Procedures', icon: ClipboardList },
    { id: 'Automation', label: 'Automation', icon: Zap },
    { id: 'Policies', label: 'Policies', icon: FileCheck },
    { id: 'Settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-[165px] min-w-[165px] h-full flex flex-col justify-between glass-panel border-r border-white/10 rounded-2xl p-2.5 z-30 select-none overflow-y-auto">
      <div className="flex flex-col mb-3 pt-1 px-1 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-neonCyan">
            <span className="text-white font-bold text-sm tracking-wider">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-wide leading-none">Antaris</span>
            <span className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">Bharati Station</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 my-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/25 to-blue-600/30 text-white border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="truncate text-left leading-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto shrink-0 glass-card rounded-xl p-2 flex flex-col gap-1 border border-white/10 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white leading-tight">-12°C</span>
            <span className="text-[9px] text-slate-400 leading-tight">Clear</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 pt-1 border-t border-white/5 text-[9px] text-slate-400">
          <Wind className="w-3 h-3 text-slate-400 shrink-0" />
          <span>Wind 12 km/h</span>
        </div>
      </div>
    </aside>
  );
};
