import { StatusType } from '../types';

export function getStatusBadgeClass(status: StatusType): string {
  switch (status) {
    case 'Operational':
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    case 'Early Degradation':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'At Risk':
      return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    case 'Critical':
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
  }
}

export function formatSensorStatus(sensorStatus?: string): string {
  if (!sensorStatus) return '—';
  if (sensorStatus === 'NORMAL') return 'Normal';
  if (sensorStatus === 'SENSOR_FAILURE') return 'Sensor Fault';
  return sensorStatus;
}
