export type RelationshipType =
  | 'DRIVES'
  | 'CONNECTS_TO'
  | 'SUPPLIES'
  | 'FEEDS'
  | 'COOLS'
  | 'LUBRICATES'
  | 'CONTROLS'
  | 'MONITORS'
  | 'DEPENDS_ON'
  | 'PART_OF'
  | 'PROTECTS';

export interface TopologyNode {
  id: string; // Canonical component ID e.g., 'C001'
  componentId: string; // e.g., 'C001'
  assetId: string; // e.g., 'A001'
  componentName: string; // e.g., 'Engine — CHP Unit 1'
  componentType: string; // e.g., 'Engine'
  machineId: string; // e.g., 'CHP01'
  machineName: string; // e.g., 'CHP Unit 1'
  roomId: string; // e.g., 'R001'
  cadObjects: string[]; // e.g., ['EngineCore']
  subsystem: string;
  category: string;
}

export interface TopologyEdge {
  source: string; // Source componentId e.g., 'C001'
  target: string; // Target componentId e.g., 'C005'
  relationship: RelationshipType;
  description?: string;
}

export interface TopologyGraph {
  version: string;
  timestamp: string;
  nodes: TopologyNode[];
  edges: TopologyEdge[];
}
