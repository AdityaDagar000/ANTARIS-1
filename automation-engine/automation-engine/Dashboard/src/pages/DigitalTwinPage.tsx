import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GeneratorInteractionManager } from '../digitalTwin/generatorInteraction.js';
import { RED_ANOMALY_MATERIAL } from '../digitalTwin/materials.js';
import { engine } from 'animejs';
import '../digitalTwin/style.css';

export const DigitalTwinPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animFrameId: number;
    let isDisposed = false;

    // Anime.js loop sync
    try {
      (engine as any).useDefaultMainLoop = false;
    } catch (e) {}

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b14);
    scene.fog = new THREE.FogExp2(0x070b14, 0.0006);

    // 2. Camera Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.1,
      10000
    );
    camera.position.set(50, 50, 50);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.32;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const QUALITY_LEVELS = ['HIGH', 'MED', 'LOW'] as const;
    let currentQuality: (typeof QUALITY_LEVELS)[number] = 'HIGH';

    const applyQualitySettings = (quality: string) => {
      currentQuality = (QUALITY_LEVELS.includes(quality as (typeof QUALITY_LEVELS)[number])
        ? quality
        : 'HIGH') as (typeof QUALITY_LEVELS)[number];
      if (currentQuality === 'HIGH') {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      } else if (currentQuality === 'MED') {
        renderer.setPixelRatio(1.0);
      } else {
        renderer.setPixelRatio(0.85);
      }
      uiContainerRef.current?.querySelectorAll('.quality-btn').forEach((b) => {
        b.classList.toggle('active', (b as HTMLElement).dataset.quality === currentQuality);
      });
    };

    // 4. Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const studioEnvironment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = studioEnvironment;
    pmremGenerator.dispose();

    // 5. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 1.5;
    controls.maxDistance = 5000;
    controls.enableDblClick = false;

    // 6. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x203248, 0.85);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x070b14, 0.65);
    hemiLight.position.set(0, 500, 0);
    scene.add(hemiLight);

    const mainLight = new THREE.DirectionalLight(0xf8fafc, 1.45);
    mainLight.position.set(300, 500, 400);
    scene.add(mainLight);

    const inspectionFill = new THREE.DirectionalLight(0xffd6b0, 0.45);
    inspectionFill.position.set(-180, 220, 120);
    scene.add(inspectionFill);

    const rimLight1 = new THREE.DirectionalLight(0x38bdf8, 1.35);
    rimLight1.position.set(-300, 320, -300);
    scene.add(rimLight1);

    const rimLight2 = new THREE.DirectionalLight(0x0284c7, 1.0);
    rimLight2.position.set(-200, -80, 300);
    scene.add(rimLight2);

    const warmLight1 = new THREE.PointLight(0xfde047, 0.75, 450);
    warmLight1.position.set(150, 100, -150);
    scene.add(warmLight1);

    const warmLight2 = new THREE.PointLight(0xf59e0b, 0.65, 450);
    warmLight2.position.set(-150, 120, 150);
    scene.add(warmLight2);

    // Wall Light Fixtures Group
    const wallLightGroup = new THREE.Group();
    wallLightGroup.name = 'IndustrialWallLights';
    const casingGeo = new THREE.BoxGeometry(0.9, 0.45, 0.2);
    const casingMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.25 });
    const lensGeo = new THREE.BoxGeometry(0.78, 0.32, 0.1);
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      emissive: new THREE.Color(0xff9e00),
      emissiveIntensity: 4.2,
      metalness: 0.1,
      roughness: 0.15,
    });

    const createWallFixture = (x: number, y: number, z: number, rotY: number) => {
      const fixture = new THREE.Group();
      fixture.position.set(x, y, z);
      fixture.rotation.y = rotY;
      const casing = new THREE.Mesh(casingGeo, casingMat);
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.position.z = 0.08;
      fixture.add(casing);
      fixture.add(lens);
      return fixture;
    };

    const fixturePositions = [
      { x: -24.2, y: 4.2, z: -9.0, rotY: Math.PI / 2 },
      { x: -24.2, y: 4.2, z: 0.0, rotY: Math.PI / 2 },
      { x: -24.2, y: 4.2, z: 9.0, rotY: Math.PI / 2 },
      { x: -18.0, y: 4.2, z: -14.2, rotY: 0 },
      { x: -10.0, y: 4.2, z: -14.2, rotY: 0 },
      { x: -2.0, y: 4.2, z: -14.2, rotY: 0 },
      { x: -18.0, y: 4.2, z: 14.2, rotY: Math.PI },
      { x: -10.0, y: 4.2, z: 14.2, rotY: Math.PI },
      { x: -2.0, y: 4.2, z: 14.2, rotY: Math.PI },
      { x: 4.2, y: 4.2, z: 0.0, rotY: -Math.PI / 2 },
    ];

    fixturePositions.forEach((pos) => {
      wallLightGroup.add(createWallFixture(pos.x, pos.y, pos.z, pos.rotY));
    });
    scene.add(wallLightGroup);

    // State Variables
    const clock = new THREE.Clock();
    let generatorInteractionManager: GeneratorInteractionManager | null = null;
    let cameraFocus: any = null;
    let homeCameraState: any = null;

    const _tempVecA = new THREE.Vector3();
    const _tempVecB = new THREE.Vector3();
    const _tempBox = new THREE.Box3();

    // DOM Overlays Progress Handler
    const updateProgress = (percent: number, text: string) => {
      const progressBar = document.getElementById('progress-bar');
      const loadingStatus = document.getElementById('loading-status');
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (loadingStatus) loadingStatus.textContent = text;
    };

    // Quality selector listeners
    const qualityBtns = uiContainerRef.current?.querySelectorAll('.quality-btn');
    qualityBtns?.forEach((btn) => {
      btn.addEventListener('click', () => {
        const q = (btn as HTMLElement).dataset.quality || 'HIGH';
        applyQualitySettings(q);
      });
    });

    // Component Status Button
    const componentStatusBtn = document.getElementById('component-status-btn');
    componentStatusBtn?.addEventListener('click', () => {
      generatorInteractionManager?.componentManager?.toggleAnomalyView();
    });

    // Debug Button
    const debugBtn = document.getElementById('debug-toggle-btn');
    let debugModeActive = false;
    debugBtn?.addEventListener('click', () => {
      debugModeActive = !debugModeActive;
      const debugHud = document.getElementById('debug-hud');
      debugHud?.classList.toggle('hidden', !debugModeActive);
      debugBtn.classList.toggle('active', debugModeActive);
    });

    // Sidebar Navigator Buttons
    const assetButtons = Array.from(uiContainerRef.current?.querySelectorAll('[data-asset]') || []);
    let assetCursor = -1;

    const setAssetCursor = (index: number) => {
      if (!assetButtons.length) return;
      assetCursor = (index + assetButtons.length) % assetButtons.length;
      assetButtons.forEach((b, i) => b.classList.toggle('is-controller-active', i === assetCursor));
      const activeBtn = assetButtons[assetCursor] as HTMLElement;
      const group = activeBtn.closest('details');
      if (group) group.open = true;
      activeBtn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      generatorInteractionManager?.browseByName(activeBtn.dataset.asset);
    };

    assetButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        assetCursor = index;
        assetButtons.forEach((b, i) => b.classList.toggle('is-controller-active', i === assetCursor));
        const assetName = (button as HTMLElement).dataset.asset;
        if (assetName) generatorInteractionManager?.selectByName(assetName);
      });
    });

    // Selection Event Listener
    const handleTwinSelection = (event: any) => {
      const chip = document.getElementById('selection-chip');
      const chipText = document.getElementById('selection-text');
      const { component, metadata, locked } = event.detail;

      if (!component || !locked) {
        if (chip) chip.classList.remove('is-locked');
        if (chipText) chipText.textContent = 'BHARTI RESEARCH STATION · DIGITAL TWIN READY';
        assetButtons.forEach((b) => b.classList.remove('is-controller-active'));
        assetCursor = -1;

        if (homeCameraState) {
          cameraFocus = {
            startPosition: camera.position.clone(),
            startTarget: controls.target.clone(),
            targetPosition: homeCameraState.position.clone(),
            target: homeCameraState.target.clone(),
            progress: 0,
          };
        } else {
          cameraFocus = null;
        }
        return;
      }

      const title = metadata?.displayName || component.name;
      if (chip) chip.classList.add('is-locked');
      if (chipText) chipText.textContent = `${title.toUpperCase()} / INSPECTION LOCKED`;

      _tempBox.setFromObject(component);
      const target = _tempBox.getCenter(_tempVecA).clone();
      const size = _tempBox.getSize(_tempVecB).length() || 6;
      const direction = camera.position.clone().sub(controls.target).normalize();

      cameraFocus = {
        startPosition: camera.position.clone(),
        startTarget: controls.target.clone(),
        target: target.clone(),
        targetPosition: target.clone().add(direction.multiplyScalar(Math.max(size * 2.2, 11))),
        progress: 0,
      };
    };

    window.addEventListener('digital-twin-selection', handleTwinSelection);

    // Keyboard Shortcuts Listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '~' || e.key === '`') {
        debugModeActive = !debugModeActive;
        const debugHud = document.getElementById('debug-hud');
        debugHud?.classList.toggle('hidden', !debugModeActive);
        debugBtn?.classList.toggle('active', debugModeActive);
      }
      if (e.key === '!' || e.key === '1') {
        generatorInteractionManager?.componentManager?.toggleAnomalyView();
      }
      if (e.key === 'ArrowDown') setAssetCursor(assetCursor + 1);
      if (e.key === 'ArrowUp') setAssetCursor(assetCursor - 1);
      if (e.key === 'Enter' && assetCursor >= 0) {
        (assetButtons[assetCursor] as HTMLElement)?.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 7. Load GLTF + Draco Model
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/assets/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.setPath('/assets/models/');

    updateProgress(15, 'Loading compressed facility geometry...');

    gltfLoader.load(
      'DIGITAL_TWIN.glb',
      (gltf: any) => {
        if (isDisposed) return;
        console.log('✓ [DigitalTwinPage] DIGITAL_TWIN.glb loaded successfully.');
        updateProgress(85, 'Initializing PBR materials & two-stage picking index...');

        const object = gltf.scene;
        object.rotation.x = -Math.PI / 2;

        object.traverse((child: any) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
            child.frustumCulled = true;
            if ((child as THREE.Mesh).geometry?.attributes?.position) {
              (child as THREE.Mesh).geometry.computeVertexNormals();
            }
          }
        });

        scene.add(object);
        object.updateMatrixWorld(true);

        generatorInteractionManager = new GeneratorInteractionManager(scene, camera, renderer.domElement);
        generatorInteractionManager.initGenerators(object);

        const boundingBox = new THREE.Box3().setFromObject(object);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraDistance = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 1.08;

        camera.position.set(
          center.x + cameraDistance * 0.58,
          center.y + cameraDistance * 0.72,
          center.z + cameraDistance * 0.58
        );
        camera.near = maxDim / 1000;
        camera.far = maxDim * 100;
        camera.updateProjectionMatrix();

        controls.target.copy(center);
        controls.update();
        homeCameraState = { position: camera.position.clone(), target: controls.target.clone() };

        updateProgress(100, 'Digital Twin Initialized');
        setTimeout(() => {
          const overlay = document.getElementById('loading-overlay');
          if (overlay) overlay.classList.add('hidden');
        }, 450);
      },
      (xhr: any) => {
        if (xhr.lengthComputable && xhr.total > 0) {
          const percent = Math.min(85, Math.round(15 + (xhr.loaded / xhr.total) * 70));
          updateProgress(percent, `Loading facility model...`);
        } else {
          updateProgress(50, 'Loading compressed facility geometry...');
        }
      },
      (error: any) => {
        console.error('[Digital Twin Load Error]', error);
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.classList.add('hidden');
        const errOverlay = document.getElementById('error-overlay');
        if (errOverlay) errOverlay.classList.remove('hidden');
      }
    );

    // Window Resize Handler
    const handleResize = () => {
      if (!container || isDisposed) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Diagnostics updates
    let frameCount = 0;
    let lastFpsUpdateTime = performance.now();
    let currentFps = 60;

    // Gamepad / controller engine (parity with standalone Animation build)
    const controllerHint = document.getElementById('controller-hint');
    let controllerConnected = false;
    let controllerNavLatch = false;
    let controllerActionLatch = false;
    let controllerQualityLatch = false;
    let controllerDebugLatch = false;
    let controllerRoomLatch = false;

    const deadzone = (val: number, threshold = 0.16) => {
      if (Math.abs(val) < threshold) return 0;
      return Math.sign(val) * ((Math.abs(val) - threshold) / (1 - threshold));
    };

    const updateGamepad = (delta: number) => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gamepad = [...gamepads].find(Boolean);

      if (!gamepad) {
        if (controllerConnected) {
          controllerConnected = false;
          generatorInteractionManager?.setControllerActive(false);
          if (controllerHint) {
            controllerHint.textContent = 'CONTROLLER: connect to begin';
            controllerHint.classList.remove('is-active');
          }
        }
        return;
      }

      if (!controllerConnected) {
        controllerConnected = true;
        generatorInteractionManager?.setControllerActive(true);
        if (controllerHint) {
          const padId = gamepad.id || 'GAMEPAD';
          const cleanName = padId.includes('Xbox')
            ? 'XBOX'
            : padId.includes('PlayStation') || padId.includes('Dual')
              ? 'PS'
              : 'CONTROLLER';
          controllerHint.textContent = `${cleanName} ACTIVE · L-STICK: PAN · R-STICK: ORBIT · D-PAD: BROWSE · A: INSPECT · B: RESET`;
          controllerHint.classList.add('is-active');
        }
      }

      const leftX = deadzone(gamepad.axes[0] || 0);
      const leftY = deadzone(gamepad.axes[1] || 0);
      if (leftX || leftY) {
        const forward = new THREE.Vector3()
          .subVectors(controls.target, camera.position)
          .setY(0)
          .normalize();
        const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
        const targetDist = controls.target.distanceTo(camera.position);
        const speed = Math.max(16, targetDist * 0.48) * delta;
        controls.target.addScaledVector(right, leftX * speed).addScaledVector(forward, -leftY * speed);
        camera.position.addScaledVector(right, leftX * speed).addScaledVector(forward, -leftY * speed);
      }

      const rightX = deadzone(gamepad.axes[2] || 0);
      const rightY = deadzone(gamepad.axes[3] || 0);
      const triggerLeft = gamepad.buttons[6]?.value || 0;
      const triggerRight = gamepad.buttons[7]?.value || 0;
      const zoomInput = triggerLeft - triggerRight;

      if (rightX || rightY || zoomInput) {
        const offset = camera.position.clone().sub(controls.target);
        const spherical = new THREE.Spherical().setFromVector3(offset);
        spherical.theta -= rightX * delta * 2.2;
        spherical.phi = THREE.MathUtils.clamp(spherical.phi - rightY * delta * 1.6, 0.08, Math.PI / 2 - 0.02);
        if (Math.abs(zoomInput) > 0.05) {
          spherical.radius = THREE.MathUtils.clamp(
            spherical.radius * (1 + zoomInput * delta * 2.5),
            controls.minDistance,
            controls.maxDistance
          );
        }
        camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
      }

      const dPadUp = gamepad.buttons[12]?.pressed;
      const dPadDown = gamepad.buttons[13]?.pressed;
      if ((dPadUp || dPadDown) && !controllerNavLatch) {
        setAssetCursor(assetCursor + (dPadDown ? 1 : -1));
      }
      controllerNavLatch = Boolean(dPadUp || dPadDown);

      const lb = gamepad.buttons[4]?.pressed;
      const rb = gamepad.buttons[5]?.pressed;
      if ((lb || rb) && !controllerRoomLatch) {
        const roomDetails = Array.from(
          uiContainerRef.current?.querySelectorAll('#asset-navigator details') || []
        ) as HTMLDetailsElement[];
        if (roomDetails.length > 0) {
          const openIdx = roomDetails.findIndex((d) => d.open);
          const nextIdx = (openIdx + (rb ? 1 : -1) + roomDetails.length) % roomDetails.length;
          roomDetails.forEach((d, i) => {
            d.open = i === nextIdx;
          });
          const firstBtn = roomDetails[nextIdx]?.querySelector('button[data-asset]') as HTMLElement | null;
          if (firstBtn) {
            const btnIdx = assetButtons.indexOf(firstBtn);
            if (btnIdx >= 0) setAssetCursor(btnIdx);
          }
        }
      }
      controllerRoomLatch = Boolean(lb || rb);

      const btnA = gamepad.buttons[0]?.pressed;
      const btnB = gamepad.buttons[1]?.pressed || gamepad.buttons[9]?.pressed;
      if ((btnA || btnB) && !controllerActionLatch) {
        if (btnA) {
          if (generatorInteractionManager?.hoveredMesh) {
            generatorInteractionManager.selectMesh(generatorInteractionManager.hoveredMesh);
          } else if (assetCursor >= 0 && assetButtons[assetCursor]) {
            (assetButtons[assetCursor] as HTMLElement).click();
          } else {
            generatorInteractionManager?.selectCenterTarget();
          }
        } else {
          generatorInteractionManager?.clearSelection();
        }
      }
      controllerActionLatch = Boolean(btnA || btnB);

      const btnX = gamepad.buttons[2]?.pressed;
      if (btnX && !controllerQualityLatch) {
        const currentIdx = QUALITY_LEVELS.indexOf(currentQuality);
        const nextIdx = (currentIdx + 1) % QUALITY_LEVELS.length;
        applyQualitySettings(QUALITY_LEVELS[nextIdx]);
      }
      controllerQualityLatch = Boolean(btnX);

      const btnY = gamepad.buttons[3]?.pressed;
      if (btnY && !controllerDebugLatch) {
        debugModeActive = !debugModeActive;
        const debugHud = document.getElementById('debug-hud');
        debugHud?.classList.toggle('hidden', !debugModeActive);
        debugBtn?.classList.toggle('active', debugModeActive);
      }
      controllerDebugLatch = Boolean(btnY);
    };

    const onGamepadConnected = () => {
      updateGamepad(0);
    };
    window.addEventListener('gamepadconnected', onGamepadConnected);

    // 8. Main Render Loop
    const animate = () => {
      if (isDisposed) return;
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      frameCount++;
      const now = performance.now();
      if (now - lastFpsUpdateTime >= 500) {
        currentFps = Math.round((frameCount * 1000) / (now - lastFpsUpdateTime));
        frameCount = 0;
        lastFpsUpdateTime = now;

        if (debugModeActive) {
          const fpsElem = uiContainerRef.current?.querySelector('#dbg-fps');
          const callsElem = uiContainerRef.current?.querySelector('#dbg-draw-calls');
          const trisElem = uiContainerRef.current?.querySelector('#dbg-triangles');
          const objsElem = uiContainerRef.current?.querySelector('#dbg-interactive-objs');
          if (fpsElem) fpsElem.textContent = String(currentFps);
          if (callsElem) callsElem.textContent = String(renderer.info.render.calls);
          if (trisElem) trisElem.textContent = renderer.info.render.triangles.toLocaleString();
          if (objsElem && generatorInteractionManager) {
            objsElem.textContent = String(generatorInteractionManager.interactiveObjects.length);
          }
        }
      }

      updateGamepad(delta);

      if (generatorInteractionManager) {
        try {
          generatorInteractionManager.update(delta);
        } catch (err) {}
      }

      if (RED_ANOMALY_MATERIAL) {
        RED_ANOMALY_MATERIAL.emissiveIntensity = 0.75 + Math.sin(clock.getElapsedTime() * 3.5) * 0.35;
      }

      controls.update();

      if (cameraFocus) {
        cameraFocus.progress = Math.min(1, cameraFocus.progress + delta * 1.8);
        const eased = 1 - Math.pow(1 - cameraFocus.progress, 3);
        camera.position.lerpVectors(cameraFocus.startPosition, cameraFocus.targetPosition, eased);
        controls.target.lerpVectors(cameraFocus.startTarget, cameraFocus.target, eased);
        if (cameraFocus.progress >= 1) cameraFocus = null;
      }

      try {
        (engine as any).update();
      } catch (e) {}

      renderer.render(scene, camera);
    };

    animate();

    // 9. CLEANUP ON UNMOUNT (Proper Lifecycle Management)
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animFrameId);

      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('digital-twin-selection', handleTwinSelection);
      window.removeEventListener('gamepadconnected', onGamepadConnected);

      if (generatorInteractionManager) {
        generatorInteractionManager.dispose();
      }

      controls.dispose();
      dracoLoader.dispose();

      // Dispose Three.js Scene Geometries & Materials
      scene.traverse((object: any) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((mat: any) => mat.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-0 flex-1 overflow-hidden bg-[#070b14] rounded-2xl border border-white/10">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" id="app" />

      {/* UI Overlay */}
      <div ref={uiContainerRef} id="ui-container" className="absolute inset-0 pointer-events-none z-10">
        <aside id="asset-navigator" className="asset-navigator pointer-events-auto">
          <div className="navigator-heading">FACILITY MONITORING ASSETS</div>

          {/* Section 1: CHP Generation Room */}
          <details open className="asset-section" data-section="chp">
            <summary>1. CHP Room <span>18</span></summary>
            <div className="asset-list">
              <div className="asset-unit-label">CHP UNIT 1</div>
              <button data-asset="EngineCore">Unit 1 · Engine Core</button>
              <button data-asset="BearingSystem">Unit 1 · Bearing System</button>
              <button data-asset="LubricationSystem">Unit 1 · Lubrication System</button>
              <button data-asset="CoolingSystem">Unit 1 · Cooling System</button>
              <button data-asset="GeneratorSystem">Unit 1 · Generator System</button>
              <button data-asset="FuelSystem">Unit 1 · Fuel System</button>

              <div className="asset-unit-label">CHP UNIT 2</div>
              <button data-asset="EngineCore1">Unit 2 · Engine Core</button>
              <button data-asset="BearingSystem1">Unit 2 · Bearing System</button>
              <button data-asset="LubricationSystem1">Unit 2 · Lubrication System</button>
              <button data-asset="CoolingSystem1">Unit 2 · Cooling System</button>
              <button data-asset="GeneratorSystem1">Unit 2 · Generator System</button>
              <button data-asset="FuelSystem1">Unit 2 · Fuel System</button>

              <div className="asset-unit-label">CHP UNIT 3</div>
              <button data-asset="EngineCore2">Unit 3 · Engine Core</button>
              <button data-asset="BearingSystem2">Unit 3 · Bearing System</button>
              <button data-asset="LubricationSystem2">Unit 3 · Lubrication System</button>
              <button data-asset="CoolingSystem2">Unit 3 · Cooling System</button>
              <button data-asset="GeneratorSystem2">Unit 3 · Generator System</button>
              <button data-asset="FuelSystem2">Unit 3 · Fuel System</button>
            </div>
          </details>

          {/* Section 2: Water Management */}
          <details open className="asset-section" data-section="water">
            <summary>2. Water Management <span>07</span></summary>
            <div className="asset-list">
              <div className="asset-unit-label">FRESHWATER LAKE PUMP</div>
              <button data-asset="WaterPump">Lake Intake Pump</button>
              <button data-asset="ElectricMotor">Pump Drive Motor</button>
              <button data-asset="FlexibleCoupling">Shaft Bearing / Coupling</button>

              <div className="asset-unit-label">RO FILTRATION SYSTEM</div>
              <button data-asset="HighPressureFeedPump">RO High-Pressure Pump</button>
              <button data-asset="ROMembraneBank">RO Membrane Bank</button>
              <button data-asset="PreFilterBank">Cartridge Pre-Filter</button>
              <button data-asset="FeedSuctionPiping">RO Valve &amp; Piping Network</button>
            </div>
          </details>

          {/* Section 3: Sewage Management */}
          <details open className="asset-section" data-section="sewage">
            <summary>3. Sewage Management <span>03</span></summary>
            <div className="asset-list">
              <div className="asset-unit-label">WASTEWATER RECYCLING</div>
              <button data-asset="ProcessDischargeLoop">Process Discharge Pump</button>
              <button data-asset="RejectConcentrateLoop">Reject Concentrate Filter</button>
              <button data-asset="InstrumentationDrainNetwork">Drain &amp; Valve Network</button>
            </div>
          </details>

          {/* Section 4: Data & Telecom Centre */}
          <details open className="asset-section" data-section="telecom">
            <summary>4. Data &amp; Telecom Centre <span>04</span></summary>
            <div className="asset-list">
              <div className="asset-unit-label">MECHANICAL DRIVES</div>
              <button data-asset="AzimuthDrive">Azimuth Drive</button>
              <button data-asset="ElevationDrive">Elevation Drive</button>
              <button data-asset="Gearbox">Planetary Gearbox</button>
              <button data-asset="DriveMotor">Drive Motor</button>
            </div>
          </details>
        </aside>

        <header className="hud-header pointer-events-auto">
          <div className="hud-title-row">
            <div className="brand-mark" aria-hidden="true"><i /><i /><i /></div>
            <div className="hud-branding">
              <h1 className="hud-title">Bharti Research Station</h1>
              <span className="hud-geo-tag">ANTARCTICA · 69°24′S 76°11′E · DIGITAL TWIN</span>
            </div>
            <div id="system-health-badge" className="system-health-badge">
              <span id="system-health-dot" className="system-health-dot" />
              <span id="system-health-text" className="system-health-text">SYSTEM HEALTH 100% &bull; NORMAL</span>
            </div>
          </div>
          <p className="hud-instruction">Hover monitored equipment &bull; Click or press A to expand in 3D &bull; ESC to reset</p>
        </header>

        {/* Top Right Controls */}
        <div className="hud-top-right-tools pointer-events-auto">
          <button id="component-status-btn" className="component-status-btn" title="Inspect Failed Components">
            <span className="status-btn-dot" />
            <span id="component-status-btn-text">COMPONENT STATUS</span>
          </button>
          <div className="quality-selector" aria-label="Visual Quality Presets">
            <span className="tool-label">QUALITY</span>
            <button className="quality-btn active" data-quality="HIGH">HIGH</button>
            <button className="quality-btn" data-quality="MED">MED</button>
            <button className="quality-btn" data-quality="LOW">LOW</button>
          </div>
          <button id="debug-toggle-btn" className="tool-icon-btn" title="Toggle Developer Diagnostics (~)">DEBUG</button>
        </div>

        {/* Diagnostics HUD */}
        <div id="debug-hud" className="debug-hud hidden">
          <div className="debug-header">DIAGNOSTIC METRICS</div>
          <div className="debug-row"><span>FPS:</span><strong id="dbg-fps">60</strong></div>
          <div className="debug-row"><span>Draw Calls:</span><strong id="dbg-draw-calls">0</strong></div>
          <div className="debug-row"><span>Triangles:</span><strong id="dbg-triangles">0</strong></div>
          <div className="debug-row"><span>Monitored Assets:</span><strong id="dbg-interactive-objs">32</strong></div>
          <div className="debug-row"><span>Selected:</span><strong id="dbg-selected">None</strong></div>
          <div className="debug-row"><span>Subsystem:</span><strong id="dbg-subsystem">All Systems</strong></div>
        </div>

        <div id="selection-chip" className="selection-chip">
          <span className="selection-pulse" />
          <span id="selection-text">BHARTI RESEARCH STATION · DIGITAL TWIN READY</span>
        </div>

        {/* Cursor Tooltip */}
        <div id="hover-label" className="hover-label hidden">
          <span className="hover-label-kicker">MONITORED ASSET</span>
          <strong id="hover-label-title">COMPONENT</strong>
          <span id="hover-label-state">CLICK TO INSPECT</span>
        </div>

        {/* Component Info Panel */}
        <div id="sensor-panel" className="sensor-panel hidden pointer-events-auto">
          <div className="sensor-header">
            <h2 id="sensor-title">EQUIPMENT NAME</h2>
            <span id="sensor-subtitle" className="sensor-subtitle">Subsystem</span>
          </div>

          <div className="component-info-grid">
            <div className="info-row">
              <span className="info-label">COMPONENT ID</span>
              <strong id="component-id-val" className="info-value font-mono">C001</strong>
            </div>

            <div className="info-row">
              <span className="info-label">CURRENT STATE</span>
              <span className="info-badge">
                <span id="state-badge-dot" className="status-dot" />
                <strong id="condition-state-val" className="info-value font-mono">NORMAL</strong>
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">RUL</span>
              <strong id="rul-val" className="info-value font-mono">55 Days</strong>
            </div>

            <div className="info-row">
              <span className="info-label">SENSOR FAILURE</span>
              <span className="info-badge">
                <span id="sensor-status-dot" className="status-dot" />
                <strong id="sensor-failure-val" className="info-value font-mono">NO</strong>
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">CURRENT SENSOR</span>
              <strong id="current-sensor-val" className="info-value font-mono">PRIMARY</strong>
            </div>
          </div>
        </div>

        <div className="mode-key" aria-label="Inspection legend">
          <span><i className="key-dot key-live" /> 3D METALLIC ASSET</span>
          <span><i className="key-dot key-blueprint" /> BLUEPRINT CONTEXT</span>
          <kbd>ESC</kbd><em>reset</em>
          <kbd>~</kbd><em>diagnostics</em>
        </div>
        <div id="controller-hint" className="controller-hint" aria-live="polite">CONTROLLER: connect to begin</div>
      </div>

      {/* Loading Overlay */}
      <div id="loading-overlay" className="overlay z-20">
        <div className="loading-box">
          <div className="spinner" />
          <h2 id="loading-title">BHARTI RESEARCH STATION</h2>
          <p className="loading-sub">INITIALIZING CINEMATIC DIGITAL TWIN</p>
          <p id="loading-status">Loading facility geometry...</p>
          <div className="progress-bar-container">
            <div id="progress-bar" className="progress-bar" />
          </div>
        </div>
      </div>

      {/* Error Overlay */}
      <div id="error-overlay" className="overlay hidden z-20">
        <div className="error-box">
          <h2>Digital Twin Initialization Error</h2>
          <p id="error-message">An error occurred while loading the facility 3D model.</p>
          <p className="error-hint">Check browser console for detailed diagnostic logs.</p>
        </div>
      </div>
    </div>
  );
};
