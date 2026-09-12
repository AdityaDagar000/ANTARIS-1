import type { EnergyLoad, EnergyOptimization, Priority } from '../../types/index.js';
import { logAutomationEvent } from '../automation/eventLog.js';
import { getSystemState, setSystemState } from '../../database/db.js';

const PRIORITY_ORDER: Record<Priority, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

export function getEnergyLoads(): EnergyLoad[] {
  const raw = getSystemState('energy_loads');
  if (!raw) return [];
  try {
    return JSON.parse(raw) as EnergyLoad[];
  } catch {
    return [];
  }
}

export function setEnergyLoads(loads: EnergyLoad[]): void {
  setSystemState('energy_loads', JSON.stringify(loads));
}

export function optimizeEnergy(availableKw?: number): EnergyOptimization {
  const loads = getEnergyLoads();

  if (loads.length === 0 || availableKw === undefined) {
    return {
      timestamp: new Date().toISOString(),
      availableKw: 0,
      totalDemandKw: 0,
      allocations: [],
      summary: 'Waiting for energy telemetry',
      hasTelemetry: false,
    };
  }

  const activeLoads = loads.filter((l) => l.active);
  const totalDemand = activeLoads.reduce((sum, l) => sum + l.currentDemandKw, 0);
  const sorted = [...activeLoads].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );

  let remaining = availableKw;
  const allocations: EnergyOptimization['allocations'] = [];

  for (const load of sorted) {
    const required = load.minimumRequiredKw;
    const requested = load.currentDemandKw;

    if (load.priority === 'Critical') {
      const allocated = Math.min(requested, remaining);
      allocations.push({
        loadId: load.id,
        loadName: load.name,
        allocatedKw: Math.max(required, allocated),
        decision: `${load.name}: ${Math.max(required, allocated)} kW — protected (critical)`,
      });
      remaining -= Math.max(required, allocated);
    } else if (remaining >= requested) {
      allocations.push({
        loadId: load.id,
        loadName: load.name,
        allocatedKw: requested,
        decision: `${load.name}: ${requested} kW — maintained`,
      });
      remaining -= requested;
    } else if (remaining >= required) {
      allocations.push({
        loadId: load.id,
        loadName: load.name,
        allocatedKw: remaining,
        decision: `${load.name}: reduced to ${remaining} kW`,
      });
      remaining = 0;
    } else {
      allocations.push({
        loadId: load.id,
        loadName: load.name,
        allocatedKw: 0,
        decision: `${load.name}: deferred (insufficient energy)`,
      });
    }
  }

  const summary = `Available: ${availableKw} kW. ${allocations.map((a) => a.decision).join('. ')}`;
  const result: EnergyOptimization = {
    timestamp: new Date().toISOString(),
    availableKw,
    totalDemandKw: totalDemand,
    allocations,
    summary,
    hasTelemetry: true,
  };

  setSystemState('last_energy_optimization', JSON.stringify(result));
  logAutomationEvent('ENERGY_OPTIMIZED', summary, { metadata: { availableKw, totalDemand } });

  return result;
}

export function getLastOptimization(): EnergyOptimization | null {
  const raw = getSystemState('last_energy_optimization');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as EnergyOptimization;
  } catch {
    return null;
  }
}
