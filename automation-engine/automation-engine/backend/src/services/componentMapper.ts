import type { ComponentView, HealthStatus, Prediction } from '../types/index.js';

const ROOM_LABELS: Record<string, string> = {
  R001: 'Power Generation Hall',
  R002: 'Utility Systems',
  R003: 'Water Treatment',
  R004: 'Wastewater Treatment',
  R005: 'Galley',
  R006: 'Server Room',
};

const ML_STATE_LABELS: Record<string, string> = {
  NORMAL: 'Normal',
  EARLY_DEGRADATION: 'Early Degradation',
  DEGRADING: 'Degrading',
  WARNING: 'Warning',
  FAULT: 'Fault',
  FAILURE: 'Failure',
};

function hashPosition(id: string): { top: string; left: string } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 1000;
  }
  const top = 25 + (hash % 50);
  const left = 20 + ((hash * 7) % 60);
  return { top: `${top}%`, left: `${left}%` };
}

/** Map ML current_state directly to dashboard operational status */
function mapUiStatusFromMl(mlState?: string, healthStatus?: HealthStatus): ComponentView['status'] {
  const state = (mlState || '').toUpperCase();
  switch (state) {
    case 'NORMAL':
      return 'Operational';
    case 'EARLY_DEGRADATION':
      return 'Early Degradation';
    case 'DEGRADING':
    case 'WARNING':
      return 'At Risk';
    case 'FAULT':
    case 'FAILURE':
      return 'Critical';
    default:
      break;
  }

  switch (healthStatus) {
    case 'Healthy':
      return 'Operational';
    case 'Early Degradation':
      return 'Early Degradation';
    case 'Degradation to Failure':
      return 'At Risk';
    case 'Fault':
      return 'Critical';
    default:
      return 'Operational';
  }
}

function formatMlStateLabel(mlState?: string): string {
  if (!mlState) return '—';
  return ML_STATE_LABELS[mlState.toUpperCase()] || mlState;
}

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

const EMPTY_TELEMETRY = {
  temperature: '—',
  pressure: '—',
  flowRate: '—',
  powerDraw: '—',
  vibration: '—',
  systemHealth: '—',
};

function formatSensorStatus(sensorStatus?: string): string {
  if (!sensorStatus) return '—';
  if (sensorStatus === 'NORMAL') return 'Normal';
  if (sensorStatus === 'SENSOR_FAILURE') return 'Sensor Fault';
  return sensorStatus;
}

export function predictionToComponent(pred: Prediction): ComponentView {
  const health = pred.healthScore !== undefined ? pred.healthScore / 100 : 0;
  const module = pred.machineName || ROOM_LABELS[pred.roomId] || pred.roomId || 'Station Module';

  return {
    id: pred.componentId,
    assetId: pred.assetId,
    name: pred.componentName,
    module,
    type: pred.componentType,
    status: mapUiStatusFromMl(pred.mlCurrentState, pred.healthStatus),
    health,
    healthStatus: pred.healthStatus,
    mlCurrentState: pred.mlCurrentState,
    mlStateLabel: formatMlStateLabel(pred.mlCurrentState),
    description: pred.statusMessage || `${pred.componentType} on ${pred.machineName}`,
    thumbnail: '/assets/water-treatment-thumb.jpg',
    lastUpdate: formatRelativeTime(pred.timestamp),
    markerPos: hashPosition(pred.componentId),
    machineId: pred.machineId,
    machineName: pred.machineName,
    roomId: pred.roomId,
    rul: pred.rul,
    sensorStatus: pred.sensorStatus,
    telemetry: {
      ...EMPTY_TELEMETRY,
      systemHealth: pred.healthScore !== undefined ? `${pred.healthScore.toFixed(0)}%` : '—',
      vibration: formatSensorStatus(pred.sensorStatus),
      flowRate: pred.rul !== undefined ? `${pred.rul.toFixed(1)} d RUL` : '—',
      powerDraw: pred.anomalyCount !== undefined ? `${pred.anomalyCount} anomalies` : '—',
      temperature: pred.activeSensor ? `${pred.activeSensor} sensor` : '—',
    },
  };
}

export function selectHeroComponents(components: ComponentView[], limit = 6): ComponentView[] {
  const priority = (c: ComponentView) => {
    if (c.status === 'Critical') return 0;
    if (c.status === 'At Risk' || c.status === 'Early Degradation') return 1;
    return 2;
  };
  return [...components]
    .sort((a, b) => priority(a) - priority(b) || a.health - b.health)
    .slice(0, limit);
}
