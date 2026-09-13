/**
 * Bharti Research Station - Component Management System
 * Coordinates component registry, physical inspection expansion,
 * isolated 2D blueprint context theme, and live telemetry HUD.
 */

import * as THREE from 'three';
import { SensorManager } from './sensorData.js';
import { ConditionAnalyzer } from './conditionAnalyzer.js';
import { AnimationManager } from './animationManager.js';
import { AnimeAnimationManager } from './animeAnimations.js';
import { resolveComponentMetadata, COMPONENT_METADATA_REGISTRY, FACILITY_ROOMS } from './metadataManager.js';
import { applyCinematicMaterials, CINEMATIC_MATERIALS, SELECTION_MATERIAL, BLUEPRINT_MATERIAL } from './materials.js';

export const COMPONENT_GROUPS = {
  generator1: [
    'Frame', 'EngineCore', 'BearingSystem', 'LubricationSystem', 'CoolingSystem',
    'GeneratorSystem', 'FuelSystem', 'IntakeSystem', 'ExhaustSystem', 'ControlSystem', 'ProtectiveFrame'
  ],
  generator2: [
    'Frame1', 'EngineCore1', 'BearingSystem1', 'LubricationSystem1', 'CoolingSystem1',
    'GeneratorSystem1', 'FuelSystem1', 'IntakeSystem1', 'ExhaustSystem1', 'ControlSystem1', 'ProtectiveFrame1'
  ],
  generator3: [
    'Frame2', 'EngineCore2', 'BearingSystem2', 'LubricationSystem2', 'CoolingSystem2',
    'GeneratorSystem2', 'FuelSystem2', 'IntakeSystem2', 'ExhaustSystem2', 'ControlSystem2', 'ProtectiveFrame2'
  ]
};

export class ComponentManager {
  constructor(scene) {
    this.scene = scene;

    this.componentRegistry = {
      generator1: new Map(),
      generator2: new Map(),
      generator3: new Map()
    };

    this.componentsData = new Map(); // rawName -> compData
    this.allComponentMeshes = [];
    this.sceneMeshes = [];
    this.focusedComponentData = null;
    this.focusedMetadata = null;
    this.facilitySelectedRoot = null;
    this.facilitySelectionMotion = null;

    this.animationManager = new AnimationManager();
    this.animeAnimationManager = new AnimeAnimationManager();
    this.sensorManager = new SensorManager();
    this.conditionAnalyzer = new ConditionAnalyzer(this.sensorManager);

    // DOM Elements for Sensor Panel & HUD
    this.sensorPanel = document.getElementById('sensor-panel');
    this.sensorTitle = document.getElementById('sensor-title');
    this.sensorSubtitle = document.getElementById('sensor-subtitle');
    this.sensorStatusText = document.getElementById('sensor-status-text');
    this.statusDot = document.getElementById('status-dot');
    this.sensorMetrics = document.getElementById('sensor-metrics');

    // Predictive Maintenance HUD Elements
    this.systemHealthText = document.getElementById('system-health-text');
    this.systemHealthDot = document.getElementById('system-health-dot');
    this.healthScoreVal = document.getElementById('health-score-val');
    this.healthBarFill = document.getElementById('health-bar-fill');
    this.conditionStateVal = document.getElementById('condition-state-val');
    this.rulVal = document.getElementById('rul-val');
    this.insightText = document.getElementById('insight-text');

    // Description Card HUD Elements
    this.descriptionCard = document.getElementById('description-card');
    this.descriptionTitle = document.getElementById('description-title');
    this.descriptionSubtitle = document.getElementById('description-subtitle');
    this.descriptionText = document.getElementById('description-text');

    window.triggerTestAnomaly = (target, level = 'WARNING') => {
      const rawName = (typeof target === 'string') ? target : (target?.userData?.rawName || target?.name || 'EngineCore');
      this.conditionAnalyzer.injectTestAnomaly(rawName, level);
      console.log(`[Bharti Test Anomaly] Injected '${level}' on component '${rawName}'`);
    };
  }

