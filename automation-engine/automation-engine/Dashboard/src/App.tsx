import { useCallback, useEffect, useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './pages/DashboardPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { StationHealthPage } from './pages/StationHealthPage';
import { FaultyComponentsPage } from './pages/FaultyComponentsPage';
import { ComponentsPage } from './pages/ComponentsPage';
import { PersonnelPage } from './pages/PersonnelPage';
import { TicketsPage } from './pages/TicketsPage';
import { StandardProceduresPage } from './pages/StandardProceduresPage';
import { AutomationPage } from './pages/AutomationPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { SettingsPage } from './pages/SettingsPage';
import { CreateTicketModal } from './components/modals/CreateTicketModal';
import { TicketDetailModal } from './components/modals/TicketDetailModal';
import { ComponentDetailModal } from './components/modals/ComponentDetailModal';
import { api } from './api';
import { usePolling } from './hooks/usePolling';
import { mapPersonnelFromApi, mapProcedureFromApi, mapTicketFromApi } from './utils/mappers';
import { ComponentItem, DashboardSummary, TicketItem } from './types';

const emptySummary: DashboardSummary = {
  totalComponents: 0,
  operationalComponents: 0,
  earlyDegradationComponents: 0,
  degradationComponents: 0,
  faultComponents: 0,
  activeTickets: 0,
  criticalTickets: 0,
  automatedActions: 0,
  assignedTickets: 0,
  escalatedTickets: 0,
  energyAvailable: null,
  energyDemand: null,
  lastPredictionTimestamp: null,
  mlConnectionStatus: 'waiting',
  resolvedTickets: 0,
  closedTickets: 0,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [detailComponent, setDetailComponent] = useState<ComponentItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSummary = useCallback(() => api.getDashboardSummary(), []);
  const fetchHeroComponents = useCallback(() => api.getHeroComponents(), []);
  const fetchAlerts = useCallback(() => api.getAlerts(), []);
  const fetchTickets = useCallback(async () => {
    const raw = await api.getTickets();
    return raw.map((t) => mapTicketFromApi(t as unknown as Record<string, unknown>));
  }, []);
  const fetchPersonnel = useCallback(async () => {
    const raw = await api.getPersonnel();
    return raw.map((p) => mapPersonnelFromApi(p as unknown as Record<string, unknown>));
  }, []);
  const fetchProcedures = useCallback(async () => {
    const raw = await api.getProcedures();
    return raw.map((p) => mapProcedureFromApi(p as unknown as Record<string, unknown>));
  }, []);
  const fetchPolicies = useCallback(() => api.getPolicies(), []);

  const { data: summary } = usePolling(fetchSummary);
  const { data: heroComponents } = usePolling(fetchHeroComponents);
  const { data: alerts } = usePolling(fetchAlerts);
  const { data: tickets, refresh: refreshTickets } = usePolling(fetchTickets);
  const { data: personnelList } = usePolling(fetchPersonnel);
  const { data: procedures } = usePolling(fetchProcedures);
  const { data: policies } = usePolling(fetchPolicies);

  const kpiStats = {
    total: summary?.totalComponents ?? 0,
    operational: summary?.operationalComponents ?? 0,
    atRisk: (summary?.earlyDegradationComponents ?? 0) + (summary?.degradationComponents ?? 0),
    critical: summary?.faultComponents ?? 0,
  };

  useEffect(() => {
    if (heroComponents && heroComponents.length > 0 && !selectedComponent) {
      setSelectedComponent(heroComponents[0]);
    }
  }, [heroComponents, selectedComponent]);

  const handleCreateTicket = async (payload: {
    componentId: string;
    priority: TicketItem['priority'];
    assignedTo?: string;
  }) => {
    await api.createTicket({
      componentId: payload.componentId,
      priority: payload.priority,
      assignedTo: payload.assignedTo,
    });
    await refreshTickets();
    setIsTicketModalOpen(false);
  };

  const handleViewComponentDetail = (comp: ComponentItem) => {
    setDetailComponent(comp);
  };

  const handleViewTicket = (ticket: TicketItem) => {
    setSelectedTicket(ticket);
  };

  const handleSettingsClick = () => {
    setActiveTab('Settings');
  };

  const components = heroComponents ?? [];
  const currentComponent = selectedComponent ?? components[0] ?? null;

  const renderActivePage = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <DashboardPage
            components={components}
            selectedComponent={currentComponent}
            onSelectComponent={setSelectedComponent}
            alerts={alerts ?? []}
            kpiStats={kpiStats}
            mlStatus={summary?.mlConnectionStatus ?? 'waiting'}
            loading={!heroComponents}
            onViewAlerts={() => setActiveTab('Automation')}
          />
        );
      case 'Digital Twin':
        return <DigitalTwinPage />;
      case 'Station Health':
        return (
          <StationHealthPage
            onViewComponent={handleViewComponentDetail}
            summary={summary ?? emptySummary}
          />
        );
      case 'Faulty Components':
        return <FaultyComponentsPage onViewComponent={handleViewComponentDetail} />;
      case 'Components':
        return <ComponentsPage onViewComponent={handleViewComponentDetail} searchTerm={searchTerm} />;
      case 'Personnel':
        return <PersonnelPage personnelList={personnelList ?? []} />;
      case 'Tickets':
        return (
          <TicketsPage
            tickets={tickets ?? []}
            onOpenCreateModal={() => setIsTicketModalOpen(true)}
            onViewTicket={handleViewTicket}
            resolvedCount={summary?.resolvedTickets ?? 0}
          />
        );
      case 'Standard Procedures':
        return <StandardProceduresPage procedures={procedures ?? []} />;
      case 'Automation':
        return <AutomationPage />;
      case 'Policies':
        return <PoliciesPage policies={policies ?? []} />;
      case 'Settings':
        return <SettingsPage mlStatus={summary?.mlConnectionStatus ?? 'waiting'} />;
      default:
        return (
          <DashboardPage
            components={components}
            selectedComponent={currentComponent}
            onSelectComponent={setSelectedComponent}
            alerts={alerts ?? []}
            kpiStats={kpiStats}
            mlStatus={summary?.mlConnectionStatus ?? 'waiting'}
            loading={!heroComponents}
            onViewAlerts={() => setActiveTab('Automation')}
          />
        );
    }
  };

  return (
    <div className="w-screen h-screen min-h-screen bg-[#0B101D] text-slate-100 flex p-2.5 gap-2.5 overflow-hidden select-none">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSettingsClick={handleSettingsClick}
        />

        <div className="flex-1 min-h-0 flex flex-col mt-1.5 overflow-hidden">
          {renderActivePage()}
        </div>
      </main>

      <CreateTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onCreate={handleCreateTicket}
        components={components}
      />

      <TicketDetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />

      <ComponentDetailModal component={detailComponent} onClose={() => setDetailComponent(null)} />
    </div>
  );
}
