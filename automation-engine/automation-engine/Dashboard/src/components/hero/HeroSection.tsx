import React from 'react';
import { ComponentItem, AlertItem } from '../../types';
import { KPICards } from './KPICards';
import { StationMarkers } from './StationMarkers';
import { SelectedCard } from './SelectedCard';
import { LiveSensorPanel } from './LiveSensorPanel';
import { RecentAlerts } from './RecentAlerts';
import { MiniMap } from './MiniMap';

interface HeroSectionProps {
  components: ComponentItem[];
  selectedComponent: ComponentItem;
  onSelectComponent: (comp: ComponentItem) => void;
  alerts: AlertItem[];
  kpiStats: {
    total: number;
    operational: number;
    atRisk: number;
    critical: number;
  };
  mlStatus?: string;
  onViewAlerts?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  components,
  selectedComponent,
  onSelectComponent,
  alerts,
  kpiStats,
  mlStatus = 'waiting',
  onViewAlerts,
}) => {
  const statusLabel =
    mlStatus === 'connected' ? 'Online' : mlStatus === 'unavailable' ? 'ML Unavailable' : 'Waiting';
  const statusColor =
    mlStatus === 'connected'
      ? 'bg-emerald-500/20 border-emerald-400/40'
      : mlStatus === 'unavailable'
      ? 'bg-red-500/20 border-red-400/40'
      : 'bg-amber-500/20 border-amber-400/40';
  const dotColor =
    mlStatus === 'connected' ? 'bg-emerald-400' : mlStatus === 'unavailable' ? 'bg-red-400' : 'bg-amber-400';

  return (
    <div className="relative w-full flex-1 h-[calc(100vh-75px)] min-h-[580px] rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-2xl select-none">
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/bharati-station.jpg"
          alt="Bharati Station Antarctica"
          className="w-full h-full object-cover object-center brightness-[0.98] contrast-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B101D]/90 via-slate-950/15 to-slate-950/30" />
      </div>

      <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-20">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">
              Bharati Station
            </h1>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-md ${statusColor}`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${dotColor}`} />
              <span className="text-xs font-semibold text-white">{statusLabel}</span>
            </div>
          </div>
          <span className="text-xs text-slate-200 font-medium drop-shadow mt-0.5">
            Antarctica, Indian Research Station
          </span>
        </div>

        <KPICards stats={kpiStats} />
      </div>

      <StationMarkers
        components={components}
        selectedComponent={selectedComponent}
        onSelectComponent={onSelectComponent}
      />

      <SelectedCard component={selectedComponent} />

      <div className="absolute right-6 top-16 bottom-4 flex flex-col items-end z-30 pointer-events-auto">
        <LiveSensorPanel telemetry={selectedComponent.telemetry} />
        <div className="flex-1 min-h-3" />
        <div className="flex flex-col items-end gap-3">
          <MiniMap selectedComponent={selectedComponent} />
          <RecentAlerts alerts={alerts} onSeeAll={onViewAlerts} />
        </div>
      </div>
    </div>
  );
};