  static getCanonicalName(rawName) {
    if (!rawName) return 'Unknown Component';
    if (rawName.startsWith('EngineCore')) return 'Engine Core';
    if (rawName.startsWith('BearingSystem')) return 'Bearing System';
    if (rawName.startsWith('CoolingSystem')) return 'Cooling System';
    if (rawName.startsWith('LubricationSystem')) return 'Lubrication System';
    if (rawName.startsWith('GeneratorSystem')) return 'Generator System';
    if (rawName.startsWith('FuelSystem')) return 'Fuel System';
    if (rawName.startsWith('IntakeSystem')) return 'Intake System';
    if (rawName.startsWith('ExhaustSystem')) return 'Exhaust System';
    if (rawName.startsWith('ControlSystem')) return 'Control System';
    if (rawName.startsWith('ProtectiveFrame')) return 'Protective Frame';
    if (rawName.startsWith('Frame')) return 'Frame';
    return rawName;
  }

  initRegistry(model) {
    this.componentRegistry.generator1.clear();
    this.componentRegistry.generator2.clear();
    this.componentRegistry.generator3.clear();
    this.componentsData.clear();
    this.allComponentMeshes = [];
    this.sceneMeshes = [];
    this.focusedComponentData = null;
    this.focusedMetadata = null;

    // Apply restrained cinematic metallic materials
    applyCinematicMaterials(model);

    const objectMap = new Map();
    model.traverse((child) => {
      if (child.name) {
        objectMap.set(child.name, child);
      }
    });

    // 1. Setup Generator Mechanical Inspection Pivots
    const registerGen = (genKey, genNum, groupNames) => {
      groupNames.forEach((rawName) => {
        if (objectMap.has(rawName)) {
          const groupObj = objectMap.get(rawName);
          const canonicalName = ComponentManager.getCanonicalName(rawName);
          const metadata = resolveComponentMetadata(groupObj);

          this.componentRegistry[genKey].set(rawName, groupObj);

          groupObj.updateMatrixWorld(true);
          const box = new THREE.Box3().setFromObject(groupObj);
          const center = box.getCenter(new THREE.Vector3());

          const parent = groupObj.parent || model;
          const pivot = new THREE.Group();
          pivot.name = `${rawName}_pivot`;
          pivot.position.copy(parent.worldToLocal(center.clone()));
          parent.add(pivot);
          pivot.attach(groupObj);

          const origPos = pivot.position.clone();
          const openPos = origPos.clone().add(new THREE.Vector3(0, 0, 1.0));

          const compData = {
            group: groupObj,
            pivot,
            rawName,
            canonicalName,
            metadata,
            generatorNumber: genNum,
            generatorName: `Generator Unit ${genNum}`,
            originalPosition: origPos,
            openPosition: openPos,
            currentProgress: 0.0,
            targetProgress: 0.0
          };

          this.componentsData.set(rawName, compData);

          groupObj.traverse((child) => {
            if (child.isMesh) {
              child.userData.componentRoot = groupObj;
              child.userData.metadata = metadata;
              child.userData.rawName = rawName;
              this.allComponentMeshes.push(child);
            }
          });
        }
      });
    };

    registerGen('generator1', 1, COMPONENT_GROUPS.generator1);
    registerGen('generator2', 2, COMPONENT_GROUPS.generator2);
    registerGen('generator3', 3, COMPONENT_GROUPS.generator3);

    // 2. Attach Metadata and Telemetry to all other equipment
    const telemetryEntries = [];
    model.traverse((child) => {
      if (!child.isMesh) return;
      this.sceneMeshes.push(child);

      if (!child.userData.metadata) {
        const worldPos = child.getWorldPosition(new THREE.Vector3());
        const metadata = resolveComponentMetadata(child, worldPos);
        child.userData.metadata = metadata;
        child.userData.rawName = child.name;
        child.userData.componentRoot = child;

        if (metadata.telemetryEnabled) {
          telemetryEntries.push({
            rawName: child.name,
            canonicalName: metadata.telemetryType || 'Frame'
          });
        }
      }
    });

    this.sensorManager.registerNamedInstances(telemetryEntries);
  }

  /**
   * Helper checking if child is equal to or a descendant of root
   */
  isDescendantOf(child, root) {
    if (!child || !root) return false;
    if (child === root) return true;
    let curr = child.parent;
    while (curr) {
      if (curr === root) return true;
      curr = curr.parent;
    }
    return false;
  }

