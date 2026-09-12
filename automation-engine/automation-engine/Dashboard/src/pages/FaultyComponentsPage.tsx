import React, { useCallback, useState } from 'react';
import { AlertTriangle, ArrowUpRight } from 'lucide-react';
import { ComponentItem } from '../types';
import { api } from '../api';
import { usePolling } from '../hooks/usePolling';
import { EmptyState } from '../components/ui/EmptyState';

interface FaultyComponentsPageProps {
  onViewComponent: (comp: ComponentItem) => void;
}

export const FaultyComponentsPage: React.FC<FaultyComponentsPageProps> = ({ onViewComponent }) => {
  const [filter, setFilter] = useState<'All' | 'Critical' | 'At Risk'>('All');
  const fetchFaulty = useCallback(() => api.getFaultyComponents(), []);
  const { data: faultyList } = usePolling(fetchFaulty);

  const items = faultyList ?? [];
  const criticalCount = items.filter((i) => i.status === 'Critical').length;
  const atRiskCount = items.filter((i) => i.status === 'At Risk').length;

  const filtered = items.filter((item) => {
    if (filter === 'Critical') return item.status === 'Critical';
    if (filter === 'At Risk') return item.status === 'At Risk';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
      <div className="flex items-center justify-between">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Faulty Components</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Station components requiring engineering attention and maintenance</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/10">
          {(['All', 'Critical', 'At Risk'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neonCyan'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {f} {f === 'All' ? `(${items.length})` : f === 'Critical' ? `(${criticalCount})` : `(${atRiskCount})`}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5 border border-white/10 flex-1 flex flex-col justify-between">
        {filtered.length === 0 ? (
          <EmptyState
            title="No active faults detected"
            description="All monitored components are within acceptable health parameters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-2">Component ID</th>
                  <th className="py-3 px-2">Module Name</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Health Score</th>
                  <th className="py-3 px-2">Primary Symptom / Alert</th>
                  <th className="py-3 px-2">Last Update</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 font-mono font-bold text-cyan-400">{item.id}</td>
                    <td className="py-3 px-2 font-semibold text-white">{item.module}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.status === 'Critical'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{item.health.toFixed(2)}</span>
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.health < 0.5 ? 'bg-red-500' : 'bg-amber-500'}`}
                            style={{ width: `${item.health * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-300 font-medium">{item.description}</td>
                    <td className="py-3 px-2 text-slate-400">{item.lastUpdate}</td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => onViewComponent(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 text-xs font-bold transition-all border border-cyan-400/30"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
