import React, { useState } from 'react';
import { ProcedureItem } from '../types';
import { ClipboardList, Search, Filter, ArrowUpRight } from 'lucide-react';
import { ProcedureDetailModal } from '../components/modals/ProcedureDetailModal';
import { EmptyState } from '../components/ui/EmptyState';

interface StandardProceduresPageProps {
  procedures: ProcedureItem[];
}

export const StandardProceduresPage: React.FC<StandardProceduresPageProps> = ({ procedures }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureItem | null>(null);

  const categories = [...new Set(procedures.map((p) => p.category))];

  const filtered = procedures.filter((proc) => {
    const matchesSearch =
      proc.name.toLowerCase().includes(search.toLowerCase()) ||
      proc.id.toLowerCase().includes(search.toLowerCase()) ||
      proc.category.toLowerCase().includes(search.toLowerCase()) ||
      proc.owner.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || proc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
      <div className="flex items-center justify-between">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Standard Operating Procedures</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Configuration-driven operational procedures and automation policies</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search procedures or SOP ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-white/10">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 py-1 px-2 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5 border border-white/10 flex-1 flex flex-col justify-between">
        {filtered.length === 0 ? (
          <EmptyState
            title="No procedures configured"
            description="Standard operating procedures are loaded from backend configuration."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-2">Procedure ID</th>
                  <th className="py-3 px-2">Procedure Name</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Version</th>
                  <th className="py-3 px-2">Policy</th>
                  <th className="py-3 px-2">Author / Owner</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {filtered.map((proc) => (
                  <tr key={proc.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 font-mono font-bold text-cyan-400">{proc.id}</td>
                    <td className="py-3 px-2 font-bold text-white">{proc.name}</td>
                    <td className="py-3 px-2 text-slate-300 font-medium">{proc.category}</td>
                    <td className="py-3 px-2 font-mono font-semibold text-cyan-300">{proc.version}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        proc.automationPolicy === 'WHITELIST' ? 'bg-emerald-500/20 text-emerald-400' :
                        proc.automationPolicy === 'GREYLIST' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {proc.automationPolicy || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-300">{proc.owner}</td>
                    <td className="py-3 px-2">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {proc.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => setSelectedProcedure(proc)}
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

      <ProcedureDetailModal procedure={selectedProcedure} onClose={() => setSelectedProcedure(null)} />
    </div>
  );
};
