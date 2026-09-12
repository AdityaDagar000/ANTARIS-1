import React, { useState } from 'react';
import { MiniSidebar } from './MiniSidebar';
import { TicketItem } from '../../types';
import { Plus } from 'lucide-react';

interface TicketsCardProps {
  tickets: TicketItem[];
  onOpenCreateModal: () => void;
}

export const TicketsCard: React.FC<TicketsCardProps> = ({ tickets, onOpenCreateModal }) => {
  const [activeTab, setActiveTab] = useState<'Open' | 'In Progress' | 'Resolved'>('Open');

  const filteredTickets = tickets.filter((t) => {
    if (activeTab === 'Open') return t.status === 'Open' || t.status === 'In Progress';
    return t.status === activeTab;
  });

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex h-[260px] border border-white/10 shadow-xl bg-slate-900/80 backdrop-blur-md">
      <MiniSidebar activeItem="Tickets" />

      <div className="flex-1 p-2.5 flex flex-col justify-between overflow-hidden">
        {/* Header & Actions */}
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
          <div className="flex flex-col text-left">
            <h3 className="text-xs font-bold text-white leading-none">Tickets</h3>
            <span className="text-[9px] text-slate-400 mt-0.5">Manage and track maintenance tickets</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Tabs */}
            <div className="flex items-center gap-0.5 bg-slate-950/60 p-0.5 rounded border border-white/10">
              <button
                onClick={() => setActiveTab('Open')}
                className={`px-1.5 py-0.5 rounded text-[8px] font-semibold transition-colors ${
                  activeTab === 'Open' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Open ({tickets.filter((t) => t.status === 'Open').length})
              </button>
              <button
                onClick={() => setActiveTab('In Progress')}
                className={`px-1.5 py-0.5 rounded text-[8px] font-semibold transition-colors ${
                  activeTab === 'In Progress' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                In Progress ({tickets.filter((t) => t.status === 'In Progress').length})
              </button>
            </div>

            {/* Create Ticket Button */}
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500 hover:bg-cyan-400 text-white text-[8px] font-bold shadow-neonCyan transition-all"
            >
              <Plus className="w-2.5 h-2.5" />
              <span>Create Ticket</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto mt-1 pr-0.5">
          <table className="w-full text-left text-[9px] border-collapse">
            <thead>
              <tr className="text-slate-400 border-b border-white/10 font-semibold">
                <th className="py-1">ID</th>
                <th className="py-1">Component</th>
                <th className="py-1">Priority</th>
                <th className="py-1">Status</th>
                <th className="py-1">Assigned To</th>
                <th className="py-1">Created</th>
                <th className="py-1 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-1 font-mono font-bold text-cyan-400">{t.id}</td>
                  <td className="py-1 font-semibold text-white">{t.componentId}</td>
                  <td className="py-1">
                    <span
                      className={`inline-block px-1 py-0.2 rounded text-[8px] font-bold ${
                        t.priority === 'Critical'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : t.priority === 'High'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-1 text-slate-300">{t.status}</td>
                  <td className="py-1 text-slate-300">{t.assignedTo}</td>
                  <td className="py-1 text-slate-400">{t.created}</td>
                  <td className="py-1 text-right">
                    <button className="px-1.5 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 text-[8px] font-semibold transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
