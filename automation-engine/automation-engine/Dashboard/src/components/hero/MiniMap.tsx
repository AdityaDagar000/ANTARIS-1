import React from 'react';
import { ComponentItem } from '../../types';

interface MiniMapProps {
  selectedComponent: ComponentItem;
}

export const MiniMap: React.FC<MiniMapProps> = ({ selectedComponent }) => {
  const blocks = [
    { id: 'PH-01', compId: 'GEN-02', x: 25, y: 30, w: 28, h: 20 },
    { id: 'HM-04', compId: 'ACU-01', x: 58, y: 22, w: 32, h: 22 },
    { id: 'RL-02', compId: 'HVAC-03', x: 95, y: 28, w: 30, h: 24 },
    { id: 'WM-01', compId: 'WM-01', x: 130, y: 38, w: 24, h: 18 },
    { id: 'WT-01', compId: 'WT-01', x: 65, y: 52, w: 30, h: 22 },
    { id: 'CM-01', compId: 'COM-01', x: 110, y: 60, w: 26, h: 18 },
  ];

  return (
    <div className="glass-panel rounded-2xl p-3 w-[245px] h-[130px] bg-slate-900/85 backdrop-blur-xl border border-white/10 flex flex-col justify-between shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-white/10">
        <span className="text-[11px] font-bold text-white tracking-wide">Station Overview</span>
        <span className="text-[8px] font-mono text-cyan-400 font-bold">SCHEMATIC v2.4</span>
      </div>

      {/* Grid Canvas SVG */}
      <div className="relative flex-1 w-full mt-1 bg-slate-950/80 rounded-lg overflow-hidden border border-cyan-900/40">
        {/* Technical Blueprint Grid Lines */}
        <svg className="absolute inset-0 w-full h-full text-cyan-500/15 pointer-events-none">
          <defs>
            <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />
          {/* Blueprint Connection Lines */}
          <path
            d="M 53 40 L 65 63 M 88 44 L 95 38 M 125 48 L 123 60"
            stroke="#00A8FF"
            strokeWidth="1"
            strokeDasharray="2,2"
            opacity="0.5"
          />
        </svg>

        {/* Render Blueprint Container Modules */}
        <div className="relative w-full h-full">
          {blocks.map((block) => {
            const isHighlighted = selectedComponent.id === block.compId;
            return (
              <div
                key={block.id}
                style={{
                  left: `${block.x}px`,
                  top: `${block.y}px`,
                  width: `${block.w}px`,
                  height: `${block.h}px`,
                }}
                className={`absolute rounded transition-all duration-300 flex items-center justify-center ${
                  isHighlighted
                    ? 'bg-red-500/80 border border-red-400 shadow-neonRed z-10 animate-pulse'
                    : 'bg-cyan-950/60 border border-cyan-500/30 text-cyan-300/70'
                }`}
              >
                <span className="text-[7px] font-mono font-bold leading-none select-none">
                  {block.id}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
