import React, { useState } from 'react';
import { PolicyItem } from '../types';
import { FileCheck, Search, Filter, ArrowUpRight } from 'lucide-react';
import { PolicyDetailModal } from '../components/modals/PolicyDetailModal';

interface PoliciesPageProps {
  policies: PolicyItem[];
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ policies }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyItem | null>(null);

  const filtered = policies.filter((pol) => {
    const matchesSearch =
      pol.name.toLowerCase().includes(search.toLowerCase()) ||
      pol.id.toLowerCase().includes(search.toLowerCase()) ||
      pol.category.toLowerCase().includes(search.toLowerCase()) ||
      pol.owner.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || pol.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Station Governance & Policies</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Station policies, compliance requirements, environmental regulations, and operational governance rules</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search policies or POL ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-white/10">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 py-1 px-2 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Categories</option>
              <option value="Safety" className="bg-slate-900">Safety</option>
              <option value="Emergency" className="bg-slate-900">Emergency</option>
              <option value="Security" className="bg-slate-900">Security</option>
              <option value="Maintenance" className="bg-slate-900">Maintenance</option>
              <option value="Environmental" className="bg-slate-900">Environmental</option>
              <option value="Communications" className="bg-slate-900">Communications</option>
            </select>
          </div>
        </div>
      </div>

      {/* Policy Table */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 flex-1 flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-400 border-b border-white/10 font-semibold uppercase tracking-wider">
                <th className="py-3 px-2">Policy ID</th>
                <th className="py-3 px-2">Policy Title</th>
                <th className="py-3 px-2">Governance Category</th>
                <th className="py-3 px-2">Version</th>
                <th className="py-3 px-2">Effective Date</th>
                <th className="py-3 px-2">Governance Body</th>
                <th className="py-3 px-2">Compliance Status</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {filtered.map((pol) => (
                <tr key={pol.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 font-mono font-bold text-cyan-400">{pol.id}</td>
                  <td className="py-3 px-2 font-bold text-white">{pol.name}</td>
                  <td className="py-3 px-2 text-slate-300 font-medium">{pol.category}</td>
                  <td className="py-3 px-2 font-mono font-semibold text-cyan-300">{pol.version}</td>
                  <td className="py-3 px-2 text-slate-400">{pol.effectiveDate}</td>
                  <td className="py-3 px-2 text-slate-300">{pol.owner}</td>
                  <td className="py-3 px-2">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {pol.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => setSelectedPolicy(pol)}
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
      </div>

      {/* Policy Modal */}
      <PolicyDetailModal
        policy={selectedPolicy}
        onClose={() => setSelectedPolicy(null)}
      />
    </div>
  );
};
