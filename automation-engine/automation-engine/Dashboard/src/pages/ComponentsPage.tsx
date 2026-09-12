import React, { useCallback, useState } from 'react';
import { Boxes, Search, Filter, ArrowUpRight } from 'lucide-react';
import { ComponentItem } from '../types';
import { api } from '../api';
import { usePolling } from '../hooks/usePolling';
import { EmptyState } from '../components/ui/EmptyState';
import { formatSensorStatus, getStatusBadgeClass } from '../utils/componentStatus';

interface ComponentsPageProps {
  onViewComponent: (comp: ComponentItem) => void;
  searchTerm?: string;
}

export const ComponentsPage: React.FC<ComponentsPageProps> = ({ onViewComponent, searchTerm = '' }) => {
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const fetchComponents = useCallback(() => api.getComponents(), []);
  const { data: allComponents } = usePolling(fetchComponents);

  const search = searchTerm || localSearch;

  const filtered = (allComponents ?? []).filter((comp) => {
    const matchesSearch =
      comp.id.toLowerCase().includes(search.toLowerCase()) ||
      comp.name.toLowerCase().includes(search.toLowerCase()) ||
      comp.module.toLowerCase().includes(search.toLowerCase()) ||
      comp.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || comp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
      <div className="flex items-center justify-between">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Components Inventory</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Live component status from latest ML prediction poll</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search components or modules..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-white/10">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 py-1 px-2 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Statuses</option>
              <option value="Operational" className="bg-slate-900">Operational</option>
              <option value="Early Degradation" className="bg-slate-900">Early Degradation</option>
              <option value="At Risk" className="bg-slate-900">At Risk</option>
              <option value="Critical" className="bg-slate-900">Critical</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5 border border-white/10 flex-1 flex flex-col justify-between">
        {filtered.length === 0 ? (
          <EmptyState
            title="Waiting for ML predictions"
            description="Component inventory will populate once the backend receives prediction data."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-2">Component ID</th>
                  <th className="py-3 px-2">Location Module</th>
                  <th className="py-3 px-2">Equipment Type</th>
                  <th className="py-3 px-2">ML State</th>
                  <th className="py-3 px-2">Operational Status</th>
                  <th className="py-3 px-2">Sensor</th>
                  <th className="py-3 px-2">Health Index</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {filtered.map((comp) => (
                  <tr key={comp.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 font-mono font-bold text-cyan-400">{comp.id}</td>
                    <td className="py-3 px-2 font-semibold text-white">{comp.module}</td>
                    <td className="py-3 px-2 text-slate-300">{comp.type}</td>
                    <td className="py-3 px-2 font-mono text-slate-300">{comp.mlStateLabel || comp.mlCurrentState || '—'}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(comp.status)}`}>
                        {comp.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-300">{formatSensorStatus(comp.sensorStatus)}</td>
                    <td className="py-3 px-2 font-mono font-bold">{comp.health.toFixed(2)}</td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => onViewComponent(comp)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 text-xs font-bold transition-all border border-cyan-400/30"
                      >
                        <span>Inspect</span>
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
