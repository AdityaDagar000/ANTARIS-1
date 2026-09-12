import React, { useState } from 'react';
import { Settings, Shield, Bell, Monitor, Database, Save } from 'lucide-react';

interface SettingsPageProps {
  mlStatus?: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ mlStatus = 'waiting' }) => {
  const [stationName, setStationName] = useState('Bharati Station');
  const [locationStr, setLocationStr] = useState('Antarctica, Indian Research Station');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalPush, setCriticalPush] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [saved, setSaved] = useState(false);

  const mlStatusLabel =
    mlStatus === 'connected' ? 'Connected' : mlStatus === 'unavailable' ? 'Unavailable' : 'Waiting';
  const mlStatusColor =
    mlStatus === 'connected'
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30'
      : mlStatus === 'unavailable'
      ? 'bg-red-500/20 text-red-400 border-red-400/30'
      : 'bg-amber-500/20 text-amber-400 border-amber-400/30';

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
      <div className="flex items-center justify-between">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">System Settings & Configuration</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Manage station operational parameters and backend connection status</p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-neonCyan transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? 'Settings Saved!' : 'Save Configuration'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Shield className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Station Identification</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Station Name</label>
              <input
                type="text"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Location</label>
              <input
                type="text"
                value={locationStr}
                onChange={(e) => setLocationStr(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Alerts & Notifications</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="font-semibold text-white">Critical Telemetry Push Alerts</span>
              <input type="checkbox" checked={criticalPush} onChange={(e) => setCriticalPush(e.target.checked)} className="w-4 h-4 accent-cyan-500 rounded cursor-pointer" />
            </div>
            <div className="flex items-center justify-between py-1 border-t border-white/5">
              <span className="font-semibold text-white">Daily Operations Email Digest</span>
              <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} className="w-4 h-4 accent-cyan-500 rounded cursor-pointer" />
            </div>
            <div className="flex items-center justify-between py-1 border-t border-white/5">
              <span className="font-semibold text-white">Backend Data Auto-Refresh</span>
              <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="w-4 h-4 accent-cyan-500 rounded cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Viewport & Visual System</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">UI Theme</span>
              <span className="font-mono text-emerald-400 font-bold">ANTARIS Mission Control Glassmorphism</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Backend & ML Connection</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">Backend API</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-400/30">
                ● localhost:4000
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">ML Prediction API</span>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${mlStatusColor}`}>
                ● {mlStatusLabel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">Energy Telemetry</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] border border-amber-400/30">
                Waiting for telemetry
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
