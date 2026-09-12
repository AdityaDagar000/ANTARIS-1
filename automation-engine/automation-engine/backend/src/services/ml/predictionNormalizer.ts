import { v4 as uuidv4 } from 'uuid';
import type { HealthStatus, MlPredictionRaw, Prediction, Priority } from '../../types/index.js';

const RUL_REFERENCE_DAYS = 120;

/**
 * Maps ML API current_state to internal automation health status.
 *
 * ML schema states: NORMAL | EARLY_DEGRADATION | DEGRADING | WARNING
 * Sensor fields (sensor_status, maintenance_required) are preserved separately
 * and do NOT override current_state for ticket/automation decisions.
 */
function mapHealthStatus(state: string, rul: number, maintenanceRequired: boolean): HealthStatus {
  const normalized = state.toUpperCase();
  switch (normalized) {
    case 'NORMAL':
      return 'Healthy';
    case 'EARLY_DEGRADATION':
      return 'Early Degradation';
    case 'DEGRADING':
      return 'Degradation to Failure';
    case 'WARNING':
      if (maintenanceRequired && rul < 15) return 'Fault';
      return 'Degradation to Failure';
    case 'FAULT':
    case 'FAILURE':
      return 'Fault';
    default:
      if (rul < 10) return 'Fault';
      if (rul < 25) return 'Degradation to Failure';
      return 'Early Degradation';
  }
}

function derivePriority(healthStatus: HealthStatus, rul: number): Priority {
  if (healthStatus === 'Fault' || rul < 12) return 'Critical';
  if (healthStatus === 'Degradation to Failure' || rul < 20) return 'High';
  if (healthStatus === 'Early Degradation' || rul < 35) return 'Medium';
  return 'Low';
}

function deriveHealthScore(rul: number, healthStatus: HealthStatus): number {
  const rulScore = Math.min(100, Math.max(0, (rul / RUL_REFERENCE_DAYS) * 100));
  switch (healthStatus) {
    case 'Healthy':
      return Math.max(rulScore, 85);
    case 'Early Degradation':
      return Math.min(rulScore, 75);
    case 'Degradation to Failure':
      return Math.min(rulScore, 55);
    case 'Fault':
      return Math.min(rulScore, 30);
    default:
      return rulScore;
  }
}

export function normalizePrediction(raw: MlPredictionRaw): Prediction | null {
  if (!raw.asset_id || !raw.component_id || !raw.timestamp) {
    return null;
  }

  if (typeof raw.predicted_rul_days !== 'number' || !raw.current_state) {
    return null;
  }

  const rul = raw.predicted_rul_days;
  const maintenanceRequired = Boolean(raw.maintenance_required);
  const healthStatus = mapHealthStatus(raw.current_state, rul, maintenanceRequired);
  const healthScore = deriveHealthScore(rul, healthStatus);
  const priority = derivePriority(healthStatus, rul);

  const componentName = `${raw.component_type} — ${raw.machine_name || raw.machine_id}`;

  return {
    predictionId: uuidv4(),
    assetId: raw.asset_id,
    componentId: raw.component_id,
    componentName,
    componentType: raw.component_type,
    machineId: raw.machine_id,
    machineName: raw.machine_name,
    roomId: raw.room_id,
    healthStatus,
    healthScore,
    rul,
    priority,
    timestamp: raw.timestamp,
    statusMessage: raw.status_message,
    sensorStatus: raw.sensor_status,
    activeSensor: raw.active_sensor,
    anomalyCount: raw.anomaly_count,
    maintenanceRequired,
    mlCurrentState: raw.current_state,
    rawPrediction: raw,
  };
}

export function validateMlResponse(data: unknown): MlPredictionRaw[] {
  if (!Array.isArray(data)) {
    throw new Error('ML API response is not an array');
  }

  const valid: MlPredictionRaw[] = [];

  for (const item of data) {
    if (typeof item !== 'object' || item === null) continue;

    const raw = item as Record<string, unknown>;

    if (
      typeof raw.asset_id !== 'string' ||
      typeof raw.component_id !== 'string' ||
      typeof raw.timestamp !== 'string' ||
      typeof raw.predicted_rul_days !== 'number' ||
      typeof raw.current_state !== 'string' ||
      typeof raw.component_type !== 'string' ||
      typeof raw.machine_id !== 'string' ||
      typeof raw.machine_name !== 'string' ||
      typeof raw.room_id !== 'string'
    ) {
      continue;
    }

    valid.push({
      asset_id: raw.asset_id,
      timestamp: raw.timestamp,
      predicted_rul_days: raw.predicted_rul_days,
      current_state: raw.current_state,
      component_id: raw.component_id,
      component_type: raw.component_type,
      machine_id: raw.machine_id,
      machine_name: raw.machine_name,
      room_id: raw.room_id,
      sensor_status: typeof raw.sensor_status === 'string' ? raw.sensor_status : 'NORMAL',
      active_sensor: typeof raw.active_sensor === 'string' ? raw.active_sensor : 'primary',
      anomaly_count: typeof raw.anomaly_count === 'number' ? raw.anomaly_count : 0,
      maintenance_required: Boolean(raw.maintenance_required),
      status_message: typeof raw.status_message === 'string' ? raw.status_message : '',
    });
  }

  return valid;
}
