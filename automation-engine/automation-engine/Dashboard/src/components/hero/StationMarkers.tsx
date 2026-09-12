import React from 'react';
import { ComponentItem } from '../../types';
import { Zap, Home, FlaskConical, Trash2, Droplets, Radio } from 'lucide-react';

interface StationMarkersProps {
  components: ComponentItem[];
  selectedComponent: ComponentItem;
  onSelectComponent: (component: ComponentItem) => void;
}

const getIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('pump') || t.includes('water') || t.includes('membrane') || t.includes('filter')) return Droplets;
  if (t.includes('generator') || t.includes('engine') || t.includes('fuel') || t.includes('power')) return Zap;
  if (t.includes('cooling') || t.includes('heating') || t.includes('hvac')) return FlaskConical;
  if (t.includes('motor') || t.includes('bearing') || t.includes('drive') || t.includes('gearbox')) return Trash2;
  if (t.includes('communication') || t.includes('storage') || t.includes('server')) return Radio;
  return Home;
};

export const StationMarkers: React.FC<StationMarkersProps> = ({
  components,
  selectedComponent,
  onSelectComponent,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {components.map((comp) => {
        const Icon = getIcon(comp.type);
        const isSelected = selectedComponent.id === comp.id;
        const pos = comp.markerPos;

        let statusBg = 'bg-emerald-500';
        let statusText = 'text-emerald-400';
        let borderGlow = 'border-white/10 hover:border-emerald-400/50';

        if (comp.status === 'Early Degradation') {
          statusBg = 'bg-blue-500';
          statusText = 'text-blue-400';
          borderGlow = 'border-white/10 hover:border-blue-400/50';
        } else if (comp.status === 'At Risk') {
          statusBg = 'bg-amber-500';
          statusText = 'text-amber-400';
          borderGlow = 'border-white/10 hover:border-amber-400/50';
        } else if (comp.status === 'Critical') {
          statusBg = 'bg-red-500';
          statusText = 'text-red-400';
          borderGlow = 'border-red-500/50 shadow-neonRed';
        }

        if (isSelected) {
          borderGlow = 'border-cyan-400 shadow-neonCyan bg-slate-900/90';
        }

        return (
          <div
            key={comp.id}
            style={{ top: pos.top, left: pos.left }}
            onClick={() => onSelectComponent(comp)}
            className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-105`}
          >
            <div
              className={`glass-panel rounded-xl px-2.5 py-1.5 flex items-center gap-2 border ${borderGlow} bg-slate-900/80 backdrop-blur-md shadow-xl`}
            >
              <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-slate-200 shrink-0">
                <Icon className="w-3 h-3 text-cyan-400" />
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[11px] font-bold text-white tracking-wide">
                  {comp.name}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusBg}`} />
                  <span className={`text-[9px] font-semibold ${statusText}`}>
                    {comp.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
