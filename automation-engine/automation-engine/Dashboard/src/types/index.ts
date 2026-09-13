export type StatusType = 'Operational' | 'Early Degradation' | 'At Risk' | 'Critical';

export type HealthStatus =
  | 'Healthy'
  | 'Early Degradation'
  | 'Degradation to Failure'
  | 'Fault';

export interface ComponentItem {
  id: string;
  assetId?: string;
  name: string;
  module: string;
  type: string;
  status: StatusType;
  health: number;
  healthStatus?: HealthStatus;
  mlCurrentState?: string;
  mlStateLabel?: string;
  sensorStatus?: string;
  description: string;
  thumbnail: string;
  lastUpdate: string;
  markerPos: { top: string; left: string };
  machineId?: string;
  machineName?: string;
  roomId?: string;
  rul?: number;
  telemetry: {
    temperature: string;
    pressure: string;
    flowRate: string;
    powerDraw: string;
    vibration: string;
    systemHealth: string;
  };
}

export interface AlertItem {
  id: string;
  component: string;
  message: string;
  time: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface TicketItem {
  id: string;
  componentId: string;
  componentName?: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: string;
  assignedTo: string;
  created: string;
  faultType?: string;
  policyClass?: string;
  maintenanceOrder?: number | null;
  operationalCriticality?: number | null;
  maintenanceRationale?: string | null;
  timeline?: Array<{ type: string; message: string; timestamp: string }>;
}

export interface AutomationEvent {
  id: string;
  timestamp: string;
  type: string;
  assetId?: string;
  componentId?: string;
  ticketId?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface PersonnelItem {
  id: string;
  name: string;
  role: string;
  skills: string[];
  availability: 'Available' | 'On Assignment' | 'Unavailable' | 'Off Shift';
  assignment: string;
  shift: string;
  lastActivity: string;
  contactStatus: string;
}

export interface ProcedureItem {
  id: string;
  name: string;
  category: string;
  version: string;
  lastUpdated: string;
  status: 'Active' | 'Draft' | 'Archived';
  purpose: string;
  prerequisites: string[];
  steps: string[] | Array<{ order: number; description: string }>;
  warnings: string[];
  owner: string;
  automationPolicy?: string;
}

export interface PolicyItem {
  id: string;
  name: string;
  category: string;
  version: string;
  effectiveDate: string;
  status: 'Active' | 'Under Review' | 'Archived';
  owner: string;
  purpose: string;
  scope: string;
  requirements: string[];
  lastReviewed: string;
  nextReview: string;
}

export interface DashboardSummary {
  totalComponents: number;
  operationalComponents: number;
  earlyDegradationComponents: number;
  degradationComponents: number;
  faultComponents: number;
  activeTickets: number;
  criticalTickets: number;
  automatedActions: number;
  assignedTickets: number;
  escalatedTickets: number;
  energyAvailable: number | null;
  energyDemand: number | null;
  lastPredictionTimestamp: string | null;
  mlConnectionStatus: 'connected' | 'unavailable' | 'waiting';
  resolvedTickets: number;
  closedTickets: number;
}
