export type HealthStatus =
  | 'Healthy'
  | 'Early Degradation'
  | 'Degradation to Failure'
  | 'Fault';

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export type TicketStatus =
  | 'Open'
  | 'Automation Pending'
  | 'Automated'
  | 'Assigned'
  | 'In Progress'
  | 'Escalated'
  | 'Resolved'
  | 'Closed';

export type PolicyClass = 'WHITELIST' | 'GREYLIST' | 'BLACKLIST';

export type AutomationEventType =
  | 'PREDICTION_RECEIVED'
  | 'FAULT_DETECTED'
  | 'TICKET_CREATED'
  | 'PROCEDURE_SELECTED'
  | 'POLICY_EVALUATED'
  | 'ACTUATOR_COMMAND'
  | 'PERSONNEL_ASSIGNED'
  | 'ESCALATED'
  | 'RECOVERY_DETECTED'
  | 'TICKET_CLOSED'
  | 'ML_POLL_ERROR'
  | 'ENERGY_OPTIMIZED';

/** Exact schema returned by the ML RUL API */
export type MlCurrentState =
  | 'NORMAL'
  | 'EARLY_DEGRADATION'
  | 'DEGRADING'
  | 'WARNING'
  | 'FAULT'
  | 'FAILURE';

export type MlSensorStatus = 'NORMAL' | 'SENSOR_FAILURE';

export type MlActiveSensor = 'primary' | 'backup';

export interface MlPredictionRaw {
  asset_id: string;
  timestamp: string;
  predicted_rul_days: number;
  current_state: MlCurrentState | string;
  component_id: string;
  component_type: string;
  machine_id: string;
  machine_name: string;
  room_id: string;
  sensor_status: MlSensorStatus | string;
  active_sensor: MlActiveSensor | string;
  anomaly_count: number;
  maintenance_required: boolean;
  status_message: string;
}

export interface Prediction {
  predictionId: string;
  assetId: string;
  componentId: string;
  componentName: string;
  componentType: string;
  machineId: string;
  machineName: string;
  roomId: string;
  healthStatus: HealthStatus;
  healthScore?: number;
  rul?: number;
  priority?: Priority;
  timestamp: string;
  statusMessage?: string;
  sensorStatus?: string;
  activeSensor?: string;
  anomalyCount?: number;
  maintenanceRequired?: boolean;
  mlCurrentState?: string;
  rawPrediction?: unknown;
}

export interface TicketEvent {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface MaintenanceTicket {
  id: string;
  assetId: string;
  componentId: string;
  componentName: string;
  predictionId?: string;
  faultType: string;
  priority: Priority;
  status: TicketStatus;
  procedureId?: string;
  policyClass?: PolicyClass;
  assignedPersonnelId?: string;
  assignedPersonnelName?: string;
  automationAction?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  timeline: TicketEvent[];
}

export interface ProcedureStep {
  order: number;
  description: string;
}

export interface StandardProcedure {
  id: string;
  name: string;
  assetType?: string;
  componentType?: string;
  category: string;
  purpose: string;
  prerequisites: string[];
  steps: ProcedureStep[];
  warnings: string[];
  owner: string;
  version: string;
  status: 'Active' | 'Draft' | 'Archived';
  automationPolicy: PolicyClass;
  allowedActions?: string[];
  requiredSkills: string[];
}

export interface Personnel {
  id: string;
  name: string;
  role: string;
  skills: string[];
  availability: 'Available' | 'On Assignment' | 'Unavailable' | 'Off Shift';
  currentWorkload: number;
  activeAssignments: number;
  shift?: string;
}

export interface AutomationEvent {
  id: string;
  timestamp: string;
  type: AutomationEventType;
  assetId?: string;
  componentId?: string;
  ticketId?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface EnergyLoad {
  id: string;
  name: string;
  category: 'Life Support' | 'Power' | 'Water' | 'Communications' | 'Heating' | 'Research' | 'Other';
  currentDemandKw: number;
  minimumRequiredKw: number;
  maximumAllowedKw: number;
  priority: Priority;
  active: boolean;
}

export interface EnergyOptimization {
  timestamp: string;
  availableKw: number;
  totalDemandKw: number;
  allocations: Array<{
    loadId: string;
    loadName: string;
    allocatedKw: number;
    decision: string;
  }>;
  summary: string;
  hasTelemetry: boolean;
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

export interface ActuatorCommand {
  assetId: string;
  componentId: string;
  action: string;
  reason: string;
  ticketId: string;
}

export interface ActuatorResult {
  success: boolean;
  simulated: boolean;
  message: string;
  timestamp: string;
}

export interface AlertItem {
  id: string;
  component: string;
  message: string;
  time: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface ComponentView {
  id: string;
  assetId: string;
  name: string;
  module: string;
  type: string;
  status: 'Operational' | 'Early Degradation' | 'At Risk' | 'Critical';
  mlCurrentState?: string;
  mlStateLabel?: string;
  sensorStatus?: string;
  health: number;
  healthStatus: HealthStatus;
  description: string;
  thumbnail: string;
  lastUpdate: string;
  markerPos: { top: string; left: string };
  machineId: string;
  machineName: string;
  roomId: string;
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
