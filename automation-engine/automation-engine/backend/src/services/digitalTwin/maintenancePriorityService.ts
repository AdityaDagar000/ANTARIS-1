import type { MaintenanceTicket, Prediction, Priority } from '../../types/index.js';
import type { RelationshipType, TopologyNode } from '../../types/topologyTypes.js';
import { topologyService } from './topologyService.js';

const PRIORITY_RANK: Record<Priority, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

const ENABLING_RELATIONSHIPS: Set<RelationshipType> = new Set([
  'DRIVES',
  'FEEDS',
  'SUPPLIES',
  'COOLS',
  'LUBRICATES',
  'CONTROLS',
]);

const CATEGORY_WEIGHT: Record<string, number> = {
  'Thermal Prime Mover': 18,
  'Synchronous Alternator': 16,
  'Fluid Handling': 10,
  'Thermal Management': 12,
  'Fuel Feed': 11,
  'Mechanical Support': 8,
};

export interface OperationalCriticality {
  componentId: string;
  componentName: string;
  score: number;
  graphRank: number;
  dependentCount: number;
  enablesCount: number;
  operationalRole: string;
  impactedComponents: string[];
}

export interface MaintenanceRanking {
  componentId: string;
  componentName: string;
  mlPriority: Priority;
  effectivePriority: Priority;
  operationalCriticality: number;
  compositeScore: number;
  maintenanceOrder: number;
  rationale: string;
}

function bumpPriority(priority: Priority, steps: number): Priority {
  const order: Priority[] = ['Low', 'Medium', 'High', 'Critical'];
  const idx = Math.min(order.length - 1, Math.max(0, order.indexOf(priority) + steps));
  return order[idx];
}

function computeStaticCriticality(): Map<string, OperationalCriticality> {
  const graph = topologyService.getTopology();
  const scores = new Map<string, OperationalCriticality>();

  for (const node of graph.nodes) {
    const inboundDepends = graph.edges.filter(
      (e) => e.target === node.componentId && e.relationship === 'DEPENDS_ON'
    );
    const outboundEnables = graph.edges.filter(
      (e) =>
        e.source === node.componentId &&
        (ENABLING_RELATIONSHIPS.has(e.relationship) || e.relationship === 'DRIVES')
    );

    const dependentCount = inboundDepends.length;
    const enablesCount = outboundEnables.length;
    const categoryBonus = CATEGORY_WEIGHT[node.category] ?? 6;

    let score =
      dependentCount * 14 +
      enablesCount * 10 +
      categoryBonus +
      (node.subsystem.toLowerCase().includes('power') ? 8 : 0);

    score = Math.min(100, Math.round(score));

    let operationalRole = 'Supporting asset';
    if (dependentCount >= 2 && enablesCount >= 1) {
      operationalRole = 'Critical hub — multiple systems depend on this asset';
    } else if (dependentCount >= 2) {
      operationalRole = 'High dependency target — downstream equipment relies on this unit';
    } else if (enablesCount >= 2) {
      operationalRole = 'Prime mover / supply node — enables multiple downstream assets';
    } else if (enablesCount === 1) {
      operationalRole = 'Upstream enabler — feeds or drives a downstream asset';
    }

    const impactedComponents = outboundEnables
      .map((e) => graph.nodes.find((n) => n.componentId === e.target)?.componentName)
      .filter(Boolean) as string[];

    scores.set(node.componentId, {
      componentId: node.componentId,
      componentName: node.componentName,
      score,
      graphRank: 0,
      dependentCount,
      enablesCount,
      operationalRole,
      impactedComponents,
    });
  }

  const ranked = [...scores.values()].sort((a, b) => b.score - a.score);
  ranked.forEach((entry, index) => {
    entry.graphRank = index + 1;
    scores.set(entry.componentId, entry);
  });

  return scores;
}

let criticalityCache: Map<string, OperationalCriticality> | null = null;

function getCriticalityMap(): Map<string, OperationalCriticality> {
  if (!criticalityCache) {
    criticalityCache = computeStaticCriticality();
  }
  return criticalityCache;
}

export function getOperationalCriticality(componentId: string): OperationalCriticality | null {
  const node = topologyService.getNode(componentId);
  if (!node) return null;
  return getCriticalityMap().get(node.componentId) ?? null;
}

export function getOperationalCriticalityByCadObject(cadObjectName: string): OperationalCriticality | null {
  const node = topologyService.getNodeByCadObject(cadObjectName);
  if (!node) return null;
  return getOperationalCriticality(node.componentId);
}

