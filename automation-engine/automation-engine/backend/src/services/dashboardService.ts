import { getStore, getSystemState } from '../database/db.js';
import type { AlertItem, DashboardSummary, Prediction } from '../types/index.js';
import { countAutomationEventsByType, getAutomationEvents } from './automation/eventLog.js';
import { getLastOptimization } from './energy/energyOptimizer.js';

function componentRowToPrediction(row: Record<string, unknown>): Prediction {
  return {
    predictionId: (row.prediction_id as string) || `comp-${row.component_id}`,
    assetId: row.asset_id as string,
    componentId: row.component_id as string,
    componentName: row.name as string,
    componentType: row.type as string,
    machineId: row.machine_id as string,
    machineName: row.machine_name as string,
    roomId: row.room_id as string,
    healthStatus: row.health_status as Prediction['healthStatus'],
    healthScore: row.health_score as number | undefined,
    rul: row.rul as number | undefined,
    priority: row.priority as Prediction['priority'],
    timestamp: (row.last_update as string) || (row.ingested_at as string) || new Date().toISOString(),
    statusMessage: row.status_message as string | undefined,
    sensorStatus: row.sensor_status as string | undefined,
    activeSensor: row.active_sensor as string | undefined,
    anomalyCount: row.anomaly_count as number | undefined,
    maintenanceRequired: Boolean(row.maintenance_required),
    mlCurrentState: row.ml_current_state as string | undefined,
  };
}

/**
 * Returns the latest prediction per component from the components store.
 * This is the authoritative current state (updated every ML poll).
 * Do NOT use ML simulated timestamps from the predictions history array.
 */
export function getLatestPredictions(): Prediction[] {
  return getStore()
    .components
    .map(componentRowToPrediction)
    .sort((a, b) => a.componentId.localeCompare(b.componentId));
}

export function getDashboardSummary(): DashboardSummary {
  const store = getStore();
  const components = store.components;

  const tickets = store.tickets;
  const active = tickets.filter((t) => !['Resolved', 'Closed'].includes(t.status as string)).length;
  const critical = tickets.filter(
    (t) => t.priority === 'Critical' && !['Resolved', 'Closed'].includes(t.status as string)
  ).length;
  const assigned = tickets.filter((t) => ['Assigned', 'In Progress'].includes(t.status as string)).length;
  const escalated = tickets.filter((t) => t.status === 'Escalated').length;
  const resolved = tickets.filter((t) => t.status === 'Resolved').length;
  const closed = tickets.filter((t) => t.status === 'Closed').length;

  const lastPred = components
    .map((c) => c.ingested_at as string || c.last_update as string)
    .filter(Boolean)
    .sort()
    .pop();

  const mlStatus = getSystemState('ml_connection_status') || 'waiting';
  const energyOpt = getLastOptimization();

  let operational = 0;
  let earlyDegradation = 0;
  let degradation = 0;
  let fault = 0;

  for (const c of components) {
    const mlState = ((c.ml_current_state as string) || '').toUpperCase();
    if (mlState === 'NORMAL' || c.health_status === 'Healthy') {
      operational++;
    } else if (mlState === 'EARLY_DEGRADATION' || c.health_status === 'Early Degradation') {
      earlyDegradation++;
    } else if (
      mlState === 'DEGRADING' ||
      mlState === 'WARNING' ||
      c.health_status === 'Degradation to Failure'
    ) {
      degradation++;
    } else if (mlState === 'FAULT' || mlState === 'FAILURE' || c.health_status === 'Fault') {
      fault++;
    } else {
      switch (c.health_status) {
        case 'Healthy':
          operational++;
          break;
        case 'Early Degradation':
          earlyDegradation++;
          break;
        case 'Degradation to Failure':
          degradation++;
          break;
        case 'Fault':
          fault++;
          break;
      }
    }
  }

  const automatedActions = countAutomationEventsByType('ACTUATOR_COMMAND');

  return {
    totalComponents: components.length,
    operationalComponents: operational,
    earlyDegradationComponents: earlyDegradation,
    degradationComponents: degradation,
    faultComponents: fault,
    activeTickets: active,
    criticalTickets: critical,
    automatedActions,
    assignedTickets: assigned,
    escalatedTickets: escalated,
    energyAvailable: energyOpt?.hasTelemetry ? energyOpt.availableKw : null,
    energyDemand: energyOpt?.hasTelemetry ? energyOpt.totalDemandKw : null,
    lastPredictionTimestamp: lastPred ?? null,
    mlConnectionStatus: mlStatus as DashboardSummary['mlConnectionStatus'],
    resolvedTickets: resolved + closed,
    closedTickets: closed,
  };
}

export function getHealthTrend(): Array<{ time: string; health: number }> {
  return getStore()
    .health_history.slice(-24)
    .map((row) => ({
      time: new Date(row.timestamp as string).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      health: Math.round(row.avg_health_score as number),
    }));
}

export function getAlerts(limit = 10): AlertItem[] {
  const events = getAutomationEvents(limit);
  return events.map((e) => ({
    id: e.id,
    component: e.componentId || 'System',
    message: e.message,
    time: formatRelative(e.timestamp),
    severity: mapSeverity(e.type),
  }));
}

function mapSeverity(type: string): AlertItem['severity'] {
  if (type === 'FAULT_DETECTED' || type === 'ESCALATED' || type === 'ML_POLL_ERROR') return 'critical';
  if (type === 'TICKET_CREATED' || type === 'POLICY_EVALUATED') return 'warning';
  return 'info';
}

function formatRelative(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}
