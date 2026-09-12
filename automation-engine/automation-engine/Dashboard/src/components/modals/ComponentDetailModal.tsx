import React from 'react';
import { ComponentItem } from '../../types';
import { X, Boxes, Activity, Gauge, Thermometer, Droplets, Zap, Target } from 'lucide-react';
import { formatSensorStatus, getStatusBadgeClass } from '../../utils/componentStatus';

interface ComponentDetailModalProps {
  component: ComponentItem | null;
  onClose: () => void;
}

export const ComponentDetailModal: React.FC<ComponentDetailModalProps> = ({ component, onClose }) => {
  if (!component) return null;

  const telemetryRows = [
    { label: 'Active Sensor', value: component.telemetry.temperature, icon: Thermometer },
    { label: 'Sensor Status', value: component.telemetry.vibration, icon: Activity },
    { label: 'Predicted RUL', value: component.telemetry.flowRate, icon: Droplets },
    { label: 'Anomaly Count', value: component.telemetry.powerDraw, icon: Zap },
    { label: 'Pressure', value: component.telemetry.pressure, icon: Gauge },
    { label: 'System Health', value: component.telemetry.systemHealth, icon: Target },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 select-none">
      <div className="glass-panel-glow rounded-2xl w-full max-w-xl p-5 bg-slate-900 border border-cyan-500/40 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Boxes className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <h3 className="text-base font-bold text-white">{component.name}</h3>
              <span className="text-xs font-mono text-cyan-400">{component.id}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs mb-4">
          <div className="glass-card rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block mb-1">Asset ID</span>
            <span className="font-mono font-bold text-white">{component.assetId || '—'}</span>
          </div>
          <div className="glass-card rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block mb-1">Equipment Type</span>
            <span className="font-semibold text-white">{component.type}</span>
          </div>
          <div className="glass-card rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block mb-1">Location Module</span>
            <span className="font-semibold text-white">{component.module}</span>
          </div>
          <div className="glass-card rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block mb-1">Machine</span>
            <span className="font-semibold text-white">{component.machineName || '—'}</span>
          </div>
          <div className="glass-card rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block mb-1">ML State</span>
            <span className="font-mono font-bold text-cyan-300">
              {component.mlStateLabel || component.mlCurrentState || '—'}
            </span>
          </div>
          <div className="glass-card rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block mb-1">Operational Status</span>
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(component.status)}`}>
              {component.status}
            </span>
          </div>
          <div className="glass-card rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block mb-1">Sensor Status</span>
            <span className="font-semibold text-white">{formatSensorStatus(component.sensorStatus)}</span>
          </div>
          <div className="glass-card rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block mb-1">Health Index</span>
            <span className="font-mono font-bold text-white">{component.health.toFixed(2)}</span>
          </div>
        </div>

        {component.description && (
          <div className="mb-4 p-3 rounded-xl bg-slate-950/60 border border-white/10 text-left">
            <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider block mb-1">
              Status Message
            </span>
            <p className="text-slate-200 text-xs leading-relaxed">{component.description}</p>
          </div>
        )}

        <div className="rounded-xl border border-white/10 p-3">
          <span className="text-xs font-bold text-white block mb-3">ML Prediction Telemetry</span>
          <div className="space-y-2">
            {telemetryRows.map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.label} className="flex items-center justify-between text-xs py-0.5">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{row.label}</span>
                  </div>
                  <span className="font-mono font-bold text-white">{row.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-[10px] text-slate-400">
          <span>Room: {component.roomId || '—'}</span>
          <span>Last update: {component.lastUpdate}</span>
        </div>
      </div>
    </div>
  );
};
