/**
 * Bharti Research Station - Cinematic Industrial Engineering Material System
 * Restrained metallic PBR palette, dedicated highlight/selection/blueprint materials,
 * and zero cross-component highlight contamination.
 */

import * as THREE from 'three';

// 1. Shared High-Performance Industrial PBR Materials Library
export const CINEMATIC_MATERIALS = {
  // Heavy structural frames, generator blocks, main engine castings
  gunmetal: new THREE.MeshStandardMaterial({
    name: 'Cinematic_Gunmetal',
    color: new THREE.Color(0x232c35),
    metalness: 0.92,
    roughness: 0.32,
    envMapIntensity: 1.45,
    side: THREE.DoubleSide
  }),

  // Precision mechanical components, shafts, rotating couplings, pump impellers
  brushedSteel: new THREE.MeshStandardMaterial({
    name: 'Cinematic_BrushedSteel',
    color: new THREE.Color(0x626f7c),
    metalness: 0.95,
    roughness: 0.34,
    envMapIntensity: 1.6,
    side: THREE.DoubleSide
  }),

  // Antenna elevation/azimuth mechanisms, harmonic drives, high-spec fittings
  darkTitanium: new THREE.MeshStandardMaterial({
    name: 'Cinematic_DarkTitanium',
    color: new THREE.Color(0x353e48),
    metalness: 0.94,
    roughness: 0.26,
    envMapIntensity: 1.65,
    side: THREE.DoubleSide
  }),

  // Electrical enclosures, heat sink fins, conduit brackets, structural supports
  aluminum: new THREE.MeshStandardMaterial({
    name: 'Cinematic_Aluminum',
    color: new THREE.Color(0x768594),
    metalness: 0.88,
    roughness: 0.36,
    envMapIntensity: 1.35,
    side: THREE.DoubleSide
  }),

  // Structural skid bases, isolation beds, foundation mounts
  graphite: new THREE.MeshStandardMaterial({
    name: 'Cinematic_Graphite',
    color: new THREE.Color(0x181e25),
    metalness: 0.68,
    roughness: 0.48,
    envMapIntensity: 1.15,
    side: THREE.DoubleSide
  }),

  // Junction boxes, terminal seals, cable runs, instrumentation caps
  darkPlastic: new THREE.MeshStandardMaterial({
    name: 'Cinematic_DarkIndustrialPlastic',
    color: new THREE.Color(0x11161c),
    metalness: 0.12,
    roughness: 0.62,
    envMapIntensity: 0.9,
    side: THREE.DoubleSide
  }),

  // Parabolic dish reflector (high-spec carbon composite with RF reflective coat)
  dishReflector: new THREE.MeshStandardMaterial({
    name: 'Cinematic_DishReflector',
    color: new THREE.Color(0x404b56),
    metalness: 0.96,
    roughness: 0.22,
    envMapIntensity: 1.75,
    side: THREE.DoubleSide
  }),

  // Process & Cooling Pipes (Restrained Deep Slate Blue)
  pipesCoolingBlue: new THREE.MeshStandardMaterial({
    name: 'Cinematic_PipeCoolingBlue',
    color: new THREE.Color(0x1c3552),
    emissive: new THREE.Color(0x0a192a),
    emissiveIntensity: 0.22,
    metalness: 0.84,
    roughness: 0.28,
    envMapIntensity: 1.35,
    side: THREE.DoubleSide
  }),

  // Thermal Energy & High-Temp Exhaust (Restrained Oxide / Cadmium Red)
  pipesThermalRed: new THREE.MeshStandardMaterial({
    name: 'Cinematic_PipeThermalRed',
    color: new THREE.Color(0x522020),
    emissive: new THREE.Color(0x260c0c),
    emissiveIntensity: 0.18,
    metalness: 0.80,
    roughness: 0.30,
    envMapIntensity: 1.25,
    side: THREE.DoubleSide
  }),

  // Fuel, Lubricant, & Hydraulic Lines (Restrained Industrial Bronze / Amber)
  pipesFuelAmber: new THREE.MeshStandardMaterial({
    name: 'Cinematic_PipeFuelAmber',
    color: new THREE.Color(0x4d3919),
    emissive: new THREE.Color(0x221706),
    emissiveIntensity: 0.18,
    metalness: 0.85,
    roughness: 0.27,
    envMapIntensity: 1.35,
    side: THREE.DoubleSide
  }),

  // Facility Modular Floor Panels
  facilityFloor: new THREE.MeshStandardMaterial({
    name: 'Cinematic_FacilityFloor',
    color: new THREE.Color(0x131922),
    metalness: 0.50,
    roughness: 0.40,
    envMapIntensity: 1.1,
    side: THREE.DoubleSide
  }),

  // Architectural Enclosure Outer Walls
  enclosureWalls: new THREE.MeshStandardMaterial({
    name: 'Cinematic_EnclosureWalls',
    color: new THREE.Color(0x1b232e),
    metalness: 0.58,
    roughness: 0.44,
    envMapIntensity: 1.15,
    side: THREE.DoubleSide
  })
};

// 2. Dedicated Interaction Materials (Isolated instances: NEVER shared across unselected objects)
export const HOVER_MATERIAL = new THREE.MeshStandardMaterial({
  name: 'Cinematic_Isolated_Hover',
  color: new THREE.Color(0x2a5477),
  emissive: new THREE.Color(0x00c8e6),
  emissiveIntensity: 0.52,
  metalness: 0.90,
  roughness: 0.25,
  envMapIntensity: 1.8,
  side: THREE.DoubleSide
});

