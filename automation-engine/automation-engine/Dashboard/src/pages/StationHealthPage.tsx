import React, { useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { ComponentItem, DashboardSummary } from '../types';
import { api } from '../api';
import { usePolling } from '../hooks/usePolling';
import { EmptyState } from '../components/ui/EmptyState';

interface StationHealthPageProps {
  onViewComponent: (comp: ComponentItem) => void;
  summary: DashboardSummary;
}

export const StationHealthPage: React.FC<StationHealthPageProps> = ({ onViewComponent, summary }) => {
  const fetchComponents = useCallback(() => api.getComponents(), []);
  const fetchTrend = useCallback(() => api.getHealthTrend(), []);
  const { data: components } = usePolling(fetchComponents);
  const { data: trendData } = usePolling(fetchTrend);

  const total = summary.totalComponents;
  const operational = summary.operationalComponents;
  const atRisk = summary.earlyDegradationComponents + summary.degradationComponents;
  const critical = summary.faultComponents;
  const overallHealth = total > 0
    ? Math.round(((operational * 100 + atRisk * 60 + critical * 25) / total))
    : 0;

  const opPct = total > 0 ? Math.round((operational / total) * 100) : 0;
  const riskPct = total > 0 ? Math.round((atRisk / total) * 100) : 0;
  const critPct = total > 0 ? Math.round((critical / total) * 100) : 0;

  if (total === 0) {
    return (
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">Station Health Overview</h2>
        </div>
        <div className="glass-panel rounded-2xl border border-white/10">
          <EmptyState
            title="Waiting for ML predictions"
            description="Component health data will appear once predictions are received from the ML model."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
      <div className="flex items-center justify-between">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Station Health Overview</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Real-time health monitoring and subsystem diagnostics</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-emerald-400">{overallHealth}% Nominal Health</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 flex items-center justify-between border border-white/10">
          <div className="flex flex-col text-left">
            <span className="text-xs font-medium text-slate-400">Overall Gauge</span>
            <span className="text-2xl font-bold text-white mt-1">{overallHealth} / 100</span>
            <span className="text-[10px] text-emerald-400 font-semibold mt-1">From ML predictions</span>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.1)" strokeWidth="5" fill="none" />
              <circle cx="32" cy="32" r="26" stroke="#10B981" strokeWidth="5" fill="none" strokeDasharray="163" strokeDashoffset={163 - 163 * (overallHealth / 100)} strokeLinecap="round" />
            </svg>
            <span className="absolute text-sm font-bold text-white">{overallHealth}%</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3 border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-2xl font-bold text-white">{operational}</span>
            <span className="text-xs text-slate-400 font-medium">Operational Subsystems</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3 border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-2xl font-bold text-white">{atRisk}</span>
            <span className="text-xs text-slate-400 font-medium">At Risk Subsystems</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3 border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400 shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-2xl font-bold text-white">{critical}</span>
            <span className="text-xs text-slate-400 font-medium">Critical Attention</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 glass-panel rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-white">System Health Trend</span>
            {summary.lastPredictionTimestamp && (
              <span className="text-xs text-cyan-400 font-mono">
                Last updated {new Date(summary.lastPredictionTimestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} UTC
              </span>
            )}
          </div>
          {trendData && trendData.length > 0 ? (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="fullHealthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00A8FF" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00A8FF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0D1629', borderColor: '#00A8FF', color: '#fff', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="health" stroke="#00A8FF" strokeWidth={2} fillOpacity={1} fill="url(#fullHealthGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState title="Waiting for prediction history" description="Health trend chart will populate as ML predictions are recorded." />
          )}
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
          <span className="text-sm font-bold text-white mb-2">System Distribution</span>
          <div className="flex flex-col items-center justify-center my-2">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="42" stroke="#10B981" strokeWidth="8" fill="none" strokeDasharray="264" strokeDashoffset={264 - 264 * (opPct / 100)} />
                <circle cx="56" cy="56" r="42" stroke="#F59E0B" strokeWidth="8" fill="none" strokeDasharray="264" strokeDashoffset={264 - 264 * (riskPct / 100)} />
                <circle cx="56" cy="56" r="42" stroke="#EF4444" strokeWidth="8" fill="none" strokeDasharray="264" strokeDashoffset={264 - 264 * (critPct / 100)} />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-bold text-white">{total}</span>
                <span className="text-[9px] text-slate-400">Components</span>
              </div>
            </div>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Operational</span>
              </div>
              <span className="font-mono font-bold text-white">{operational} ({opPct}%)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>At Risk</span>
              </div>
              <span className="font-mono font-bold text-white">{atRisk} ({riskPct}%)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span>Critical</span>
              </div>
              <span className="font-mono font-bold text-white">{critical} ({critPct}%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-white">Component Health Diagnostics</span>
          <span className="text-xs text-slate-400">Total Monitored: {total}</span>
        </div>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="text-slate-400 border-b border-white/10 font-semibold">
              <th className="py-2">Component ID</th>
              <th className="py-2">Module Name</th>
              <th className="py-2">Category</th>
              <th className="py-2">Status</th>
              <th className="py-2">Health Index</th>
              <th className="py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {(components ?? []).map((comp) => (
              <tr key={comp.id} className="hover:bg-white/5 transition-colors">
                <td className="py-2 font-mono font-bold text-cyan-400">{comp.id}</td>
                <td className="py-2 font-semibold text-white">{comp.name}</td>
                <td className="py-2 text-slate-300">{comp.type}</td>
                <td className="py-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                    comp.status === 'Operational' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    comp.status === 'At Risk' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {comp.status}
                  </span>
                </td>
                <td className="py-2 font-mono font-bold">{comp.health.toFixed(2)}</td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => onViewComponent(comp)}
                    className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 text-xs font-semibold transition-colors"
                  >
                    View Diagnostics
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
