declare module '*generatorInteraction.js' {
  export class GeneratorInteractionManager {
    constructor(scene: any, camera: any, domElement: HTMLElement);
    initGenerators(model: any): void;
    selectMesh(mesh: any): void;
    selectCenterTarget(): void;
    selectByName(name: string): void;
    browseByName(name: string): void;
    clearSelection(): void;
    setControllerActive(active: boolean): void;
    update(delta: number): void;
    dispose(): void;
    interactiveObjects: any[];
    hoveredMesh: any;
    selectedMetadata: any;
    componentManager: any;
  }
  export const MONITORED_ASSET_NAMES: Set<string>;
}

declare module '*materials.js' {
  export const RED_ANOMALY_MATERIAL: any;
  export const YELLOW_STATUS_MATERIAL: any;
  export const GREEN_STATUS_MATERIAL: any;
  export const BLUEPRINT_MATERIAL: any;
  export function setMeshHoverState(mesh: any, hover: boolean, inBlueprintMode?: boolean): void;
  export function setMeshSelectionState(mesh: any, selected: boolean): void;
  export function getStatusMaterialForState(stateKey: string): any;
  export function applyCinematicMaterials(model: any): void;
}

declare module 'animejs/adapters/three' {
  const adapter: any;
  export default adapter;
}

declare module '*.js';
