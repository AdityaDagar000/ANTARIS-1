import React, { useCallback } from 'react';
import { Zap, RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../api';
import { usePolling } from '../hooks/usePolling';
import { EmptyState } from '../components/ui/EmptyState';
import type { AutomationEvent } from '../types';

const EVENT_LABELS: Record<string, string> = {
  PREDICTION_RECEIVED: 'ML Prediction Received',
  FAULT_DETECTED: 'Fault Detected',
  TICKET_CREATED: 'Ticket Created',
  PROCEDURE_SELECTED: 'SOP Selected',
  POLICY_EVALUATED: 'Policy Evaluated',
  ACTUATOR_COMMAND: 'Automation Executed',
  PERSONNEL_ASSIGNED: 'Personnel Assigned',
  ESCALATED: 'Escalation',
  RECOVERY_DETECTED: 'Recovery Detected',
  TICKET_CLOSED: 'Ticket Closed',
  ML_POLL_ERROR: 'ML Poll Error',
  ENERGY_OPTIMIZED: 'Energy Optimized',
};

function formatEventTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export const AutomationPage: React.FC = () => {
  const fetchAutomation = useCallback(() => api.getAutomation(), []);
  const { data: automation } = usePolling(fetchAutomation);

  const events = automation?.events ?? [];
  const metrics = automation?.metrics;

  const lastEventTime = metrics?.lastEvent ? formatEventTime(metrics.lastEvent) : '—';
  const successRate =
    metrics && metrics.totalEvents > 0
      ? Math.round(((metrics.totalEvents - events.filter((e) => e.type === 'ML_POLL_ERROR').length) / metrics.totalEvents) * 100)
      : 0;

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
      <div className="flex items-center justify-between">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Automation Engine</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Event history from ML polls, policy evaluation, and actuator commands. Component pages show the latest ML state.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3 border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-2xl font-bold text-white">{metrics?.totalEvents ?? 0}</span>
            <span className="text-xs text-slate-400 font-medium">Total Automation Events</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3 border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-2xl font-bold text-white">{metrics?.actuatorCommands ?? 0}</span>
            <span className="text-xs text-slate-400 font-medium">Automated Actions</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3 border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-2xl font-bold text-white">{events.length > 0 ? `${successRate}%` : '—'}</span>
            <span className="text-xs text-slate-400 font-medium">Event Processing Success</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3 border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-2xl font-bold text-white">{lastEventTime}</span>
            <span className="text-xs text-slate-400 font-medium">Last Event</span>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5 border border-white/10 flex-1 flex flex-col justify-between">
        {events.length === 0 ? (
          <EmptyState
            title="No automation events yet"
            description="Events will appear as the automation engine processes ML predictions."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-2">Event Type</th>
                  <th className="py-3 px-2">Component</th>
                  <th className="py-3 px-2">Message</th>
                  <th className="py-3 px-2">Ticket</th>
                  <th className="py-3 px-2">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {events.map((event: AutomationEvent) => (
                  <tr key={event.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 font-bold text-white">
                      {EVENT_LABELS[event.type] || event.type}
                    </td>
                    <td className="py-3 px-2 font-mono font-semibold text-cyan-400">
                      {event.componentId || '—'}
                    </td>
                    <td className="py-3 px-2 text-slate-200 font-medium max-w-md truncate">
                      {event.message}
                    </td>
                    <td className="py-3 px-2 font-mono text-slate-400">{event.ticketId || '—'}</td>
                    <td className="py-3 px-2 text-slate-400">{formatEventTime(event.timestamp)}</td>
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
