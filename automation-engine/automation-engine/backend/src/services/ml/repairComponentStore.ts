import { getStore, saveStore } from '../../database/db.js';

/**
 * Backfill component records with ML fields from the most recently ingested
 * prediction per component. Uses ingested_at (server time), NOT ML timestamp.
 */
export function repairComponentStoreFromPredictions(): void {
  const store = getStore();
  const latestByComponent = new Map<string, Record<string, unknown>>();

  for (const row of store.predictions) {
    const componentId = row.component_id as string;
    const ingested = (row.ingested_at as string) || (row.timestamp as string);
    const existing = latestByComponent.get(componentId);
    const existingIngested = existing
      ? ((existing.ingested_at as string) || (existing.timestamp as string))
      : '';

    if (!existing || ingested > existingIngested) {
      latestByComponent.set(componentId, row);
    }
  }

  let repaired = 0;
  for (const comp of store.components) {
    const latest = latestByComponent.get(comp.component_id as string);
    if (!latest) continue;

    const needsRepair =
      !comp.ml_current_state ||
      !comp.sensor_status ||
      comp.ml_current_state !== latest.ml_current_state ||
      comp.sensor_status !== latest.sensor_status;

    if (!needsRepair) continue;

    let raw: Record<string, unknown> | null = null;
    if (latest.raw_json) {
      try {
        raw = JSON.parse(latest.raw_json as string) as Record<string, unknown>;
      } catch {
        raw = null;
      }
    }

    comp.ml_current_state = (latest.ml_current_state as string) || (raw?.current_state as string) || comp.ml_current_state;
    comp.sensor_status = (latest.sensor_status as string) || (raw?.sensor_status as string) || comp.sensor_status;
    comp.active_sensor = (latest.active_sensor as string) || (raw?.active_sensor as string) || comp.active_sensor;
    comp.anomaly_count = (latest.anomaly_count as number) ?? (raw?.anomaly_count as number) ?? comp.anomaly_count;
    comp.health_status = latest.health_status ?? comp.health_status;
    comp.health_score = latest.health_score ?? comp.health_score;
    comp.rul = latest.rul ?? comp.rul;
    comp.status_message = latest.status_message ?? comp.status_message;
    comp.ingested_at = (latest.ingested_at as string) || comp.ingested_at;
    repaired++;
  }

  if (repaired > 0) {
    saveStore();
    console.log(`[ML] Repaired ${repaired} component record(s) from latest ingested predictions`);
  }
}
