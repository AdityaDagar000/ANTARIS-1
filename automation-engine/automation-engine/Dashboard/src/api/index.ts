import { apiFetch } from './client';
import type {
  AlertItem,
  AutomationEvent,
  ComponentItem,
  DashboardSummary,
  PersonnelItem,
  PolicyItem,
  ProcedureItem,
  TicketItem,
} from '../types';

export interface HealthTrendPoint {
  time: string;
  health: number;
}

export interface AutomationResponse {
  events: AutomationEvent[];
  metrics: {
    totalEvents: number;
    actuatorCommands: number;
    ticketsCreated: number;
    personnelAssigned: number;
    lastEvent: string | null;
  };
}

export interface EnergyResponse {
  loads: unknown[];
  hasTelemetry: boolean;
}

export interface CreateTicketPayload {
  componentId: string;
  componentName?: string;
  priority: TicketItem['priority'];
  assignedTo?: string;
  faultType?: string;
  assetId?: string;
}

export const api = {
  health: () => apiFetch<{ status: string; mlConnection: string }>('/health'),

  getDashboardSummary: () => apiFetch<DashboardSummary>('/dashboard/summary'),

  getComponents: () => apiFetch<ComponentItem[]>('/components'),
  getHeroComponents: () => apiFetch<ComponentItem[]>('/components/hero'),
  getComponent: (id: string) => apiFetch<ComponentItem>(`/components/${id}`),
  getFaultyComponents: () => apiFetch<ComponentItem[]>('/components/faulty'),

  getTickets: () => apiFetch<TicketItem[]>('/tickets'),
  getMaintenanceQueue: () =>
    apiFetch<{
      version: string;
      generatedAt: string;
      queue: Array<{
        componentId: string;
        componentName: string;
        mlPriority: TicketItem['priority'];
        effectivePriority: TicketItem['priority'];
        operationalCriticality: number;
        compositeScore: number;
        maintenanceOrder: number;
        rationale: string;
      }>;
    }>('/maintenance/queue'),
  getTicket: (id: string) => apiFetch<TicketItem>(`/tickets/${id}`),
  createTicket: (payload: CreateTicketPayload) =>
    apiFetch<TicketItem>('/tickets', { method: 'POST', body: JSON.stringify(payload) }),

  getPersonnel: () => apiFetch<PersonnelItem[]>('/personnel'),
  getPersonnelById: (id: string) => apiFetch<PersonnelItem>(`/personnel/${id}`),

  getProcedures: () => apiFetch<ProcedureItem[]>('/procedures'),
  getProcedure: (id: string) => apiFetch<ProcedureItem>(`/procedures/${id}`),

  getPolicies: () => apiFetch<PolicyItem[]>('/policies'),

  getAutomation: () => apiFetch<AutomationResponse>('/automation'),
  getAutomationEvents: () => apiFetch<AutomationEvent[]>('/automation/events'),

  getAlerts: () => apiFetch<AlertItem[]>('/alerts'),
  getHealthTrend: () => apiFetch<HealthTrendPoint[]>('/health-trend'),

  getEnergy: () => apiFetch<EnergyResponse>('/energy'),
};