export const SELECTION_MATERIAL = new THREE.MeshStandardMaterial({
  name: 'Cinematic_Isolated_Selected',
  color: new THREE.Color(0x386d99),
  emissive: new THREE.Color(0x00f0ff),
  emissiveIntensity: 0.85,
  metalness: 0.95,
  roughness: 0.20,
  envMapIntensity: 2.2,
  side: THREE.DoubleSide
});

export const BLUEPRINT_MATERIAL = new THREE.MeshStandardMaterial({
  name: 'Cinematic_2D_Blueprint_Theme',
  color: new THREE.Color(0x08263f),
  emissive: new THREE.Color(0x04192b),
  emissiveIntensity: 0.40,
  metalness: 0.15,
  roughness: 0.75,
  transparent: true,
  opacity: 0.22,
  depthWrite: false, // Prevents transparent sorting artifacts / z-fighting
  side: THREE.DoubleSide
});

/**
 * Assigns shared metallic PBR materials systematically across the loaded model.
 */
export function applyCinematicMaterials(model) {
  model.traverse((child) => {
    if (!child.isMesh || child.userData.isPickProxy) return;

    const name = child.name || '';

    // 1. Room Enclosure Shells
    if (name === 'CHP' || name === 'CHP (1)' || name === 'Body210') {
      child.material = CINEMATIC_MATERIALS.facilityFloor;
      child.userData.baseMaterial = CINEMATIC_MATERIALS.facilityFloor;
      return;
    }

    // 2. Piping Networks
    if (/BluePipe/i.test(name)) {
      child.material = CINEMATIC_MATERIALS.pipesCoolingBlue;
      child.userData.baseMaterial = CINEMATIC_MATERIALS.pipesCoolingBlue;
      return;
    }
    if (/RedPipe/i.test(name)) {
      child.material = CINEMATIC_MATERIALS.pipesThermalRed;
      child.userData.baseMaterial = CINEMATIC_MATERIALS.pipesThermalRed;
      return;
    }
    if (/BronzePipe/i.test(name)) {
      child.material = CINEMATIC_MATERIALS.pipesFuelAmber;
      child.userData.baseMaterial = CINEMATIC_MATERIALS.pipesFuelAmber;
      return;
    }

    // 3. Antenna Aperture & Drives
    if (name === 'GeoSphere02') {
      child.material = CINEMATIC_MATERIALS.dishReflector;
      child.userData.baseMaterial = CINEMATIC_MATERIALS.dishReflector;
      return;
    }
    if (/Drive|Motor|Gearbox|LNB|Azimuth|Elevation/i.test(name)) {
      child.material = CINEMATIC_MATERIALS.darkTitanium;
      child.userData.baseMaterial = CINEMATIC_MATERIALS.darkTitanium;
      return;
    }

    // 4. Machinery & Generators
    if (/EngineCore|Alternator|GeneratorSystem/i.test(name)) {
      child.material = CINEMATIC_MATERIALS.gunmetal;
      child.userData.baseMaterial = CINEMATIC_MATERIALS.gunmetal;
      return;
    }
    if (/Bearing|Coupling|Shaft|Pump/i.test(name)) {
      child.material = CINEMATIC_MATERIALS.brushedSteel;
      child.userData.baseMaterial = CINEMATIC_MATERIALS.brushedSteel;
      return;
    }
    if (/Frame|Skid|Support/i.test(name)) {
      child.material = CINEMATIC_MATERIALS.graphite;
      child.userData.baseMaterial = CINEMATIC_MATERIALS.graphite;
      return;
    }
    if (/Cabinet|Box|Control|EBox/i.test(name)) {
      child.material = CINEMATIC_MATERIALS.aluminum;
      child.userData.baseMaterial = CINEMATIC_MATERIALS.aluminum;
      return;
    }

    // 5. Unnamed CAD Bodies & General Hardware
    if (/^Body\d+/i.test(name)) {
      const id = parseInt(name.replace(/\D/g, '') || '0', 10);
      const palette = [
        CINEMATIC_MATERIALS.gunmetal,
        CINEMATIC_MATERIALS.darkTitanium,
        CINEMATIC_MATERIALS.aluminum,
        CINEMATIC_MATERIALS.brushedSteel
      ];
      const selectedMat = palette[id % palette.length];
      child.material = selectedMat;
      child.userData.baseMaterial = selectedMat;
      return;
    }

    // Default fallback to gunmetal
    child.material = CINEMATIC_MATERIALS.gunmetal;
    child.userData.baseMaterial = CINEMATIC_MATERIALS.gunmetal;
  });
}

/**
 * Applies a strictly isolated hover highlight to a mesh without mutating any shared materials.
 */
export function setMeshHoverState(mesh, isHovered, isBlueprintActive = false) {
  if (!mesh) return;

  if (isHovered) {
    mesh.material = HOVER_MATERIAL;
    mesh.renderOrder = 5;
  } else {
    mesh.material = isBlueprintActive ? BLUEPRINT_MATERIAL : (mesh.userData.baseMaterial || CINEMATIC_MATERIALS.gunmetal);
    mesh.renderOrder = isBlueprintActive ? 0 : 0;
  }
}

/**
 * Applies a strictly isolated selection highlight to a component mesh.
 */
export function setMeshSelectionState(mesh, isSelected, isBlueprintActive = false) {
  if (!mesh) return;

  if (isSelected) {
    mesh.material = SELECTION_MATERIAL;
    mesh.renderOrder = 10;
  } else {
    mesh.material = isBlueprintActive ? BLUEPRINT_MATERIAL : (mesh.userData.baseMaterial || CINEMATIC_MATERIALS.gunmetal);
    mesh.renderOrder = isBlueprintActive ? 0 : 0;
  }
}
