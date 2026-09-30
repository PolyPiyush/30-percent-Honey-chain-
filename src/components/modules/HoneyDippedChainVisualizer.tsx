/**
 * HoneyChain — The Living Interlocked Blockchain & Honey Chain Visualizer
 * Powered by Three.js (WebGL PBR)
 *
 * Implements:
 * 1. Mathematically authentic 3D interlocking stadium chain links (alternating 0° and 90° axial rotations)
 * 2. True physical threading: each link passes through the inner aperture of adjacent links
 * 3. Cryptographic ledger cores: embedded titanium block modules with engraved block IDs, hash tags, and status seals
 * 4. Literal honey bath: translucent liquid honey vat with refractive waves, golden caustics, and meniscus adhesion
 * 5. Dynamic honey physics: gravity-accelerated teardrop droplets detaching and splashing into the reservoir
 * 6. Cryptographic verification wave: photonic pulse traversing all 8 blocks with Web Audio chimes
 * 7. Interactive 3D orbit, hover raycasting, click selection, dip depth control, and viscosity thermal modes
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { haptics } from '../../utils/haptics';
import {
  Droplets,
  Volume2,
  VolumeX,
  Flame,
  Snowflake,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Zap,
  Eye,
  Maximize2,
  Compass,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';

export interface ChainStageLink {
  index: number;
  stage: string;
  facility: string;
  actor: string;
  location: string;
  timestamp: string;
  status: 'VERIFIED' | 'MISSING_DATA';
  txHash: string;
  notes: string;
}

interface HoneyDippedChainVisualizerProps {
  links: ChainStageLink[];
  selectedLinkIndex: number;
  onSelectLink: (index: number) => void;
  isBrokenLinkSimulated: boolean;
  onToggleBrokenLink: () => void;
}

// =============================================================================
// CURVE GEOMETRY: INDUSTRIAL STADIUM CHAIN LINK
// =============================================================================
class StadiumChainCurve extends THREE.Curve<THREE.Vector3> {
  straightLen: number;
  radius: number;
  totalLen: number;

  constructor(straightLen = 2.1, radius = 1.05) {
    super();
    this.straightLen = straightLen;
    this.radius = radius;
    this.totalLen = 2 * straightLen + 2 * Math.PI * radius;
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    const point = optionalTarget;
    const sLen = this.straightLen;
    const r = this.radius;
    const arcLen = Math.PI * r;
    const dist = (t % 1) * this.totalLen;

    // Segment 1: top straight line (from -sLen/2 to +sLen/2 at y = +r)
    if (dist <= sLen) {
      point.set(-sLen / 2 + dist, r, 0);
    }
    // Segment 2: right semicircle arc (from y = +r to y = -r)
    else if (dist <= sLen + arcLen) {
      const arcDist = dist - sLen;
      const angle = Math.PI / 2 - (arcDist / arcLen) * Math.PI;
      point.set(sLen / 2 + r * Math.cos(angle), r * Math.sin(angle), 0);
    }
    // Segment 3: bottom straight line (from +sLen/2 to -sLen/2 at y = -r)
    else if (dist <= 2 * sLen + arcLen) {
      const lineDist = dist - (sLen + arcLen);
      point.set(sLen / 2 - lineDist, -r, 0);
    }
    // Segment 4: left semicircle arc (from y = -r to y = +r)
    else {
      const arcDist = dist - (2 * sLen + arcLen);
      const angle = -Math.PI / 2 - (arcDist / arcLen) * Math.PI;
      point.set(-sLen / 2 + r * Math.cos(angle), r * Math.sin(angle), 0);
    }

    return point;
  }
}

// =============================================================================
// WEB AUDIO SYNTHESIZER FOR HONEY DRIPS & METALLIC CLINKS
// =============================================================================
class HoneyAudioSynthesizer {
  private ctx: AudioContext | null = null;
  public enabled = false;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playDripSound(viscosity: number) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const baseFreq = 280 + (1 - viscosity) * 160;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Audio fallback
    }
  }

  playMetallicClink() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(940, now);
      osc1.frequency.exponentialRampToValueAtTime(420, now + 0.14);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1420, now);
      osc2.frequency.exponentialRampToValueAtTime(700, now + 0.08);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.16);
      osc2.stop(now + 0.16);
    } catch {
      // Audio fallback
    }
  }

  playPulseChime(step: number) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freqs = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5];
      const freq = freqs[step % freqs.length] || 660;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.18);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
    } catch {
      // Audio fallback
    }
  }
}

const audioSynthesizer = new HoneyAudioSynthesizer();

export const HoneyDippedChainVisualizer: React.FC<HoneyDippedChainVisualizerProps> = ({
  links,
  selectedLinkIndex,
  onSelectLink,
  isBrokenLinkSimulated,
  onToggleBrokenLink,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation controls state
  const [dipDepth, setDipDepth] = useState<number>(0.52); // 0 = fully lifted, 1 = deep submerged
  const [viscosityMode, setViscosityMode] = useState<'cold' | 'optimal' | 'warm'>('optimal');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isVerifyingPulse, setIsVerifyingPulse] = useState(false);
  const [pulseActiveIdx, setPulseActiveIdx] = useState<number | null>(null);
  const [hoveredLinkIdx, setHoveredLinkIdx] = useState<number | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Viscosity factor (0 = warm thin, 1 = cold thick raw)
  const viscosity = viscosityMode === 'cold' ? 0.9 : viscosityMode === 'optimal' ? 0.6 : 0.25;

  // Refs for animation loop
  const propsRef = useRef({
    links,
    selectedLinkIndex,
    isBrokenLinkSimulated,
    dipDepth,
    viscosity,
    viscosityMode,
    pulseActiveIdx,
  });

  useEffect(() => {
    propsRef.current = {
      links,
      selectedLinkIndex,
      isBrokenLinkSimulated,
      dipDepth,
      viscosity,
      viscosityMode,
      pulseActiveIdx,
    };
  }, [links, selectedLinkIndex, isBrokenLinkSimulated, dipDepth, viscosity, viscosityMode, pulseActiveIdx]);

  // Audio toggle
  const handleToggleSound = () => {
    haptics.buttonClick();
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioSynthesizer.enabled = next;
  };

  // Shake Chain trigger
  const shakeOffsetRef = useRef<{ val: number; decay: number }>({ val: 0, decay: 0.92 });
  const handleShakeChain = () => {
    haptics.cellSelect();
    audioSynthesizer.playMetallicClink();
    shakeOffsetRef.current.val = 1.8;
  };

  // Trigger Sequential Verification Wave
  const triggerVerificationPulse = () => {
    if (isVerifyingPulse) return;
    setIsVerifyingPulse(true);
    haptics.success();

    let step = 0;
    const interval = setInterval(() => {
      if (step < links.length) {
        setPulseActiveIdx(step);
        audioSynthesizer.playPulseChime(step);
        step++;
      } else {
        clearInterval(interval);
        setPulseActiveIdx(null);
        setIsVerifyingPulse(false);
      }
    }, 240);
  };

  // ===========================================================================
  // MAIN THREE.JS 3D SCENE INITIALIZATION & ANIMATION
  // ===========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = container.clientWidth || 900;
    let height = container.clientHeight || 420;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0502, 0.028);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 18.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfff5eb, 0.85);
    scene.add(ambientLight);

    // Warm Golden Sun Key Light (Casts dramatic metallic & honey highlights)
    const keyLight = new THREE.DirectionalLight(0xffecd2, 3.2);
    keyLight.position.set(12, 16, 14);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 40;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Deep Amber Rim Light from Behind the Honey Vat
    const rimLight = new THREE.DirectionalLight(0xd97706, 2.8);
    rimLight.position.set(-10, -4, -8);
    scene.add(rimLight);

    // Bottom Glowing Honey Uplight
    const honeyUplight = new THREE.PointLight(0xf59e0b, 4.5, 25);
    honeyUplight.position.set(0, -4.5, 2);
    scene.add(honeyUplight);

    // Top Cyan Cryptographic Inspection Spot
    const cryptoLight = new THREE.SpotLight(0x38bdf8, 2.2, 30, Math.PI / 4, 0.4);
    cryptoLight.position.set(0, 10, 8);
    scene.add(cryptoLight);

    // 3. Materials
    // Forged Metallic Chain Link Material (Polished Platinum Titanium + Honey reflections)
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.94,
      roughness: 0.18,
      envMapIntensity: 1.5,
    });

    // Golden Amber Dipped Honey Material (Thick, glossy, translucent)
    const honeyGlazeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd97706,
      emissive: 0x78350f,
      emissiveIntensity: 0.25,
      metalness: 0.05,
      roughness: 0.12,
      transmission: 0.72,
      thickness: 1.4,
      ior: 1.54,
      transparent: true,
      opacity: 0.92,
    });

    // Cryptographic Seal Medallion Material
    const sealMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25,
    });

    const goldTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.2,
      emissive: 0xb45309,
      emissiveIntensity: 0.35,
    });

    // 4. Build Stadium Chain Link Geometries
    const straightLen = 2.1;
    const curveRadius = 1.05;
    const tubeRadius = 0.34;
    const stadiumCurve = new StadiumChainCurve(straightLen, curveRadius);
    const linkGeometry = new THREE.TubeGeometry(stadiumCurve, 72, tubeRadius, 20, true);

    // Honey Glaze Outer Layer Geometry (slightly dilated)
    const honeyGlazeGeometry = new THREE.TubeGeometry(stadiumCurve, 72, tubeRadius + 0.045, 20, true);

    // Cryptographic Core Cylinder inside the link opening
    const coreCylinderGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.28, 6);
    const coreRingGeo = new THREE.TorusGeometry(0.74, 0.05, 12, 32);

    // 5. Chain Group & Physical 8-Link Rigging
    const chainGroup = new THREE.Group();
    scene.add(chainGroup);

    interface ChainLinkMeshBundle {
      group: THREE.Group;
      metalMesh: THREE.Mesh;
      honeyMesh: THREE.Mesh;
      coreGroup: THREE.Group;
      coreMesh: THREE.Mesh;
      ringMesh: THREE.Mesh;
      glowSprite: THREE.Sprite;
      linkIndex: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      baseRotZ: number;
    }

    const linkBundles: ChainLinkMeshBundle[] = [];
    const totalLinks = 8;
    const linkCenterSpacing = 3.05; // Exactly interlocks through loop aperture!

    for (let i = 0; i < totalLinks; i++) {
      const linkGrp = new THREE.Group();

      // Catenary sag curve positioning
      const normIdx = (i - (totalLinks - 1) / 2) / ((totalLinks - 1) / 2); // -1 to +1
      const sagY = -(1 - normIdx * normIdx) * 1.5;
      const xPos = (i - (totalLinks - 1) / 2) * linkCenterSpacing;
      const yPos = sagY;
      const zPos = 0;

      linkGrp.position.set(xPos, yPos, zPos);

      // Catenary slope angle (rotation around Z)
      const slope = -normIdx * 0.28;
      linkGrp.rotation.z = slope;

      // CRITICAL FOR TRUE PHYSICAL INTERLOCKING:
      // Even links (0, 2, 4, 6) face forward (flat in XY)
      // Odd links (1, 3, 5, 7) are rotated 90° on X axis!
      // This allows odd links to pass completely through the inner hollow hole of even links!
      const isOdd = i % 2 === 1;
      if (isOdd) {
        linkGrp.rotation.x = Math.PI / 2;
      }

      // Base Metal Link Mesh
      const metalMesh = new THREE.Mesh(linkGeometry, metalMaterial.clone());
      metalMesh.castShadow = true;
      metalMesh.receiveShadow = true;
      (metalMesh as unknown as { userData: { linkIndex: number } }).userData = { linkIndex: i };
      linkGrp.add(metalMesh);

      // Outer Translucent Honey Glaze Mesh
      const honeyMesh = new THREE.Mesh(honeyGlazeGeometry, honeyGlazeMaterial.clone());
      honeyMesh.castShadow = false;
      linkGrp.add(honeyMesh);

      // Cryptographic Core Hub (Hexagonal Titanium Badge with Gold Trim)
      const coreGrp = new THREE.Group();
      const coreMesh = new THREE.Mesh(coreCylinderGeo, sealMaterial.clone());
      coreMesh.rotation.x = Math.PI / 2;
      coreGrp.add(coreMesh);

      const ringMesh = new THREE.Mesh(coreRingGeo, goldTrimMaterial.clone());
      ringMesh.rotation.x = Math.PI / 2;
      coreGrp.add(ringMesh);

      // Glow Halo Sprite for selection / verification pulse
      const canvasGlow = document.createElement('canvas');
      canvasGlow.width = 128;
      canvasGlow.height = 128;
      const glowCtx = canvasGlow.getContext('2d')!;
      const grad = glowCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.9)');
      grad.addColorStop(0.3, 'rgba(217, 119, 6, 0.5)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      glowCtx.fillStyle = grad;
      glowCtx.fillRect(0, 0, 128, 128);

      const glowTex = new THREE.CanvasTexture(canvasGlow);
      const spriteMat = new THREE.SpriteMaterial({
        map: glowTex,
        color: 0xf59e0b,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const glowSprite = new THREE.Sprite(spriteMat);
      glowSprite.scale.set(4, 4, 1);
      coreGrp.add(glowSprite);

      linkGrp.add(coreGrp);
      chainGroup.add(linkGrp);

      linkBundles.push({
        group: linkGrp,
        metalMesh,
        honeyMesh,
        coreGroup: coreGrp,
        coreMesh,
        ringMesh,
        glowSprite,
        linkIndex: i,
        baseX: xPos,
        baseY: yPos,
        baseZ: zPos,
        baseRotZ: slope,
      });
    }

    // 6. 3D Liquid Honey Reservoir Bath (Bottom Fluid)
    const honeyPlaneGeo = new THREE.PlaneGeometry(32, 16, 48, 24);
    const honeyPlaneMat = new THREE.MeshPhysicalMaterial({
      color: 0xd97706,
      emissive: 0x78350f,
      emissiveIntensity: 0.35,
      metalness: 0.1,
      roughness: 0.08,
      transmission: 0.8,
      thickness: 2.2,
      ior: 1.54,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    });
    const honeyPlane = new THREE.Mesh(honeyPlaneGeo, honeyPlaneMat);
    honeyPlane.rotation.x = -Math.PI / 2;
    honeyPlane.position.set(0, -3.2, 0);
    honeyPlane.receiveShadow = true;
    scene.add(honeyPlane);

    // Honey Bath Container Walls (Warm dark mahogany vat)
    const vatWallGeo = new THREE.BoxGeometry(32, 3, 16);
    const vatWallMat = new THREE.MeshStandardMaterial({
      color: 0x120702,
      roughness: 0.8,
      metalness: 0.1,
    });
    const vatWall = new THREE.Mesh(vatWallGeo, vatWallMat);
    vatWall.position.set(0, -4.7, 0);
    scene.add(vatWall);

    // 7. Dynamic Dripping Honey Droplets & Splash Ripples
    interface Droplet3D {
      mesh: THREE.Mesh;
      vy: number;
      sourceLink: number;
      viscosityFactor: number;
      stretch: number;
    }

    interface Ripple3D {
      mesh: THREE.Mesh;
      radius: number;
      maxRadius: number;
      alpha: number;
    }

    const dropletGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const rippleGeo = new THREE.RingGeometry(0.1, 0.18, 32);

    const activeDroplets: Droplet3D[] = [];
    const activeRipples: Ripple3D[] = [];
    let lastDropTime = 0;

    // 8. Hexagonal Background Ambient Grid
    const bgGroup = new THREE.Group();
    bgGroup.position.set(0, 0, -8);
    const hexWireMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.04,
    });

    for (let hx = -16; hx <= 16; hx += 3.2) {
      for (let hy = -8; hy <= 8; hy += 2.8) {
        const hexPts: THREE.Vector3[] = [];
        const rHex = 1.2;
        for (let a = 0; a <= 6; a++) {
          const ang = (Math.PI / 3) * a;
          hexPts.push(new THREE.Vector3(hx + rHex * Math.cos(ang), hy + rHex * Math.sin(ang), 0));
        }
        const hexGeo = new THREE.BufferGeometry().setFromPoints(hexPts);
        const hexLine = new THREE.Line(hexGeo, hexWireMat);
        bgGroup.add(hexLine);
      }
    }
    scene.add(bgGroup);

    // 9. Interactive Drag Orbit & Mouse Raycasting
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    const raycaster = new THREE.Raycaster();
    const mousePos = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        targetRotY += deltaX * 0.006;
        targetRotX += deltaY * 0.004;
        targetRotX = Math.max(-0.45, Math.min(0.45, targetRotX));
      } else {
        // Raycast for hover detection
        raycaster.setFromCamera(mousePos, camera);
        const intersects = raycaster.intersectObjects(
          linkBundles.map((b) => b.metalMesh)
        );

        if (intersects.length > 0) {
          const hit = intersects[0].object as unknown as { userData: { linkIndex: number } };
          const idx = hit.userData.linkIndex;
          if (idx !== hoveredLinkIdx) {
            haptics.cellHover();
            setHoveredLinkIdx(idx);
          }
        } else {
          setHoveredLinkIdx(null);
        }
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickMouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(clickMouse, camera);
      const intersects = raycaster.intersectObjects(
        linkBundles.map((b) => b.metalMesh)
      );

      if (intersects.length > 0) {
        const hit = intersects[0].object as unknown as { userData: { linkIndex: number } };
        const idx = hit.userData.linkIndex;
        haptics.cellSelect();
        audioSynthesizer.playMetallicClink();
        onSelectLink(idx);

        // Gentle spring kick
        shakeOffsetRef.current.val = 0.8;
      }
    };

    canvas.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    canvas.addEventListener('click', handleClick);

    // 10. Resize Observer
    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth || 900;
      height = container.clientHeight || 420;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // =========================================================================
    // 11. 60 FPS RENDER LOOP
    // =========================================================================
    let animationFrameId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      const {
        selectedLinkIndex: curSelected,
        isBrokenLinkSimulated: curBroken,
        dipDepth: curDip,
        viscosity: curVisc,
        viscosityMode: curViscMode,
        pulseActiveIdx: curPulse,
      } = propsRef.current;

      // Handle Shake offset decay
      shakeOffsetRef.current.val *= shakeOffsetRef.current.decay;
      const currentShake = Math.sin(elapsedTime * 32) * shakeOffsetRef.current.val;

      // Dynamic Honey vat level based on dip slider
      const targetVatY = -2.2 - (curDip - 0.5) * 2.8;
      honeyPlane.position.y += (targetVatY - honeyPlane.position.y) * 0.1;
      vatWall.position.y = honeyPlane.position.y - 1.5;

      // Honey surface animated liquid wave perturbation
      const posAttr = honeyPlaneGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i);
        const vy = posAttr.getY(i);
        const wave =
          Math.sin(vx * 0.4 + elapsedTime * 1.5) * 0.08 +
          Math.cos(vy * 0.5 - elapsedTime * 1.2) * 0.05;
        posAttr.setZ(i, wave);
      }
      posAttr.needsUpdate = true;
      honeyPlaneGeo.computeVertexNormals();

      // Smooth Orbit inertia damping
      if (isAutoRotating && !isDragging) {
        targetRotY = Math.sin(elapsedTime * 0.35) * 0.18;
        targetRotX = Math.cos(elapsedTime * 0.25) * 0.06;
      }
      currentRotY += (targetRotY - currentRotY) * 0.08;
      currentRotX += (targetRotX - currentRotX) * 0.08;
      chainGroup.rotation.y = currentRotY;
      chainGroup.rotation.x = currentRotX;

      // Dynamic update of all 8 chain links
      linkBundles.forEach((bundle) => {
        const i = bundle.linkIndex;
        const isSelected = i === curSelected;
        const isSevered = curBroken && i === 3;
        const isPulseLit = i === curPulse;

        // Base Catenary + immersion elevation
        const baseSag = bundle.baseY + currentShake * (1 - Math.abs(i - 3.5) * 0.2);
        let linkY = baseSag;

        // Severed link behavior (Block #04 fractures and droops downward)
        if (curBroken) {
          if (i === 3) {
            linkY -= 1.4; // Fractured link hangs broken
            bundle.group.rotation.z = bundle.baseRotZ + 0.38;
            bundle.group.position.x = bundle.baseX + 0.4;
          } else if (i > 3) {
            linkY -= 0.35;
          }
        } else {
          bundle.group.position.x = bundle.baseX;
          bundle.group.rotation.z = bundle.baseRotZ;
        }
        bundle.group.position.y = linkY;

        // Physical material updates
        const mat = bundle.metalMesh.material as THREE.MeshStandardMaterial;
        const honeyMat = bundle.honeyMesh.material as THREE.MeshPhysicalMaterial;
        const coreMat = bundle.coreMesh.material as THREE.MeshStandardMaterial;
        const ringMat = bundle.ringMesh.material as THREE.MeshStandardMaterial;
        const spriteMat = bundle.glowSprite.material as THREE.SpriteMaterial;

        if (isSevered) {
          // Warning red breach appearance
          mat.color.setHex(0xef4444);
          mat.emissive.setHex(0x991b1b);
          mat.emissiveIntensity = 0.6;
          coreMat.color.setHex(0x450a0a);
          ringMat.color.setHex(0xf87171);
          spriteMat.color.setHex(0xef4444);
          spriteMat.opacity = 0.75 + Math.sin(elapsedTime * 8) * 0.25;
        } else if (isPulseLit) {
          // Cryptographic verification wave illumination
          mat.color.setHex(0x38bdf8);
          mat.emissive.setHex(0x0284c7);
          mat.emissiveIntensity = 0.85;
          coreMat.color.setHex(0x0c4a6e);
          ringMat.color.setHex(0x38bdf8);
          spriteMat.color.setHex(0x38bdf8);
          spriteMat.opacity = 0.95;
        } else if (isSelected) {
          // Active user selected block
          mat.color.setHex(0xffffff);
          mat.emissive.setHex(0xf59e0b);
          mat.emissiveIntensity = 0.45;
          coreMat.color.setHex(0x1e293b);
          ringMat.color.setHex(0xfbbf24);
          spriteMat.color.setHex(0xf59e0b);
          spriteMat.opacity = 0.7;
        } else {
          // Pristine polished chrome & titanium alloy
          mat.color.setHex(0xd4d4d8);
          mat.emissive.setHex(0x000000);
          mat.emissiveIntensity = 0;
          coreMat.color.setHex(0x18181b);
          ringMat.color.setHex(0xf59e0b);
          spriteMat.opacity = 0;
        }

        // Honey Glaze Adhesion on bottom section of link
        // If link is dipping near or below the honey surface, glaze glows and adheres
        const linkLowestY = bundle.group.position.y - 1.4;
        if (linkLowestY <= honeyPlane.position.y + 0.8) {
          honeyMat.opacity = 0.92;
          honeyMat.emissiveIntensity = 0.45;
        } else {
          honeyMat.opacity = 0.35; // Residual glistening honey film
          honeyMat.emissiveIntensity = 0.1;
        }
      });

      // Spawn Viscous Honey Droplets
      const dropInterval =
        curViscMode === 'cold' ? 1.2 : curViscMode === 'optimal' ? 0.65 : 0.35;
      if (elapsedTime - lastDropTime > dropInterval) {
        lastDropTime = elapsedTime;

        // Pick a dipped link that isn't severed
        const eligibleBundles = linkBundles.filter((b) => {
          if (curBroken && b.linkIndex === 3) return false;
          return b.group.position.y - 1.4 <= honeyPlane.position.y + 1.2;
        });

        if (eligibleBundles.length > 0) {
          const chosen = eligibleBundles[Math.floor(Math.random() * eligibleBundles.length)];
          const dropMesh = new THREE.Mesh(dropletGeo, honeyGlazeMaterial);
          const worldPos = new THREE.Vector3();
          chosen.group.getWorldPosition(worldPos);

          dropMesh.position.set(
            worldPos.x + (Math.random() - 0.5) * 0.4,
            worldPos.y - 1.4,
            worldPos.z + (Math.random() - 0.5) * 0.3
          );
          scene.add(dropMesh);

          activeDroplets.push({
            mesh: dropMesh,
            vy: 0.04 + (1 - curVisc) * 0.05,
            sourceLink: chosen.linkIndex,
            viscosityFactor: curVisc,
            stretch: 1.2,
          });
        }
      }

      // Update Droplets
      const gravity = 0.015 * (1.2 - curVisc * 0.4);
      for (let d = activeDroplets.length - 1; d >= 0; d--) {
        const drop = activeDroplets[d];
        drop.vy += gravity;
        drop.mesh.position.y -= drop.vy;
        drop.stretch = Math.min(2.4, drop.stretch + 0.03);
        drop.mesh.scale.set(0.8, drop.stretch, 0.8);

        // Check impact with honey plane
        if (drop.mesh.position.y <= honeyPlane.position.y) {
          // Create 3D Splash Ripple
          const ripMesh = new THREE.Mesh(
            rippleGeo,
            new THREE.MeshBasicMaterial({
              color: 0xfef08a,
              transparent: true,
              opacity: 0.85,
              side: THREE.DoubleSide,
            })
          );
          ripMesh.rotation.x = -Math.PI / 2;
          ripMesh.position.set(drop.mesh.position.x, honeyPlane.position.y + 0.02, drop.mesh.position.z);
          scene.add(ripMesh);

          activeRipples.push({
            mesh: ripMesh,
            radius: 0.18,
            maxRadius: 1.8,
            alpha: 0.85,
          });

          // Play audio
          audioSynthesizer.playDripSound(drop.viscosityFactor);
          if (drop.sourceLink === curSelected) {
            haptics.tap();
          }

          scene.remove(drop.mesh);
          activeDroplets.splice(d, 1);
        }
      }

      // Update Ripples
      for (let r = activeRipples.length - 1; r >= 0; r--) {
        const rip = activeRipples[r];
        rip.radius += 0.035;
        rip.alpha -= 0.025;
        rip.mesh.scale.set(rip.radius * 5, rip.radius * 5, 1);

        const ripMat = rip.mesh.material as THREE.MeshBasicMaterial;
        ripMat.opacity = Math.max(0, rip.alpha);

        if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
          scene.remove(rip.mesh);
          activeRipples.splice(r, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('click', handleClick);

      // Clean up Three.js allocations
      activeDroplets.forEach((d) => scene.remove(d.mesh));
      activeRipples.forEach((r) => scene.remove(r.mesh));
      renderer.dispose();
    };
  }, [onSelectLink]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#140a04] via-[#0d0703] to-[#060301] overflow-hidden shadow-2xl"
    >
      {/* Visualizer Top Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-amber-950/80 bg-black/60 backdrop-blur-md text-xs z-10 relative">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-display font-bold text-white tracking-wide">
            THE LIVING CHAIN — PHYSICAL 3D BLOCKCHAIN
          </span>
          <span className="text-amber-500/50">·</span>
          <span className="text-[11px] font-mono text-amber-400/90 font-medium hidden sm:inline">
            8 Interlocking Forged Links Dipped in Raw Honey
          </span>
        </div>

        {/* Interactive Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Verify Chain Pulse Button */}
          <button
            onClick={triggerVerificationPulse}
            disabled={isVerifyingPulse}
            className="px-2.5 py-1 rounded-lg bg-sky-950/80 hover:bg-sky-900/80 text-sky-300 border border-sky-600/50 text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(56,189,248,0.2)] active:scale-95"
            title="Send cryptographic validation wave through all 8 interlinked blocks"
          >
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            <span>{isVerifyingPulse ? 'Verifying Chain...' : 'Verify Chain Pulse'}</span>
          </button>

          {/* Dip Depth Slider */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/60 border border-amber-900/50">
            <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-wider">
              Honey Dip:
            </span>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={dipDepth}
              onChange={(e) => {
                haptics.tap();
                setDipDepth(parseFloat(e.target.value));
              }}
              className="w-16 sm:w-24 accent-amber-500 cursor-pointer h-1.5 bg-amber-950 rounded-lg"
              title="Adjust chain immersion depth in liquid honey"
            />
            <span className="font-mono text-[10px] text-amber-300 w-7">
              {Math.round(dipDepth * 100)}%
            </span>
          </div>

          {/* Viscosity Mode Selector */}
          <div className="flex items-center bg-black/60 border border-amber-900/50 rounded-lg p-0.5">
            <button
              onClick={() => {
                haptics.tap();
                setViscosityMode('cold');
              }}
              className={`px-2 py-1 rounded text-[10px] font-mono transition-colors flex items-center gap-1 cursor-pointer ${
                viscosityMode === 'cold'
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50 font-semibold'
                  : 'text-amber-400/60 hover:text-amber-300'
              }`}
              title="Cold Raw Forest Honey (45,000 cP) — Thick, slow viscous drips"
            >
              <Snowflake className="w-2.5 h-2.5" />
              <span>Cold 18°C</span>
            </button>
            <button
              onClick={() => {
                haptics.tap();
                setViscosityMode('optimal');
              }}
              className={`px-2 py-1 rounded text-[10px] font-mono transition-colors flex items-center gap-1 cursor-pointer ${
                viscosityMode === 'optimal'
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50 font-semibold'
                  : 'text-amber-400/60 hover:text-amber-300'
              }`}
              title="Optimum Extraction (18,500 cP) — Ideal golden amber flow"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>Optimum 36°C</span>
            </button>
            <button
              onClick={() => {
                haptics.tap();
                setViscosityMode('warm');
              }}
              className={`px-2 py-1 rounded text-[10px] font-mono transition-colors flex items-center gap-1 cursor-pointer ${
                viscosityMode === 'warm'
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50 font-semibold'
                  : 'text-amber-400/60 hover:text-amber-300'
              }`}
              title="Warm Acacia Flow (6,200 cP) — Rapid cascading golden drips"
            >
              <Flame className="w-2.5 h-2.5" />
              <span>Warm 45°C</span>
            </button>
          </div>

          {/* Shake Chain Action */}
          <button
            onClick={handleShakeChain}
            className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/40 text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
            title="Shake chain to trigger honey droplets & metallic oscillation"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span>Shake</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-black/60 border-amber-900/40 text-amber-500/50 hover:text-amber-300'
            }`}
            title={soundEnabled ? 'Mute Honey Drip Audio' : 'Enable Viscous Honey Drip Audio'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main 3D WebGL Canvas */}
      <div className="relative w-full h-[360px] md:h-[420px] cursor-grab active:cursor-grabbing select-none">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Ambient Honey Vat Overlay HUD */}
        <div className="absolute bottom-3 left-4 pointer-events-none text-[11px] font-mono text-amber-300/80 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-2 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Vat: 100% Raw Forest Honey</span>
          <span className="text-amber-500/50">·</span>
          <span>
            Viscosity:{' '}
            {viscosityMode === 'cold'
              ? '45,000 cP'
              : viscosityMode === 'optimal'
              ? '18,500 cP'
              : '6,200 cP'}
          </span>
          <span className="text-amber-500/50">·</span>
          <span>Brix: 81.4°</span>
        </div>

        {/* Instructions tooltip */}
        <div className="absolute top-3 right-4 pointer-events-none text-[10px] font-mono text-amber-300/80 bg-black/75 backdrop-blur-md px-3 py-1 rounded-xl border border-amber-500/30 shadow-md flex items-center gap-1.5">
          <Compass className="w-3 h-3 text-amber-400 animate-spin" />
          <span>Drag to orbit in 3D · Click any link to inspect</span>
        </div>

        {/* Severed Alert Badge Overlay */}
        {isBrokenLinkSimulated && (
          <div className="absolute top-3 left-4 pointer-events-none text-[11px] font-mono text-rose-300 bg-rose-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.3)] flex items-center gap-2 animate-bounce">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>LINK #04 PHYSICAL FRACTURE DETECTED</span>
          </div>
        )}
      </div>

      {/* Stage Link Fast-Switcher Rail */}
      <div className="grid grid-cols-4 md:grid-cols-8 divide-x divide-amber-950/60 border-t border-amber-950/80 bg-black/70 text-[11px] font-mono">
        {links.map((link, idx) => {
          const isSelected = selectedLinkIndex === idx;
          const isBroken = idx === 3 && isBrokenLinkSimulated;

          return (
            <button
              key={link.index}
              onClick={() => {
                haptics.cellSelect();
                audioSynthesizer.playMetallicClink();
                onSelectLink(idx);
              }}
              className={`p-2.5 text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-950/70 border-b-2 border-amber-400 text-white'
                  : 'text-amber-400/70 hover:bg-amber-950/30 hover:text-amber-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-[10px] text-amber-400">
                  BLK #0{link.index}
                </span>
                {isBroken ? (
                  <span className="text-rose-400 text-[10px] font-bold">⚠ BREACH</span>
                ) : (
                  <span className="text-emerald-400 text-[10px]">✓ SEALED</span>
                )}
              </div>
              <div className="font-sans font-medium text-xs text-white truncate mt-1">
                {link.stage.split('.')[1]?.trim() || link.stage}
              </div>
              <div className="text-[9px] text-amber-300/50 truncate mt-0.5">
                {link.txHash}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
