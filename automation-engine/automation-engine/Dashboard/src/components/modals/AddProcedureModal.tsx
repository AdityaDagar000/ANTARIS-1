import React, { useState } from 'react';
import { ProcedureItem } from '../../types';
import { X, PlusCircle } from 'lucide-react';

interface AddProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (procedure: ProcedureItem) => void;
}

export const AddProcedureModal: React.FC<AddProcedureModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Utilities');
  const [purpose, setPurpose] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [warningsText, setWarningsText] = useState('');
  const [owner, setOwner] = useState('Mark Vance');
  const [version, setVersion] = useState('v1.0');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `SOP-00${Math.floor(7 + Math.random() * 90)}`;
    const parsedSteps = stepsText.split('\n').filter((s) => s.trim().length > 0);
    const parsedPrereqs = prerequisites.split('\n').filter((s) => s.trim().length > 0);
    const parsedWarnings = warningsText.split('\n').filter((s) => s.trim().length > 0);

    onSave({
      id: newId,
      name: name || 'New Operational Procedure',
      category,
      version: version || 'v1.0',
      lastUpdated: 'Just now',
      status: 'Active',
      purpose: purpose || 'Standard operational procedure for Bharati Station.',
      prerequisites: parsedPrereqs.length > 0 ? parsedPrereqs : ['Verify system status nominal'],
      steps: parsedSteps.length > 0 ? parsedSteps : ['Initiate procedure check.', 'Verify safe state.'],
      warnings: parsedWarnings,
      owner,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 select-none">
      <div className="glass-panel-glow rounded-2xl w-full max-w-lg max-h-[85vh] p-5 bg-slate-900 border border-cyan-500/40 shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Add Standard Operational Procedure</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Procedure Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Fuel Line Emergency Flush"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Utilities">Utilities</option>
                <option value="Power">Power</option>
                <option value="Life Support">Life Support</option>
                <option value="Communications">Communications</option>
                <option value="Safety">Safety</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Owner / Author</label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Version Tag</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Operational Purpose</label>
            <textarea
              rows={2}
              placeholder="Describe the operational goal of this SOP..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Prerequisites (one per line)</label>
            <textarea
              rows={2}
              placeholder="e.g. Verify valve level 2&#10;Equip Class B protective suits"
              value={prerequisites}
              onChange={(e) => setPrerequisites(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Numbered Steps (one per line)</label>
            <textarea
              rows={4}
              placeholder="e.g. Confirm system alarm on console&#10;Isolate affected valve V-102&#10;Notify duty engineer"
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Safety Warnings (one per line)</label>
            <input
              type="text"
              placeholder="e.g. Residual pressure in coolant lines"
              value={warningsText}
              onChange={(e) => setWarningsText(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-neonCyan"
            >
              Save Procedure
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