  /**
   * Swaps all unselected equipment to the 2D Blueprint Theme,
   * while keeping the selected component 100% SOLID with glowing cyan highlight.
   */
  setBlueprintContext(activeRoot) {
    if (!activeRoot) return;

    this.sceneMeshes.forEach((mesh) => {
      const isSelected = this.isDescendantOf(mesh, activeRoot);

      if (isSelected) {
        // Selected component is SOLID, METALLIC, with glowing cyan focus highlight
        mesh.material = SELECTION_MATERIAL;
        mesh.renderOrder = 10;
      } else {
        // All other components become the translucent 2D blueprint drafting wireframe/x-ray context
        mesh.material = BLUEPRINT_MATERIAL;
        mesh.renderOrder = 0;
      }
    });
  }

  /**
   * Restores all equipment to their original metallic PBR materials.
   */
  restoreCinematicContext() {
    this.sceneMeshes.forEach((mesh) => {
      mesh.material = mesh.userData.baseMaterial || CINEMATIC_MATERIALS.gunmetal;
      mesh.renderOrder = 0;
    });
  }

  setInspectionLight(root) {
    if (this.inspectionLight) this.scene.remove(this.inspectionLight);
    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    const radius = Math.max(3.5, box.getSize(new THREE.Vector3()).length() * 1.4);

    this.inspectionLight = new THREE.PointLight(0x00f0ff, 3.2, radius * 3.5, 2);
    this.inspectionLight.position.copy(center).add(new THREE.Vector3(radius * 0.45, radius * 0.7, radius * 0.55));
    this.scene.add(this.inspectionLight);
  }

  clearInspectionLight() {
    if (this.inspectionLight) {
      this.scene.remove(this.inspectionLight);
      this.inspectionLight = null;
    }
  }

