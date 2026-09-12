import * as THREE from 'three';

/**
 * Centralized AnimationManager for Phase 4 Functional Component Animations
 */
export class AnimationManager {
  constructor() {
    this.activeComponentData = null;
    this.animationTime = 0;
  }

  /**
   * Set currently active component for functional animation
   * @param {Object|null} compData 
   */
  setActiveComponent(compData) {
    if (this.activeComponentData === compData) return;
    this.activeComponentData = compData;
    this.animationTime = 0;
  }

  /**
   * Frame update called from main render loop
   * Note: Do NOT overwrite pivot.position here, as AnimeAnimationManager
   * controls component inspection extraction and expansion transitions.
   * @param {number} delta 
   */
  update(delta) {
    if (!this.activeComponentData) return;
    this.animationTime += delta;
  }
}
