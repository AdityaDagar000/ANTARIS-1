import React from 'react';
import { ComponentItem } from '../../types';
import { Thermometer, Gauge, Droplets, Zap, Activity, Target } from 'lucide-react';

interface LiveSensorPanelProps {
  telemetry: ComponentItem['telemetry'];
}

export const LiveSensorPanel: React.FC<LiveSensorPanelProps> = ({ telemetry }) => {
  const sensorRows = [
    { label: 'Temperature', value: telemetry.temperature, icon: Thermometer },
    { label: 'Pressure', value: telemetry.pressure, icon: Gauge },
    { label: 'Flow Rate', value: telemetry.flowRate, icon: Droplets },
    { label: 'Power Draw', value: telemetry.powerDraw, icon: Zap },
    { label: 'Vibration', value: telemetry.vibration, icon: Activity },
    { label: 'System Health', value: telemetry.systemHealth, icon: Target },
  ];

  return (
    <div className="glass-panel rounded-2xl p-4 w-[245px] bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <span className="text-xs font-bold text-white tracking-wide">Live Sensor Data</span>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-semibold text-emerald-400">Live</span>
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-2.5">
        {sensorRows.map((row, idx) => {
          const Icon = row.icon;
          return (
            <div key={idx} className="flex items-center justify-between text-xs py-0.5">
              <div className="flex items-center gap-2.5 text-slate-300">
                <div className="w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-3 h-3 text-cyan-400" />
                </div>
                <span className="text-[11px] font-medium text-slate-300">{row.label}</span>
              </div>
              <span className="font-mono text-xs font-bold text-white tracking-tight">{row.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
