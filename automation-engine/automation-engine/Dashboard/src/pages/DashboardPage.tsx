import React from 'react';
import { HeroSection } from '../components/hero/HeroSection';
import { EmptyState } from '../components/ui/EmptyState';
import { ComponentItem, AlertItem } from '../types';

interface DashboardPageProps {
  components: ComponentItem[];
  selectedComponent: ComponentItem | null;
  onSelectComponent: (comp: ComponentItem) => void;
  alerts: AlertItem[];
  kpiStats: {
    total: number;
    operational: number;
    atRisk: number;
    critical: number;
  };
  mlStatus: string;
  loading?: boolean;
  onViewAlerts?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  components,
  selectedComponent,
  onSelectComponent,
  alerts,
  kpiStats,
  mlStatus,
  loading,
  onViewAlerts,
}) => {
  if (!loading && components.length === 0) {
    return (
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden glass-panel rounded-2xl border border-white/10">
        <EmptyState
          title="Waiting for ML predictions"
          description={
            mlStatus === 'unavailable'
              ? 'ML connection unavailable. The backend will retry automatically.'
              : 'The station digital twin has not received prediction data yet.'
          }
        />
      </div>
    );
  }

  if (!selectedComponent) {
    return (
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden glass-panel rounded-2xl border border-white/10">
        <EmptyState title="Loading station data..." />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
      <HeroSection
        components={components}
        selectedComponent={selectedComponent}
        onSelectComponent={onSelectComponent}
        alerts={alerts}
        kpiStats={kpiStats}
        mlStatus={mlStatus}
        onViewAlerts={onViewAlerts}
      />
    </div>
  );
};
