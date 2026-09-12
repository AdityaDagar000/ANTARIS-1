import React from 'react';
import { ComponentItem } from '../../types';

interface SelectedCardProps {
  component: ComponentItem;
}

export const SelectedCard: React.FC<SelectedCardProps> = ({ component }) => {
  return (
    <div className="absolute left-6 bottom-4 z-30 max-w-[340px] w-full">
      <div className="glass-panel-glow rounded-2xl p-3 flex items-center gap-3 bg-slate-900/85 backdrop-blur-xl border border-cyan-500/30 shadow-2xl">
        {/* Component Thumbnail */}
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-cyan-500/30 shrink-0 bg-slate-800 flex items-center justify-center">
          <img
            src={component.thumbnail}
            alt={component.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Info & Description */}
        <div className="flex flex-col text-left overflow-hidden">
          <span className="text-sm font-bold text-white leading-tight truncate">
            {component.name}
          </span>
          <span className="text-[10px] font-semibold text-cyan-400 mt-0.5 tracking-wide">
            {component.module}
          </span>
          <p className="text-[11px] text-slate-300 font-normal leading-tight mt-1 line-clamp-2">
            {component.description}
          </p>
        </div>
      </div>
    </div>
  );
};
