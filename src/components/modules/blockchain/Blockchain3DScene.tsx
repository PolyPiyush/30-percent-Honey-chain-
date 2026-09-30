/**
 * HoneyChain 3D Cinematic Blockchain Canvas (Three.js)
 * Implements:
 * - 3D Translucent Golden Cube with hexagonal honeycomb core & floating particles
 * - Scroll & state-driven camera dolly / orbit / zoom
 * - 4-layer physical cube disassembly in 3D space
 * - Flying honey data droplet entering the block
 * - Hexagonal sealing & expanding circular energy pulse
 * - 3D Perspective Blockchain (Blocks #182901 to #182906)
 * - Interactive raycast clicking on 3D blocks
 * - Tamper simulation (broken red cryptographic link)
 * - Sequential chain integrity verification pulse
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { LedgerCameraState } from './types';
import { BlockchainBlock } from '../../../types';
import { blockchainAudio } from './blockchainAudio';

interface Blockchain3DSceneProps {
  cameraState: LedgerCameraState;
  scrollProgress: number; // 0 to 1
  selectedBlockNumber: number;
  onSelectBlock: (blockNumber: number) => void;
  blocks: BlockchainBlock[];
  isTampered: boolean;
  isSealed: boolean;
  pulseBlockIndex: number | null; // which block is lit by verification pulse
  isLiveSimulating: boolean;
  liveStep: string;
  reducedMotion: boolean;
}

export const Blockchain3DScene: React.FC<Blockchain3DSceneProps> = ({
  cameraState,
  scrollProgress,
  selectedBlockNumber,
  onSelectBlock,
  blocks,
  isTampered,
  isSealed,
  pulseBlockIndex,
  isLiveSimulating,
  liveStep,
  reducedMotion,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keep latest props in refs for 60fps animation loop
  const propsRef = useRef({
    cameraState,
    scrollProgress,
    selectedBlockNumber,
    isTampered,
    isSealed,
    pulseBlockIndex,
    isLiveSimulating,
    liveStep,
    reducedMotion,
  });

  useEffect(() => {
    propsRef.current = {
      cameraState,
      scrollProgress,
      selectedBlockNumber,
      isTampered,
      isSealed,
      pulseBlockIndex,
      isLiveSimulating,
      liveStep,
      reducedMotion,
    };
  }, [
    cameraState,
    scrollProgress,
    selectedBlockNumber,
    isTampered,
    isSealed,
    pulseBlockIndex,
    isLiveSimulating,
    liveStep,
    reducedMotion,
  ]);

  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = mountRef.current;
    if (!canvas || !container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 550;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060402, 0.035);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // 2. Lighting - Golden Warm Amber Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 1.4);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xf59e0b, 3.2);
    goldKeyLight.position.set(6, 8, 6);
    scene.add(goldKeyLight);

    const honeyFillLight = new THREE.DirectionalLight(0xd97706, 2.0);
    honeyFillLight.position.set(-6, -4, -4);
    scene.add(honeyFillLight);

    const cyanRimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    cyanRimLight.position.set(0, -6, 5);
    scene.add(cyanRimLight);

    // 3. Central Block #182904 Group
    const centerBlockGroup = new THREE.Group();
    scene.add(centerBlockGroup);

    // Glass Outer Cube
    const cubeGeo = new THREE.BoxGeometry(2.6, 2.6, 2.6);
    const cubeMat = new THREE.MeshPhysicalMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.15,
      transmission: 0.8,
      ior: 1.45,
      thickness: 0.6,
      reflectivity: 0.8,
    });
    const mainCubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
    centerBlockGroup.add(mainCubeMesh);

    // Glowing Golden Edges
    const edgesGeo = new THREE.EdgesGeometry(cubeGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      linewidth: 2,
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    centerBlockGroup.add(edgesMesh);

    // 4. Hexagonal Honeycomb Internal Lattice (3 concentric rotated hexagons)
    const hexGroup = new THREE.Group();
    centerBlockGroup.add(hexGroup);

    const hexMat = new THREE.LineBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.45,
    });

    [0.7, 1.1, 1.5].forEach((radius, idx) => {
      const hexGeo = new THREE.CylinderGeometry(radius, radius, 0.05, 6, 1, true);
      const hexEdges = new THREE.EdgesGeometry(hexGeo);
      const hexLine = new THREE.LineSegments(hexEdges, hexMat);
      hexLine.rotation.x = Math.PI / 2;
      hexLine.rotation.z = (idx * Math.PI) / 6;
      hexGroup.add(hexLine);
    });

    // 5. Central Cryptographic Octahedron Core
    const coreGeo = new THREE.OctahedronGeometry(0.7, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.9,
      roughness: 0.25,
      metalness: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    centerBlockGroup.add(coreMesh);

    // 6. Tiny Golden Data Particles Inside the Cube
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleOriginals = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 2.2;
      const y = (Math.random() - 0.5) * 2.2;
      const z = (Math.random() - 0.5) * 2.2;
      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
      particleOriginals[i * 3] = x;
      particleOriginals[i * 3 + 1] = y;
      particleOriginals[i * 3 + 2] = z;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfde68a,
      size: 0.045,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    centerBlockGroup.add(particleSystem);

    // 7. Four Disassembly Data Layers (Plates that expand on State 04)
    const layerGroup = new THREE.Group();
    centerBlockGroup.add(layerGroup);

    const layerColors = [0x38bdf8, 0xf59e0b, 0x8b5cf6, 0x10b981];
    const layerMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < 4; i++) {
      const plateGeo = new THREE.BoxGeometry(2.3, 0.07, 2.3);
      const plateMat = new THREE.MeshStandardMaterial({
        color: layerColors[i],
        emissive: layerColors[i],
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.75,
        metalness: 0.3,
        roughness: 0.3,
      });
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.position.y = (i - 1.5) * 0.4;
      layerGroup.add(plate);
      layerMeshes.push(plate);
    }

    // 8. Glowing Honey Droplet Mesh (enters during verification / State 05)
    const dropletGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const dropletMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.4,
    });
    const dropletMesh = new THREE.Mesh(dropletGeo, dropletMat);
    dropletMesh.position.set(-5, 2.5, 3);
    dropletMesh.visible = false;
    scene.add(dropletMesh);

    // 9. Hexagonal Sealing Emblem on Front Face of Block
    const sealGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.04, 6);
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xfbbf24,
      emissiveIntensity: 1.0,
      metalness: 0.6,
      roughness: 0.2,
    });
    const sealMesh = new THREE.Mesh(sealGeo, sealMat);
    sealMesh.rotation.x = Math.PI / 2;
    sealMesh.position.set(0, 0, 1.32);
    sealMesh.scale.set(0.01, 0.01, 0.01);
    sealMesh.visible = false;
    centerBlockGroup.add(sealMesh);

    // 10. Circular Sealing Pulse Wave
    const pulseRingGeo = new THREE.RingGeometry(0.2, 0.45, 36);
    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
    pulseRing.position.set(0, 0, 1.35);
    pulseRing.visible = false;
    centerBlockGroup.add(pulseRing);

    // 11. Full 3D Blockchain Chain Group (State 07: Blocks #182901 to #182906)
    const chainGroup = new THREE.Group();
    chainGroup.visible = false;
    scene.add(chainGroup);

    // Pre-calculate 3D spatial layout for the 6 blocks along an elegant diagonal perspective
    const chainPositions = [
      new THREE.Vector3(-7.5, -2.4, -7.0),  // 182901
      new THREE.Vector3(-4.5, -1.5, -4.2),  // 182902
      new THREE.Vector3(-1.5, -0.6, -1.4),  // 182903
      new THREE.Vector3(1.5, 0.3, 1.4),    // 182904
      new THREE.Vector3(4.5, 1.2, 4.2),    // 182905
      new THREE.Vector3(7.5, 2.1, 7.0),    // 182906
    ];

    const chainBlockMeshes: THREE.Group[] = [];
    const chainLinks: { mesh: THREE.Mesh; fromIdx: number; toIdx: number }[] = [];

    // Create 6 miniature 3D blocks
    chainPositions.forEach((pos, idx) => {
      const bGroup = new THREE.Group();
      bGroup.position.copy(pos);
      bGroup.userData = { blockNumber: 182901 + idx, index: idx };

      const bGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
      const bMat = new THREE.MeshPhysicalMaterial({
        color: 0xd97706,
        transparent: true,
        opacity: 0.5,
        roughness: 0.2,
        metalness: 0.3,
        transmission: 0.5,
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bGroup.add(bMesh);

      const bEdgesGeo = new THREE.EdgesGeometry(bGeo);
      const bEdgesMat = new THREE.LineBasicMaterial({
        color: 0xf59e0b,
        linewidth: 1.5,
      });
      const bWire = new THREE.LineSegments(bEdgesGeo, bEdgesMat);
      bGroup.add(bWire);

      // Inner glowing core for each block
      const bCore = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.4),
        new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xd97706,
          emissiveIntensity: 0.8,
        })
      );
      bGroup.add(bCore);

      chainGroup.add(bGroup);
      chainBlockMeshes.push(bGroup);

      // Glowing Link Cylinder between consecutive blocks
      if (idx > 0) {
        const prevPos = chainPositions[idx - 1];
        const dir = new THREE.Vector3().subVectors(pos, prevPos);
        const len = dir.length();
        const linkGeo = new THREE.CylinderGeometry(0.08, 0.08, len - 1.4, 16);
        const linkMat = new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          emissive: 0xd97706,
          emissiveIntensity: 1.2,
          roughness: 0.2,
        });
        const linkMesh = new THREE.Mesh(linkGeo, linkMat);

        // Position at midpoint and orient along direction
        const midPoint = new THREE.Vector3().addVectors(prevPos, pos).multiplyScalar(0.5);
        linkMesh.position.copy(midPoint);
        linkMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

        chainGroup.add(linkMesh);
        chainLinks.push({ mesh: linkMesh, fromIdx: idx - 1, toIdx: idx });
      }
    });

    // 12. Chain Verification Pulse Photon Particle
    const pulsePhotonGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const pulsePhotonMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: false,
    });
    const pulsePhoton = new THREE.Mesh(pulsePhotonGeo, pulsePhotonMat);
    pulsePhoton.visible = false;
    scene.add(pulsePhoton);

    // Raycaster for interactive block selection in 3D
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (chainGroup.visible) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(chainGroup.children, true);
        if (intersects.length > 0) {
          let topObj: THREE.Object3D | null = intersects[0].object;
          while (topObj && topObj.parent !== chainGroup) {
            topObj = topObj.parent;
          }
          if (topObj && topObj.userData.blockNumber) {
            setHoveredBlock(topObj.userData.blockNumber);
            canvas.style.cursor = 'pointer';
            return;
          }
        }
      }
      setHoveredBlock(null);
      canvas.style.cursor = 'default';
    };

    const handleClick = () => {
      if (chainGroup.visible) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(chainGroup.children, true);
        if (intersects.length > 0) {
          let topObj: THREE.Object3D | null = intersects[0].object;
          while (topObj && topObj.parent !== chainGroup) {
            topObj = topObj.parent;
          }
          if (topObj && topObj.userData.blockNumber) {
            onSelectBlock(topObj.userData.blockNumber);
            blockchainAudio.playPulsePing(1.2);
          }
        }
      }
    };

    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('click', handleClick);

    // 13. Camera Choreography Targets (Positions for each of the 9 states)
    const cameraTargets: Record<LedgerCameraState, { pos: THREE.Vector3; look: THREE.Vector3 }> = {
      STATE_01_OUTSIDE: {
        pos: new THREE.Vector3(0, 0.4, 9.5),
        look: new THREE.Vector3(0, 0, 0),
      },
      STATE_02_APPROACHING: {
        pos: new THREE.Vector3(1.4, 0.8, 6.2),
        look: new THREE.Vector3(0, 0.1, 0),
      },
      STATE_03_ENTERING: {
        pos: new THREE.Vector3(0.3, 0.2, 3.4),
        look: new THREE.Vector3(0, 0, 0),
      },
      STATE_04_DISASSEMBLY: {
        pos: new THREE.Vector3(0, 0.5, 4.4),
        look: new THREE.Vector3(0, 0, 0),
      },
      STATE_05_VERIFICATION: {
        pos: new THREE.Vector3(-0.4, 0.2, 3.8),
        look: new THREE.Vector3(0, 0, 0),
      },
      STATE_06_SEALING: {
        pos: new THREE.Vector3(0, 0.2, 4.8),
        look: new THREE.Vector3(0, 0, 0),
      },
      STATE_07_CHAIN: {
        pos: new THREE.Vector3(2.5, 3.0, 11.5),
        look: new THREE.Vector3(1.2, 0.2, 1.0),
      },
      STATE_08_INSPECTION: {
        pos: new THREE.Vector3(1.5, 1.2, 4.5),
        look: new THREE.Vector3(1.2, 0.3, 1.2),
      },
      STATE_09_EXIT: {
        pos: new THREE.Vector3(0, 0, 14.0),
        look: new THREE.Vector3(0, 0, 0),
      },
    };

    // 14. Animation Frame Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let pulseScale = 0;
    let pulseOpacity = 0;
    let dropletT = 0;

    const currentLookAt = new THREE.Vector3(0, 0, 0);

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const {
        cameraState: state,
        scrollProgress: prog,
        selectedBlockNumber: selBlock,
        isTampered: tampered,
        isSealed: sealed,
        pulseBlockIndex: pulseIdx,
        isLiveSimulating: liveSim,
        liveStep: lStep,
        reducedMotion: noMotion,
      } = propsRef.current;

      const motionSpeed = noMotion ? 0.1 : 1.0;

      // Camera Target Lerping
      const target = cameraTargets[state] || cameraTargets.STATE_01_OUTSIDE;

      // Adjust based on scrollProgress when in early states
      const lerpFactor = 0.06 * motionSpeed;
      camera.position.lerp(target.pos, lerpFactor);
      currentLookAt.lerp(target.look, lerpFactor);
      camera.lookAt(currentLookAt);

      // Central Cube Idle Rotations
      if (!noMotion) {
        centerBlockGroup.rotation.y = elapsed * 0.25;
        centerBlockGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.08;
        hexGroup.rotation.z = -elapsed * 0.4;
        coreMesh.rotation.y = elapsed * 0.8;
      }

      // 4-Layer Disassembly Expansion in State 04
      const isDisassembled = state === 'STATE_04_DISASSEMBLY' || (state === 'STATE_05_VERIFICATION' && !sealed);
      const targetLayerSpread = isDisassembled ? 0.65 : 0;

      layerMeshes.forEach((mesh, idx) => {
        const defaultY = (idx - 1.5) * 0.38;
        const targetY = (idx - 1.5) * (0.38 + targetLayerSpread);
        mesh.position.y += (targetY - mesh.position.y) * 0.08;
        if (isDisassembled && !noMotion) {
          mesh.rotation.y = (idx % 2 === 0 ? 1 : -1) * elapsed * 0.15;
        }
      });

      // Flake/Particle Movement inside Cube
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        if (!noMotion) {
          positions[i3 + 1] = particleOriginals[i3 + 1] + Math.sin(elapsed * 1.5 + i) * 0.12;
          positions[i3] = particleOriginals[i3] + Math.cos(elapsed * 0.8 + i) * 0.08;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // State 05: Honey Droplet Flying In
      if (state === 'STATE_05_VERIFICATION' || (liveSim && lStep === 'DROPLET_ARRIVING')) {
        dropletMesh.visible = true;
        dropletT = (dropletT + delta * 0.65) % 1.0;
        // Travel from (-4.5, 2.5, 3) into center (0, 0, 0)
        dropletMesh.position.x = -4.5 * (1 - dropletT);
        dropletMesh.position.y = 2.5 * (1 - dropletT);
        dropletMesh.position.z = 3.0 * (1 - dropletT);
        dropletMesh.scale.setScalar(0.24 * (1 - dropletT * 0.5));
      } else {
        dropletMesh.visible = false;
        dropletT = 0;
      }

      // State 06: Block Sealing Emblem & Hexagonal Wave Pulse
      if (sealed || state === 'STATE_06_SEALING') {
        sealMesh.visible = true;
        const targetSealScale = 1.0;
        sealMesh.scale.x += (targetSealScale - sealMesh.scale.x) * 0.1;
        sealMesh.scale.y += (targetSealScale - sealMesh.scale.y) * 0.1;
        sealMesh.scale.z += (targetSealScale - sealMesh.scale.z) * 0.1;

        // Sealing pulse wave expanding
        pulseRing.visible = true;
        pulseScale += delta * 3.5;
        pulseOpacity = Math.max(0, 1 - pulseScale / 5);
        pulseRing.scale.set(pulseScale, pulseScale, 1);
        (pulseRing.material as THREE.MeshBasicMaterial).opacity = pulseOpacity;
        if (pulseScale > 5) {
          pulseScale = 0.2;
        }
      } else {
        sealMesh.visible = false;
        sealMesh.scale.set(0.01, 0.01, 0.01);
        pulseRing.visible = false;
        pulseScale = 0;
      }

      // States 07 & 08: Full 3D Blockchain View
      const showChain = state === 'STATE_07_CHAIN' || state === 'STATE_08_INSPECTION';
      chainGroup.visible = showChain;

      // In State 07/08, fade or hide the large central cube so the chain is prominent
      if (showChain) {
        centerBlockGroup.scale.lerp(new THREE.Vector3(0.01, 0.01, 0.01), 0.08);
      } else {
        centerBlockGroup.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);
      }

      // Animate 3D chain blocks
      if (showChain) {
        chainBlockMeshes.forEach((bGroup, idx) => {
          const bNum = bGroup.userData.blockNumber;
          const isSelected = bNum === selBlock;
          const isLitByPulse = pulseIdx === idx;

          const basePos = chainPositions[idx];
          const targetY = isSelected ? basePos.y + 0.6 : basePos.y;
          const targetZ = isSelected ? basePos.z + 1.2 : basePos.z;

          bGroup.position.y += (targetY - bGroup.position.y) * 0.08;
          bGroup.position.z += (targetZ - bGroup.position.z) * 0.08;

          // Rotation
          if (!noMotion) {
            bGroup.rotation.y = elapsed * 0.2 + idx * 0.4;
          }

          // Visual Materials: Tampered vs Normal vs Pulse
          const mainMesh = bGroup.children[0] as THREE.Mesh;
          const mat = mainMesh.material as THREE.MeshPhysicalMaterial;

          if (tampered && bNum === 182904) {
            // Flash crimson red for tampered block #182904
            mat.color.setHex(0xef4444);
            mat.emissive.setHex(0xb91c1c);
            mat.emissiveIntensity = 0.9 + Math.sin(elapsed * 8) * 0.4;
          } else if (isLitByPulse) {
            // Sequential chain verification pulse flash
            mat.color.setHex(0x38bdf8);
            mat.emissive.setHex(0x0284c7);
            mat.emissiveIntensity = 1.4;
          } else if (isSelected) {
            mat.color.setHex(0xf59e0b);
            mat.emissive.setHex(0xd97706);
            mat.emissiveIntensity = 0.7;
          } else {
            mat.color.setHex(0xd97706);
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0.0;
          }
        });

        // Animate Chain Links (tamper breakage vs intact)
        chainLinks.forEach((link) => {
          const linkMat = link.mesh.material as THREE.MeshStandardMaterial;
          const isBrokenLink = tampered && link.fromIdx === 3; // Link between 182904 and 182905

          if (isBrokenLink) {
            linkMat.color.setHex(0xef4444);
            linkMat.emissive.setHex(0xdc2626);
            linkMat.emissiveIntensity = 1.5 + Math.sin(elapsed * 12) * 0.5;
            link.mesh.scale.set(0.4, 0.4, 0.4); // Severed / broken connection
          } else {
            linkMat.color.setHex(0xfbbf24);
            linkMat.emissive.setHex(0xd97706);
            linkMat.emissiveIntensity = 0.8;
            link.mesh.scale.set(1.0, 1.0, 1.0);
          }
        });
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    // 15. Resize handler
    const handleResize = () => {
      if (!canvas || !container) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 550;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 16. WebGL Context Loss Handler
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animationFrameId);
    };

    const handleContextRestored = () => {
      // Re-trigger loop
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      renderer.dispose();
      cubeGeo.dispose();
      edgesGeo.dispose();
      coreGeo.dispose();
      particleGeo.dispose();
      dropletGeo.dispose();
      sealGeo.dispose();
      pulseRingGeo.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="relative w-full h-[440px] md:h-[560px] overflow-hidden select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* 3D Hover Tooltip */}
      {hoveredBlock && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3.5 py-1.5 rounded-full bg-black/80 border border-amber-500/50 backdrop-blur-md text-xs font-mono text-amber-300 shadow-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Click to Inspect Block #{hoveredBlock} in 3D</span>
        </div>
      )}
    </div>
  );
};