export function resolveEffectivePriority(mlPriority: Priority, componentId: string): {
  effectivePriority: Priority;
  rationale: string;
  criticality: OperationalCriticality | null;
} {
  const criticality = getOperationalCriticality(componentId);
  if (!criticality) {
    return {
      effectivePriority: mlPriority,
      rationale: 'ML-derived priority (no topology node mapped for this component)',
      criticality: null,
    };
  }

  let effectivePriority = mlPriority;
  let rationale = `ML priority ${mlPriority}`;

  if (criticality.score >= 75 && PRIORITY_RANK[mlPriority] > PRIORITY_RANK.High) {
    effectivePriority = bumpPriority(mlPriority, 2);
    rationale = `Elevated to ${effectivePriority}: operational criticality ${criticality.score}/100 (${criticality.operationalRole})`;
  } else if (criticality.score >= 55 && PRIORITY_RANK[mlPriority] > PRIORITY_RANK.Medium) {
    effectivePriority = bumpPriority(mlPriority, 1);
    rationale = `Elevated to ${effectivePriority}: dependency graph rank #${criticality.graphRank} (score ${criticality.score})`;
  } else if (criticality.dependentCount >= 2) {
    rationale = `Maintained ${mlPriority}: ${criticality.dependentCount} dependent systems (graph rank #${criticality.graphRank})`;
  } else {
    rationale = `Maintained ${mlPriority}: topology score ${criticality.score}/100`;
  }

  return { effectivePriority, rationale, criticality };
}

function compositeUrgencyScore(
  effectivePriority: Priority,
  criticalityScore: number,
  rul?: number,
  healthScore?: number
): number {
  const priorityPart = (4 - PRIORITY_RANK[effectivePriority]) * 100;
  const criticalityPart = criticalityScore * 0.85;
  const rulPart = rul !== undefined ? Math.max(0, 120 - rul) : 40;
  const healthPart = healthScore !== undefined ? 100 - healthScore : 30;
  return priorityPart + criticalityPart + rulPart * 0.35 + healthPart * 0.25;
}

export function rankPredictionsForMaintenance(predictions: Prediction[]): Prediction[] {
  const maintenance = predictions.filter((p) =>
    p.healthStatus === 'Degradation to Failure' || p.healthStatus === 'Fault'
  );
  const other = predictions.filter(
    (p) => p.healthStatus !== 'Degradation to Failure' && p.healthStatus !== 'Fault'
  );

  const sortedMaintenance = [...maintenance].sort((a, b) => {
    const aEff = resolveEffectivePriority(a.priority || 'Medium', a.componentId);
    const bEff = resolveEffectivePriority(b.priority || 'Medium', b.componentId);
    const aScore = compositeUrgencyScore(
      aEff.effectivePriority,
      aEff.criticality?.score ?? 0,
      a.rul,
      a.healthScore
    );
    const bScore = compositeUrgencyScore(
      bEff.effectivePriority,
      bEff.criticality?.score ?? 0,
      b.rul,
      b.healthScore
    );
    return bScore - aScore;
  });

  return [...sortedMaintenance, ...other];
}

export function buildMaintenanceRanking(
  componentId: string,
  componentName: string,
  mlPriority: Priority,
  rul?: number,
  healthScore?: number
): MaintenanceRanking {
  const { effectivePriority, rationale, criticality } = resolveEffectivePriority(mlPriority, componentId);
  const compositeScore = compositeUrgencyScore(
    effectivePriority,
    criticality?.score ?? 0,
    rul,
    healthScore
  );

  return {
    componentId,
    componentName,
    mlPriority,
    effectivePriority,
    operationalCriticality: criticality?.score ?? 0,
    compositeScore,
    maintenanceOrder: 0,
    rationale,
  };
}

export function rankOpenTickets(tickets: MaintenanceTicket[]): MaintenanceRanking[] {
  const open = tickets.filter((t) => !['Resolved', 'Closed'].includes(t.status));
  const rankings = open.map((t) =>
    buildMaintenanceRanking(t.componentId, t.componentName, t.priority)
  );

  rankings.sort((a, b) => b.compositeScore - a.compositeScore);
  rankings.forEach((r, i) => {
    r.maintenanceOrder = i + 1;
  });

  return rankings;
}

export function sortTicketsByMaintenancePriority(tickets: MaintenanceTicket[]): MaintenanceTicket[] {
  const ranking = rankOpenTickets(tickets);
  const orderMap = new Map(ranking.map((r) => [r.componentId, r.maintenanceOrder]));

  return [...tickets].sort((a, b) => {
    const aOpen = !['Resolved', 'Closed'].includes(a.status);
    const bOpen = !['Resolved', 'Closed'].includes(b.status);
    if (aOpen && bOpen) {
      const aOrder = orderMap.get(a.componentId) ?? 999;
      const bOrder = orderMap.get(b.componentId) ?? 999;
      if (aOrder !== bOrder) return aOrder - bOrder;
    }
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export function listAllCriticality(): OperationalCriticality[] {
  return [...getCriticalityMap().values()].sort((a, b) => b.score - a.score);
}

export function resolveNodeForTwinSelection(
  componentId?: string,
  cadObjectName?: string
): TopologyNode | undefined {
  if (componentId) {
    return topologyService.getNode(componentId);
  }
  if (cadObjectName) {
    return topologyService.getNodeByCadObject(cadObjectName);
  }
  return undefined;
}
