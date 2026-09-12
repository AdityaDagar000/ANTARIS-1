import React from 'react';
import { AlertItem } from '../../types';

interface RecentAlertsProps {
  alerts: AlertItem[];
  onSeeAll?: () => void;
}

export const RecentAlerts: React.FC<RecentAlertsProps> = ({ alerts, onSeeAll }) => {
  return (
    <div className="glass-panel rounded-2xl p-3.5 w-[245px] max-h-[180px] overflow-y-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-bold text-white tracking-wide">Recent Alerts</span>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            See All
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <p className="text-[10px] text-slate-500 text-center py-4">No active alerts</p>
      ) : (
        <div className="space-y-2.5">
          {alerts.map((alert) => {
            let dotColor = 'bg-blue-400';
            if (alert.severity === 'critical') dotColor = 'bg-red-500';
            if (alert.severity === 'warning') dotColor = 'bg-amber-400';

            return (
              <div key={alert.id} className="flex items-start gap-2.5 text-left">
                <span className={`w-2 h-2 rounded-full ${dotColor} mt-1 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white leading-tight truncate">
                      {alert.component}
                    </span>
                    <span className="text-[9px] text-slate-400 ml-1 shrink-0">{alert.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-normal leading-tight mt-0.5">
                    {alert.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
