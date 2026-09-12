import React, { useState } from 'react';
import { PersonnelItem } from '../types';
import { Users, Search, Filter, ArrowUpRight } from 'lucide-react';
import { PersonnelDetailModal } from '../components/modals/PersonnelDetailModal';
import { EmptyState } from '../components/ui/EmptyState';

interface PersonnelPageProps {
  personnelList: PersonnelItem[];
}

export const PersonnelPage: React.FC<PersonnelPageProps> = ({ personnelList }) => {
  const [search, setSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedPersonnel, setSelectedPersonnel] = useState<PersonnelItem | null>(null);

  const filtered = personnelList.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(search.toLowerCase()) ||
      person.id.toLowerCase().includes(search.toLowerCase()) ||
      person.role.toLowerCase().includes(search.toLowerCase()) ||
      person.assignment.toLowerCase().includes(search.toLowerCase());

    const matchesAvailability =
      availabilityFilter === 'All' || person.availability === availabilityFilter;

    const matchesRole = roleFilter === 'All' || person.role === roleFilter;

    return matchesSearch && matchesAvailability && matchesRole;
  });

  const getStatusBadge = (avail: PersonnelItem['availability']) => {
    switch (avail) {
      case 'Available':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'On Assignment':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Unavailable':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Off Shift':
        return 'bg-slate-700/40 text-slate-400 border-slate-600/30';
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Personnel Roster</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Manage and monitor station personnel, duty availability, and assigned modules</p>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search personnel, role, assignment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-white/10">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 py-1 px-2 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Availability</option>
              <option value="Available" className="bg-slate-900">Available</option>
              <option value="On Assignment" className="bg-slate-900">On Assignment</option>
              <option value="Unavailable" className="bg-slate-900">Unavailable</option>
              <option value="Off Shift" className="bg-slate-900">Off Shift</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 flex-1 flex flex-col justify-between">
        {filtered.length === 0 ? (
          <EmptyState title="No personnel data" description="Personnel roster is loaded from station configuration." />
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-400 border-b border-white/10 font-semibold uppercase tracking-wider">
                <th className="py-3 px-2">Personnel ID</th>
                <th className="py-3 px-2">Full Name</th>
                <th className="py-3 px-2">Role</th>
                <th className="py-3 px-2">Specialized Skills</th>
                <th className="py-3 px-2">Availability</th>
                <th className="py-3 px-2">Current Assignment</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {filtered.map((person) => (
                <tr key={person.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 font-mono font-bold text-cyan-400">{person.id}</td>
                  <td className="py-3 px-2 font-bold text-white">{person.name}</td>
                  <td className="py-3 px-2 text-slate-300 font-medium">{person.role}</td>
                  <td className="py-3 px-2 text-slate-400">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {person.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(person.availability)}`}>
                      {person.availability}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-200 font-semibold">{person.assignment}</td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => setSelectedPersonnel(person)}
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

      {/* Detail Modal */}
      <PersonnelDetailModal
        personnel={selectedPersonnel}
        onClose={() => setSelectedPersonnel(null)}
      />
    </div>
  );
};