  /**
   * Expand / Lift facility component that is not part of a generator
   */
  beginFacilitySelectionLift(root) {
    this.clearFacilitySelectionLift();
    if (!root) return;

    root.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(root);
    const size = bounds.getSize(new THREE.Vector3()).length();
    const liftAmount = THREE.MathUtils.clamp(size * 0.28, 2.0, 6.0);

    const basePosition = root.position.clone();
    const baseScale = root.scale.clone();

    // Lift along world +Y (in parent local coordinates)
    const worldTarget = root.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, liftAmount, 0));
    const targetPosition = root.parent ? root.parent.worldToLocal(worldTarget) : worldTarget;
    const targetScale = baseScale.clone().multiplyScalar(1.08);

    this.facilitySelectionMotion = {
      root,
      basePosition,
      targetPosition,
      baseScale,
      targetScale,
      progress: 0,
      direction: 1 // 1 = expanding, -1 = collapsing
    };
  }

  clearFacilitySelectionLift() {
    if (this.facilitySelectionMotion) {
      const m = this.facilitySelectionMotion;
      m.root.position.copy(m.basePosition);
      m.root.scale.copy(m.baseScale);
      this.facilitySelectionMotion = null;
    }
  }

  /**
   * Set focused component on click selection.
   * Handles both generator components and facility components with physical expansion & blueprint context.
   */
  setFocusedComponent(target) {
    if (!target) {
      // Clear selection
      if (this.focusedComponentData) {
        const activeGenNum = this.focusedComponentData.generatorNumber || 1;
        const genKey = `generator${activeGenNum}`;
        const genGroupNames = COMPONENT_GROUPS[genKey] || [];
        const genCompMap = new Map();
        genGroupNames.forEach((rawName) => {
          if (this.componentsData.has(rawName)) {
            genCompMap.set(rawName, this.componentsData.get(rawName));
          }
        });
        this.animeAnimationManager.exitInspectionMode(genCompMap);
        this.focusedComponentData = null;
      }

      this.clearFacilitySelectionLift();
      this.facilitySelectedRoot = null;
      this.focusedMetadata = null;
      this.restoreCinematicContext();
      this.clearInspectionLight();
      this.hideSensorPanel();
      return;
    }

    // Resolve target and metadata
    let compRoot = target.userData?.componentRoot || target;
    const rawName = target.userData?.rawName || target.name;
    const isGenComp = this.componentsData.has(rawName);

    // If target has a generator compData mapped by name or root
    let targetCompData = isGenComp ? this.componentsData.get(rawName) : null;
    if (!targetCompData) {
      for (const comp of this.componentsData.values()) {
        if (comp.group === target || comp.pivot === target || this.isDescendantOf(target, comp.group)) {
          targetCompData = comp;
          compRoot = comp.group;
          break;
        }
      }
    }

    const metadata = target.userData?.metadata || resolveComponentMetadata(target);
    this.focusedMetadata = metadata;

    // Clear previous facility lift if switching
    this.clearFacilitySelectionLift();

    if (targetCompData) {
      // === GENERATOR SUBSYSTEM EXPANSION ===
      this.focusedComponentData = targetCompData;
      this.facilitySelectedRoot = targetCompData.group;

      const activeGenNum = targetCompData.generatorNumber;
      const genKey = `generator${activeGenNum}`;
      const genGroupNames = COMPONENT_GROUPS[genKey] || [];
      const genCompMap = new Map();
      genGroupNames.forEach((name) => {
        if (this.componentsData.has(name)) {
          genCompMap.set(name, this.componentsData.get(name));
        }
      });

      // 1. Anime.js Mechanical Extraction (pulls component out forward & up)
      this.animeAnimationManager.enterInspectionMode(targetCompData.group, targetCompData, genCompMap);

      // 2. Blueprint context: selected component remains SOLID, all else becomes 2D Blueprint
      this.setBlueprintContext(targetCompData.group);
      this.setInspectionLight(targetCompData.group);
    } else {
      // === GENERAL FACILITY EQUIPMENT EXPANSION ===
      if (this.focusedComponentData) {
        const activeGenNum = this.focusedComponentData.generatorNumber || 1;
        const genKey = `generator${activeGenNum}`;
        const genGroupNames = COMPONENT_GROUPS[genKey] || [];
        const genCompMap = new Map();
        genGroupNames.forEach((name) => {
          if (this.componentsData.has(name)) {
            genCompMap.set(name, this.componentsData.get(name));
          }
        });
        this.animeAnimationManager.exitInspectionMode(genCompMap);
        this.focusedComponentData = null;
      }

      this.facilitySelectedRoot = compRoot;

      // 1. Physical Expansion Lift & Scale
      this.beginFacilitySelectionLift(compRoot);

      // 2. Blueprint context: selected component remains SOLID, all else becomes 2D Blueprint
      this.setBlueprintContext(compRoot);
      this.setInspectionLight(compRoot);
    }

    this.showSensorPanel(metadata);
  }

  showSensorPanel(metadata) {
    if (!metadata) return;

    if (this.sensorPanel) {
      const data = this.sensorManager.getSensorData(metadata.objectName);

      if (this.sensorTitle) this.sensorTitle.textContent = metadata.displayName;
      if (this.sensorSubtitle) this.sensorSubtitle.textContent = `${metadata.room} · ${metadata.subsystem}`;

      if (this.sensorMetrics) {
        this.sensorMetrics.innerHTML = data.metrics.map(m => `
          <div class="metric-row" data-metric-label="${m.label}">
            <span class="metric-label">${m.label}</span>
            <span class="metric-value">${m.value}</span>
          </div>
        `).join('');
      }

      this.updateSensorPanelUI();
      this.sensorPanel.classList.remove('hidden');
    }

    if (this.descriptionCard) {
      if (this.descriptionTitle) this.descriptionTitle.textContent = metadata.displayName;
      if (this.descriptionSubtitle) this.descriptionSubtitle.textContent = `${metadata.category} · ${metadata.subsystem}`;
      if (this.descriptionText) this.descriptionText.textContent = metadata.description;
      this.descriptionCard.classList.remove('hidden');
    }
  }

  hideSensorPanel() {
    if (this.sensorPanel) this.sensorPanel.classList.add('hidden');
    if (this.descriptionCard) this.descriptionCard.classList.add('hidden');
  }

  updateSensorPanelUI() {
    if (!this.sensorPanel || this.sensorPanel.classList.contains('hidden') || !this.focusedMetadata) return;

    const rawName = this.focusedMetadata.objectName;
    const data = this.sensorManager.getSensorData(rawName);
    const analysis = this.conditionAnalyzer.analyzeComponent(rawName);

    const displayStatus = analysis.anomalyLevel !== 'NORMAL' ? analysis.anomalyLevel : data.status;
    if (this.sensorStatusText && this.sensorStatusText.textContent !== displayStatus) {
      this.sensorStatusText.textContent = displayStatus;
    }

    if (this.statusDot) {
      if (analysis.anomalyLevel === 'CRITICAL') {
        this.statusDot.style.backgroundColor = '#ef4444';
        this.statusDot.style.boxShadow = '0 0 8px #ef4444';
      } else if (analysis.anomalyLevel === 'WARNING') {
        this.statusDot.style.backgroundColor = '#f59e0b';
        this.statusDot.style.boxShadow = '0 0 8px #f59e0b';
      } else if (analysis.anomalyLevel === 'WATCH') {
        this.statusDot.style.backgroundColor = '#38bdf8';
        this.statusDot.style.boxShadow = '0 0 8px #38bdf8';
      } else {
        this.statusDot.style.backgroundColor = '#10b981';
        this.statusDot.style.boxShadow = '0 0 8px #10b981';
      }
    }

    if (this.sensorMetrics) {
      data.metrics.forEach(m => {
        const row = this.sensorMetrics.querySelector(`.metric-row[data-metric-label="${CSS.escape(m.label)}"]`);
        if (row) {
          const valElem = row.querySelector('.metric-value');
          if (valElem && valElem.textContent !== m.value) {
            valElem.textContent = m.value;
          }
        }
      });
    }

    if (this.healthScoreVal) this.healthScoreVal.textContent = `${analysis.healthScore}%`;
    if (this.healthBarFill) {
      this.healthBarFill.style.width = `${analysis.healthScore}%`;
      if (analysis.healthScore < 40) {
        this.healthBarFill.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
      } else if (analysis.healthScore < 65) {
        this.healthBarFill.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
      } else if (analysis.healthScore < 85) {
        this.healthBarFill.style.background = 'linear-gradient(90deg, #38bdf8, #818cf8)';
      } else {
        this.healthBarFill.style.background = 'linear-gradient(90deg, #10b981, #38bdf8)';
      }
    }

    if (this.conditionStateVal) {
      this.conditionStateVal.textContent = analysis.conditionState;
      if (analysis.anomalyLevel === 'CRITICAL') this.conditionStateVal.style.color = '#ef4444';
      else if (analysis.anomalyLevel === 'WARNING') this.conditionStateVal.style.color = '#f59e0b';
      else if (analysis.anomalyLevel === 'WATCH') this.conditionStateVal.style.color = '#38bdf8';
      else this.conditionStateVal.style.color = '#10b981';
    }

    if (this.rulVal) this.rulVal.textContent = analysis.simulatedRUL;
    if (this.insightText) this.insightText.textContent = analysis.recommendation;
  }

  updateSystemHealthUI() {
    if (!this.systemHealthText) return;

    const globalHealth = this.conditionAnalyzer.getGlobalSystemHealth();
    const statusText = globalHealth.systemStatus;

    this.systemHealthText.innerHTML = `STATION SYSTEM HEALTH ${globalHealth.systemHealthScore}% &bull; ${statusText}`;

    if (this.systemHealthDot) {
      if (statusText === 'CRITICAL') {
        this.systemHealthDot.style.backgroundColor = '#ef4444';
        this.systemHealthDot.style.boxShadow = '0 0 6px #ef4444';
      } else if (statusText === 'WARNING') {
        this.systemHealthDot.style.backgroundColor = '#f59e0b';
        this.systemHealthDot.style.boxShadow = '0 0 6px #f59e0b';
      } else if (statusText === 'WATCH') {
        this.systemHealthDot.style.backgroundColor = '#38bdf8';
        this.systemHealthDot.style.boxShadow = '0 0 6px #38bdf8';
      } else {
        this.systemHealthDot.style.backgroundColor = '#10b981';
        this.systemHealthDot.style.boxShadow = '0 0 6px #10b981';
      }
    }
  }

  update(delta) {
    // 1. Animate Facility Expansion Lift smoothly
    if (this.facilitySelectionMotion) {
      const m = this.facilitySelectionMotion;
      m.progress = Math.min(1, m.progress + delta * 4.5);
      const eased = 1 - Math.pow(1 - m.progress, 3); // ease-out cubic
      m.root.position.lerpVectors(m.basePosition, m.targetPosition, eased);
      m.root.scale.lerpVectors(m.baseScale, m.targetScale, eased);
    }

    // 2. Drive Sensor & Condition Telemetry
    this.animationManager.update(delta);
    this.sensorManager.update(delta);
    this.updateSensorPanelUI();
    this.updateSystemHealthUI();
  }
}
