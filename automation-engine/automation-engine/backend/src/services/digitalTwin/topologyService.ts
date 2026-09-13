import type { TopologyEdge, TopologyGraph, TopologyNode } from '../../types/topologyTypes.js';
import { TOPOLOGY_EDGES, TOPOLOGY_NODES } from './topologyData.js';

export const TOPOLOGY_VERSION = '1.0.0';

export class TopologyService {
  private graph: TopologyGraph | null = null;

  constructor() {
    this.initAndValidateTopology();
  }

  /**
   * Initializes and validates structural topology.
   * Throws explicit log errors if invalid topology structure is detected.
   */
  public initAndValidateTopology(): TopologyGraph {
    const nodeMap = new Map<string, TopologyNode>();
    const errors: string[] = [];

    // 1. Validate Node Uniqueness & Integrity
    for (const node of TOPOLOGY_NODES) {
      if (!node.id || !node.componentId) {
        errors.push(`Invalid node: missing id or componentId (${JSON.stringify(node)})`);
        continue;
      }
      if (nodeMap.has(node.componentId)) {
        errors.push(`Duplicate node componentId detected: '${node.componentId}'`);
      } else {
        nodeMap.set(node.componentId, node);
      }
    }

    // 2. Validate Edge Sources, Targets, and Duplicate Prevention
    const edgeSet = new Set<string>();
    const validEdges: TopologyEdge[] = [];

    for (const edge of TOPOLOGY_EDGES) {
      if (!edge.source || !edge.target || !edge.relationship) {
        errors.push(`Invalid edge definition: ${JSON.stringify(edge)}`);
        continue;
      }

      if (!nodeMap.has(edge.source)) {
        errors.push(`Edge source node '${edge.source}' does not exist in topology nodes.`);
        continue;
      }

      if (!nodeMap.has(edge.target)) {
        errors.push(`Edge target node '${edge.target}' does not exist in topology nodes.`);
        continue;
      }

      const edgeKey = `${edge.source}__${edge.target}__${edge.relationship}`;
      if (edgeSet.has(edgeKey)) {
        errors.push(`Duplicate topology edge detected: '${edgeKey}'`);
        continue;
      }

      edgeSet.add(edgeKey);
      validEdges.push(edge);
    }

    if (errors.length > 0) {
      console.error('[TOPOLOGY ERROR] Topology validation found issues:');
      errors.forEach((err) => console.error(`  - ${err}`));
    } else {
      console.log(
        `✓ [TOPOLOGY] Successfully validated topology v${TOPOLOGY_VERSION} (${TOPOLOGY_NODES.length} nodes, ${validEdges.length} directed edges)`
      );
    }

    this.graph = {
      version: TOPOLOGY_VERSION,
      timestamp: new Date().toISOString(),
      nodes: TOPOLOGY_NODES,
      edges: validEdges,
    };

    return this.graph;
  }

  public getTopology(): TopologyGraph {
    if (!this.graph) {
      return this.initAndValidateTopology();
    }
    return this.graph;
  }

  public getNode(componentId: string): TopologyNode | undefined {
    return this.getTopology().nodes.find(
      (n) => n.componentId === componentId || n.id === componentId || n.assetId === componentId
    );
  }

  public getNodeByCadObject(cadObjectName: string): TopologyNode | undefined {
    if (!cadObjectName) return undefined;
    return this.getTopology().nodes.find((n) => n.cadObjects.includes(cadObjectName));
  }

  public getOutboundEdges(componentId: string): TopologyEdge[] {
    const node = this.getNode(componentId);
    if (!node) return [];
    return this.getTopology().edges.filter((e) => e.source === node.componentId);
  }

  public getInboundEdges(componentId: string): TopologyEdge[] {
    const node = this.getNode(componentId);
    if (!node) return [];
    return this.getTopology().edges.filter((e) => e.target === node.componentId);
  }

  /**
   * Get all directly related nodes (upstream + downstream) with relationship context
   */
  public getRelatedComponents(componentId: string): Array<{
    node: TopologyNode;
    direction: 'OUTBOUND' | 'INBOUND';
    relationship: string;
    description?: string;
  }> {
    const node = this.getNode(componentId);
    if (!node) return [];

    const result: Array<{
      node: TopologyNode;
      direction: 'OUTBOUND' | 'INBOUND';
      relationship: string;
      description?: string;
    }> = [];

    const outbound = this.getOutboundEdges(node.componentId);
    for (const edge of outbound) {
      const targetNode = this.getNode(edge.target);
      if (targetNode) {
        result.push({
          node: targetNode,
          direction: 'OUTBOUND',
          relationship: edge.relationship,
          description: edge.description,
        });
      }
    }

    const inbound = this.getInboundEdges(node.componentId);
    for (const edge of inbound) {
      const sourceNode = this.getNode(edge.source);
      if (sourceNode) {
        result.push({
          node: sourceNode,
          direction: 'INBOUND',
          relationship: edge.relationship,
          description: edge.description,
        });
      }
    }

    return result;
  }
}

export const topologyService = new TopologyService();
