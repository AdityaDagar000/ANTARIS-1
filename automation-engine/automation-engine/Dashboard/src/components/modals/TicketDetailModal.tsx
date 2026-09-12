import React from 'react';
import { TicketItem } from '../../types';
import { X, Ticket } from 'lucide-react';

interface TicketDetailModalProps {
  ticket: TicketItem | null;
  onClose: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticket, onClose }) => {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 select-none">
      <div className="glass-panel-glow rounded-2xl w-full max-w-lg p-5 bg-slate-900 border border-cyan-500/40 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Ticket {ticket.id}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400">Component</span>
              <p className="text-white font-semibold">{ticket.componentName || ticket.componentId}</p>
            </div>
            <div>
              <span className="text-slate-400">Priority</span>
              <p className="text-white font-semibold">{ticket.priority}</p>
            </div>
            <div>
              <span className="text-slate-400">Status</span>
              <p className="text-white font-semibold">{ticket.status}</p>
            </div>
            <div>
              <span className="text-slate-400">Assigned To</span>
              <p className="text-white font-semibold">{ticket.assignedTo}</p>
            </div>
          </div>

          {ticket.timeline && ticket.timeline.length > 0 && (
            <div className="pt-3 border-t border-white/10">
              <span className="text-slate-400 font-semibold">Timeline</span>
              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                {ticket.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-2 text-left">
                    <span className="text-cyan-400 font-mono text-[10px] shrink-0">
                      {event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : '—'}
                    </span>
                    <span className="text-slate-300">{event.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
