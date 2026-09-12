import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  AlertTriangle, 
  Boxes, 
  Ticket, 
  Zap, 
  BarChart3, 
  Settings 
} from 'lucide-react';

interface MiniSidebarProps {
  activeItem: string;
}

export const MiniSidebar: React.FC<MiniSidebarProps> = ({ activeItem }) => {
  const icons = [
    { id: 'Dashboard', icon: LayoutDashboard },
    { id: 'Station Health', icon: Activity },
    { id: 'Faulty Components', icon: AlertTriangle },
    { id: 'Components', icon: Boxes },
    { id: 'Tickets', icon: Ticket },
    { id: 'Automation', icon: Zap },
    { id: 'Reports', icon: BarChart3 },
    { id: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-8 shrink-0 h-full bg-slate-950/80 border-r border-white/10 flex flex-col items-center py-2 gap-2 select-none">
      {/* Mini Logo */}
      <div className="w-4 h-4 rounded bg-cyan-500 flex items-center justify-center text-[9px] font-bold text-white mb-1">
        A
      </div>
      {/* Mini Nav Icons */}
      <div className="flex flex-col gap-1.5 w-full items-center">
        {icons.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeItem;
          return (
            <div
              key={item.id}
              className={`p-1 rounded transition-colors ${
                isActive
                  ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-400/40'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-2.5 h-2.5" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
