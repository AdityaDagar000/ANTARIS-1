import React, { useState } from 'react';
import { TicketItem, ComponentItem } from '../../types';
import { X, PlusCircle } from 'lucide-react';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: {
    componentId: string;
    priority: TicketItem['priority'];
    assignedTo?: string;
  }) => Promise<void>;
  components: ComponentItem[];
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  components,
}) => {
  const [componentId, setComponentId] = useState('');
  const [priority, setPriority] = useState<TicketItem['priority']>('High');
  const [assignedTo, setAssignedTo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!componentId) return;
    setSubmitting(true);
    try {
      await onCreate({ componentId, priority, assignedTo: assignedTo || undefined });
      setComponentId('');
      setAssignedTo('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 select-none">
      <div className="glass-panel-glow rounded-2xl w-full max-w-md p-5 bg-slate-900 border border-cyan-500/40 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Create Maintenance Ticket</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Component</label>
            <select
              value={componentId}
              onChange={(e) => setComponentId(e.target.value)}
              required
              className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="">Select component...</option>
              {components.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.name}
                </option>
              ))}
            </select>
            {components.length === 0 && (
              <p className="text-[10px] text-amber-400 mt-1">No components available. Waiting for ML predictions.</p>
            )}
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketItem['priority'])}
              className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Assigned Specialist (optional)</label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Leave blank for automation assignment"
              className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-medium">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !componentId}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-neonCyan disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
