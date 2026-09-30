/**
 * HoneyChain — "THE DIGITAL NERVOUS SYSTEM"
 * 3D Interactive WebGL Scene (Three.js)
 *
 * Real Hive -> Sensor Nodes -> IoT Gateway -> Backend API ->
 * Oracle Verification Gate -> Path Split -> Smart Contract -> Blockchain
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  StoryStage,
  InteractiveTarget,
  LiveTelemetry,
  VerificationState,
  CapsulePayload,
} from './types';
import { oracleAudio } from './oracleAudio';
import { haptics } from '../../../utils/haptics';

interface DigitalNervousSystem3DProps {
  stage: StoryStage;
  scrollProgress: number; // 0 to 1
  telemetry: LiveTelemetry;
  verificationState: VerificationState;
  onSelectTarget: (target: InteractiveTarget) => void;
  selectedTarget: InteractiveTarget | null;
  isOutlier: boolean;
  isSimulatingHarvest: boolean;
  onVerificationComplete?: () => void;
  onOutlierTriggered?: () => void;
  activeBlockNumber: number;
}

export const DigitalNervousSystem3D: React.FC<DigitalNervousSystem3DProps> = ({
  stage,
  scrollProgress,
  telemetry,
  verificationState,
  onSelectTarget,
  selectedTarget,
  isOutlier,
  isSimulatingHarvest,
  onVerificationComplete,
  onOutlierTriggered,
  activeBlockNumber,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keep a stable ref of props for animation loop
  const propsRef = useRef({
    stage,
    scrollProgress,
    telemetry,
    verificationState,
    selectedTarget,
    isOutlier,
    isSimulatingHarvest,
    activeBlockNumber,
  });

  useEffect(() => {
    propsRef.current = {
      stage,
      scrollProgress,
      telemetry,
      verificationState,
      selectedTarget,
      isOutlier,
      isSimulatingHarvest,
      activeBlockNumber,
    };
  }, [
    stage,
    scrollProgress,
    telemetry,
    verificationState,
    selectedTarget,
    isOutlier,
    isSimulatingHarvest,
    activeBlockNumber,
  ]);

  useEffect(() => {
    const container = mountRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId: number;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060402, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(-10, 4, 22);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff3db, 0.6);
    scene.add(ambientLight);

    const mainAmberLight = new THREE.PointLight(0xf59e0b, 2.2, 50);
    mainAmberLight.position.set(-12, 6, 8);
    scene.add(mainAmberLight);

    const oracleBlueLight = new THREE.PointLight(0x06b6d4, 2.8, 40);
    oracleBlueLight.position.set(7, 4, 6);
    scene.add(oracleBlueLight);

    const blockchainCyanLight = new THREE.PointLight(0x38bdf8, 2.0, 35);
    blockchainCyanLight.position.set(20, 3, 5);
    scene.add(blockchainCyanLight);

    // Interactive clickable meshes registry
    const clickableObjects: { mesh: THREE.Object3D; target: InteractiveTarget }[] = [];

    // Helper: Hexagon cylinder geometry generator
    const createHexGeometry = (radius: number, height: number) => {
      return new THREE.CylinderGeometry(radius, radius, height, 6);
    };

    // -------------------------------------------------------------
    // SECTION 1: THE DIGITAL HIVE (Center-Left at X = -14)
    // -------------------------------------------------------------
    const hiveGroup = new THREE.Group();
    hiveGroup.position.set(-14, 0, 0);
    scene.add(hiveGroup);

    // Hive Body tiers (Stacked wooden honey frames)
    const hiveTierMat = new THREE.MeshStandardMaterial({
      color: 0x1f140a,
      roughness: 0.65,
      metalness: 0.25,
    });
    const hiveEdgeMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      wireframe: true,
    });

    const tierHeights = [-1.6, 0, 1.6];
    tierHeights.forEach((y, i) => {
      const box = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.4, 3.8), hiveTierMat);
      box.position.y = y;
      box.castShadow = true;
      box.receiveShadow = true;
      hiveGroup.add(box);

      const wire = new THREE.Mesh(new THREE.BoxGeometry(4.25, 1.45, 3.85), hiveEdgeMat);
      wire.position.y = y;
      hiveGroup.add(wire);

      // Entrance slit on bottom tier
      if (i === 0) {
        const slit = new THREE.Mesh(
          new THREE.BoxGeometry(2.4, 0.22, 0.2),
          new THREE.MeshBasicMaterial({ color: 0x050302 })
        );
        slit.position.set(0, y - 0.5, 1.95);
        hiveGroup.add(slit);
      }
    });

    // Hive Roof (Angled apiary copper crest)
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(3.6, 1.2, 4),
      new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.4, metalness: 0.6 })
    );
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 2.9;
    hiveGroup.add(roof);

    // Glowing Honeycomb Cells inside Hive Front Facade
    // Representing: 🌡 Temp, 💧 Humidity, ⚖ Weight, 🐝 Bee Activity, 🌱 Environment, 🍯 Honey
    const cellColors = [
      { name: 'temp', color: 0xf97316, pos: [-1.1, 1.5, 1.95], label: '🌡 Temp' },
      { name: 'humidity', color: 0x06b6d4, pos: [0, 1.5, 1.95], label: '💧 Humidity' },
      { name: 'weight', color: 0x10b981, pos: [1.1, 1.5, 1.95], label: '⚖ Weight' },
      { name: 'activity', color: 0xfbbf24, pos: [-0.6, 0.4, 1.95], label: '🐝 Activity' },
      { name: 'env', color: 0x84cc16, pos: [0.6, 0.4, 1.95], label: '🌱 Env' },
      { name: 'honey', color: 0xf59e0b, pos: [0, -0.7, 1.95], label: '🍯 Honey' },
    ];

    const cellMeshes: THREE.Mesh[] = [];
    cellColors.forEach((c) => {
      const cell = new THREE.Mesh(
        createHexGeometry(0.42, 0.1),
        new THREE.MeshStandardMaterial({
          color: c.color,
          emissive: c.color,
          emissiveIntensity: 0.8,
          roughness: 0.2,
        })
      );
      cell.rotation.x = Math.PI / 2;
      cell.position.set(c.pos[0], c.pos[1], c.pos[2]);
      hiveGroup.add(cell);
      cellMeshes.push(cell);
    });

    clickableObjects.push({ mesh: hiveGroup, target: 'hive' });

    // Floating 3D Worker Bees orbiting the hive
    const beeCount = 6;
    const bees: { group: THREE.Group; orbitRadius: number; orbitSpeed: number; phase: number; yOffset: number; wingL: THREE.Mesh; wingR: THREE.Mesh }[] = [];
    for (let i = 0; i < beeCount; i++) {
      const bGroup = new THREE.Group();
      // Bee body (black & amber striped cylinder)
      const bBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.1, 0.35, 8),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
      );
      bBody.rotation.x = Math.PI / 2;
      bGroup.add(bBody);

      // Bee head
      const bHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x181005 })
      );
      bHead.position.z = 0.22;
      bGroup.add(bHead);

      // Translucent fluttering wings
      const wingMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.75,
        roughness: 0.1,
      });
      const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.14), wingMat);
      wingL.position.set(-0.16, 0.1, 0);
      bGroup.add(wingL);

      const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.14), wingMat);
      wingR.position.set(0.16, 0.1, 0);
      bGroup.add(wingR);

      scene.add(bGroup);
      bees.push({
        group: bGroup,
        orbitRadius: 3.2 + Math.random() * 2.2,
        orbitSpeed: 0.6 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        yOffset: -0.5 + Math.random() * 3.5,
        wingL,
        wingR,
      });
    }

    // -------------------------------------------------------------
    // SECTION 2: SENSOR NODES (Attached physical hardware)
    // -------------------------------------------------------------
    const sensorNodes: {
      target: InteractiveTarget;
      position: THREE.Vector3;
      object: THREE.Group;
      pulseColor: number;
    }[] = [];

    // 1. Temperature Sensor: Glowing Thermometer Probe attached to upper hive wall
    const tempSensorGroup = new THREE.Group();
    tempSensorGroup.position.set(-11.5, 1.6, 1.8);
    // Brass bracket
    const tBracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.8, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x78350f, metalness: 0.8 })
    );
    tempSensorGroup.add(tBracket);
    // Glass tube
    const tTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.9, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 })
    );
    tempSensorGroup.add(tTube);
    // Glowing mercury core
    const tMercury = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.6, 12),
      new THREE.MeshBasicMaterial({ color: 0xf97316 })
    );
    tMercury.position.y = -0.15;
    tempSensorGroup.add(tMercury);
    scene.add(tempSensorGroup);
    clickableObjects.push({ mesh: tempSensorGroup, target: 'sensor_temp' });
    sensorNodes.push({
      target: 'sensor_temp',
      position: tempSensorGroup.position,
      object: tempSensorGroup,
      pulseColor: 0xf97316,
    });

    // 2. Humidity Sensor: Small Atmospheric Pod on chamber side
    const humSensorGroup = new THREE.Group();
    humSensorGroup.position.set(-12.0, -1.0, 2.2);
    const humPod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.35, 16),
      new THREE.MeshStandardMaterial({ color: 0x0e7490, metalness: 0.7, roughness: 0.3 })
    );
    humSensorGroup.add(humPod);
    const humGlowRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.26, 0.03, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
    );
    humGlowRing.rotation.x = Math.PI / 2;
    humSensorGroup.add(humGlowRing);
    scene.add(humSensorGroup);
    clickableObjects.push({ mesh: humSensorGroup, target: 'sensor_humidity' });
    sensorNodes.push({
      target: 'sensor_humidity',
      position: humSensorGroup.position,
      object: humSensorGroup,
      pulseColor: 0x06b6d4,
    });

    // 3. Weight Sensor: Industrial Digital Scale Platform beneath the hive
    const weightSensorGroup = new THREE.Group();
    weightSensorGroup.position.set(-14.0, -2.7, 0);
    // Heavy base
    const scaleBase = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 0.35, 4.4),
      new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.9, roughness: 0.2 })
    );
    scaleBase.receiveShadow = true;
    weightSensorGroup.add(scaleBase);
    // 4 Strain-gauge load cells
    const loadCellMat = new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.8 });
    [[-1.8, -1.6], [1.8, -1.6], [-1.8, 1.6], [1.8, 1.6]].forEach(([lx, lz]) => {
      const lc = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.25, 12), loadCellMat);
      lc.position.set(lx, 0.25, lz);
      weightSensorGroup.add(lc);
    });
    // Glowing LED Readout Strip
    const ledReadout = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.16, 0.08),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    ledReadout.position.set(0, 0.05, 2.22);
    weightSensorGroup.add(ledReadout);
    scene.add(weightSensorGroup);
    clickableObjects.push({ mesh: weightSensorGroup, target: 'sensor_weight' });
    sensorNodes.push({
      target: 'sensor_weight',
      position: new THREE.Vector3(-12.4, -2.5, 1.8),
      object: weightSensorGroup,
      pulseColor: 0x10b981,
    });

    // 4. Bee Activity Sensor: Optical Scanner Frame at hive entrance
    const activitySensorGroup = new THREE.Group();
    activitySensorGroup.position.set(-11.6, 0.2, 1.9);
    const actFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.9, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.3 })
    );
    activitySensorGroup.add(actFrame);
    // Mini optical scanning laser emitter
    const actLaser = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
    );
    actLaser.position.set(0, 0.3, 0.1);
    activitySensorGroup.add(actLaser);
    scene.add(activitySensorGroup);
    clickableObjects.push({ mesh: activitySensorGroup, target: 'sensor_activity' });
    sensorNodes.push({
      target: 'sensor_activity',
      position: activitySensorGroup.position,
      object: activitySensorGroup,
      pulseColor: 0xfbbf24,
    });

    // 5. Environment Weather Sensor: Ambient Weather Probe
    const envSensorGroup = new THREE.Group();
    envSensorGroup.position.set(-16.0, 2.4, 1.2);
    const envPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 1.4, 12),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7 })
    );
    envSensorGroup.add(envPole);
    const envDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x84cc16, emissive: 0x84cc16, emissiveIntensity: 0.5 })
    );
    envDome.position.y = 0.7;
    envSensorGroup.add(envDome);
    scene.add(envSensorGroup);
    clickableObjects.push({ mesh: envSensorGroup, target: 'sensor_env' });
    sensorNodes.push({
      target: 'sensor_env',
      position: envSensorGroup.position,
      object: envSensorGroup,
      pulseColor: 0x84cc16,
    });

    // -------------------------------------------------------------
    // SECTION 3 & 4: IOT GATEWAY (Hexagonal Hub at X = -6)
    // -------------------------------------------------------------
    const gatewayGroup = new THREE.Group();
    gatewayGroup.position.set(-6, 0, 0);
    scene.add(gatewayGroup);

    // Outer Hexagonal Hub Enclosure
    const gwBase = new THREE.Mesh(
      createHexGeometry(1.6, 0.8),
      new THREE.MeshStandardMaterial({
        color: 0x131d27,
        metalness: 0.85,
        roughness: 0.25,
      })
    );
    gwBase.rotation.x = Math.PI / 2;
    gatewayGroup.add(gwBase);

    // Glowing Inner Aggregation Core
    const gwCore = new THREE.Mesh(
      createHexGeometry(0.9, 0.85),
      new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.8,
        roughness: 0.1,
      })
    );
    gwCore.rotation.x = Math.PI / 2;
    gatewayGroup.add(gwCore);

    // Outer Hex Wireframe Ring
    const gwWire = new THREE.Mesh(
      createHexGeometry(1.7, 0.88),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true })
    );
    gwWire.rotation.x = Math.PI / 2;
    gatewayGroup.add(gwWire);

    clickableObjects.push({ mesh: gatewayGroup, target: 'gateway' });

    // Glowing Conduit Lines connecting 5 Sensors -> Gateway
    const conduits: THREE.Line[] = [];
    sensorNodes.forEach((s) => {
      const curve = new THREE.QuadraticBezierCurve3(
        s.position,
        new THREE.Vector3((s.position.x + gatewayGroup.position.x) / 2, s.position.y + 1.2, s.position.z / 2),
        gatewayGroup.position
      );
      const points = curve.getPoints(30);
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: s.pulseColor,
        transparent: true,
        opacity: 0.65,
      });
      const line = new THREE.Line(geom, mat);
      scene.add(line);
      conduits.push(line);
    });

    // -------------------------------------------------------------
    // SECTION 5 & 6: BACKEND API HIGHWAY (Digital Honeycomb Portal at X = 0)
    // -------------------------------------------------------------
    const apiGroup = new THREE.Group();
    apiGroup.position.set(0, 0, 0);
    scene.add(apiGroup);

    // Portal Ring Arch
    const apiArch = new THREE.Mesh(
      new THREE.TorusGeometry(2.0, 0.28, 16, 6), // Hexagonal torus!
      new THREE.MeshStandardMaterial({
        color: 0x082f49,
        metalness: 0.9,
        roughness: 0.2,
      })
    );
    apiGroup.add(apiArch);

    // Inner glowing transformation wave
    const apiField = new THREE.Mesh(
      new THREE.CircleGeometry(1.75, 6),
      new THREE.MeshBasicMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      })
    );
    apiGroup.add(apiField);

    clickableObjects.push({ mesh: apiGroup, target: 'api' });

    // Bridge Conduit from Gateway -> API
    const gwToApiCurve = new THREE.LineCurve3(gatewayGroup.position, apiGroup.position);
    const gwToApiGeom = new THREE.BufferGeometry().setFromPoints(gwToApiCurve.getPoints(20));
    const gwToApiLine = new THREE.Line(
      gwToApiGeom,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 })
    );
    scene.add(gwToApiLine);

    // -------------------------------------------------------------
    // SECTION 7 & 8: THE ORACLE GATE (Hero Verification Portal at X = 7)
    // -------------------------------------------------------------
    const oracleGroup = new THREE.Group();
    oracleGroup.position.set(7, 0, 0);
    scene.add(oracleGroup);

    // Grand Hexagonal Verification Gate Portal
    const oracleArchMat = new THREE.MeshStandardMaterial({
      color: 0x0c2538,
      metalness: 0.95,
      roughness: 0.15,
    });
    const oracleArch = new THREE.Mesh(
      new THREE.TorusGeometry(2.7, 0.4, 16, 6),
      oracleArchMat
    );
    oracleGroup.add(oracleArch);

    // Outer Rotating Verification Ring with Tech Runes
    const oracleOuterRing = new THREE.Mesh(
      new THREE.RingGeometry(2.8, 3.1, 6),
      new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        side: THREE.DoubleSide,
      })
    );
    oracleGroup.add(oracleOuterRing);

    // Inner Counter-Rotating Scanning Ring
    const oracleInnerRing = new THREE.Mesh(
      new THREE.RingGeometry(2.2, 2.45, 6),
      new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      })
    );
    oracleGroup.add(oracleInnerRing);

    // Laser Scan Beam Plane across the center
    const scanPlaneMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const scanPlane = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.15), scanPlaneMat);
    oracleGroup.add(scanPlane);

    clickableObjects.push({ mesh: oracleGroup, target: 'oracle' });

    // Bridge Conduit from API -> Oracle
    const apiToOracleCurve = new THREE.LineCurve3(apiGroup.position, oracleGroup.position);
    const apiToOracleGeom = new THREE.BufferGeometry().setFromPoints(apiToOracleCurve.getPoints(20));
    const apiToOracleLine = new THREE.Line(
      apiToOracleGeom,
      new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.8 })
    );
    scene.add(apiToOracleLine);

    // -------------------------------------------------------------
    // SECTION 10: VERIFIED DATA SPLIT
    // PATH A: Application / HIVE AI (Branching Upward at X = 13, Y = 3.2)
    // PATH B: Trust Layer / Smart Contract (Branching Downward at X = 13, Y = -1.5)
    // -------------------------------------------------------------

    // PATH A — HIVE AI NODE
    const aiNodeGroup = new THREE.Group();
    aiNodeGroup.position.set(13, 3.2, 0);
    scene.add(aiNodeGroup);

    const aiMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.2, 1),
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.7,
        roughness: 0.2,
      })
    );
    aiNodeGroup.add(aiMesh);

    const aiWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.3, 1),
      new THREE.MeshBasicMaterial({ color: 0x34d399, wireframe: true })
    );
    aiNodeGroup.add(aiWire);
    clickableObjects.push({ mesh: aiNodeGroup, target: 'ai_node' });

    // Path A Conduit: Oracle -> AI
    const oracleToAiCurve = new THREE.QuadraticBezierCurve3(
      oracleGroup.position,
      new THREE.Vector3(10, 2.2, 0),
      aiNodeGroup.position
    );
    const oracleToAiLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(oracleToAiCurve.getPoints(25)),
      new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.65 })
    );
    scene.add(oracleToAiLine);

    // PATH B — SMART CONTRACT NODE (Decision Gate at X = 13, Y = -1.5)
    const smartContractGroup = new THREE.Group();
    smartContractGroup.position.set(13, -1.5, 0);
    scene.add(smartContractGroup);

    const scMesh = new THREE.Mesh(
      createHexGeometry(1.4, 0.7),
      new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        metalness: 0.85,
        roughness: 0.3,
      })
    );
    scMesh.rotation.x = Math.PI / 2;
    smartContractGroup.add(scMesh);

    const scCore = new THREE.Mesh(
      createHexGeometry(0.8, 0.8),
      new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        emissive: 0x4f46e5,
        emissiveIntensity: 0.8,
      })
    );
    scCore.rotation.x = Math.PI / 2;
    smartContractGroup.add(scCore);

    clickableObjects.push({ mesh: smartContractGroup, target: 'smart_contract' });

    // Path B Conduit: Oracle -> Smart Contract
    const oracleToScCurve = new THREE.QuadraticBezierCurve3(
      oracleGroup.position,
      new THREE.Vector3(10, -1.0, 0),
      smartContractGroup.position
    );
    const oracleToScLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(oracleToScCurve.getPoints(25)),
      new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.8 })
    );
    scene.add(oracleToScLine);

    // -------------------------------------------------------------
    // SECTION 12: BLOCKCHAIN (Blocks at X = 18.5, 21.5, 24.5, Y = -1.5)
    // -------------------------------------------------------------
    const blockchainGroup = new THREE.Group();
    scene.add(blockchainGroup);

    const blocks: { group: THREE.Group; number: number; coreMesh: THREE.Mesh }[] = [];
    const blockNumbers = [
      activeBlockNumber - 2,
      activeBlockNumber - 1,
      activeBlockNumber,
    ];
    blockNumbers.forEach((bNum, idx) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(18.2 + idx * 2.8, -1.5, 0);

      // Hexagonal Block Shell
      const bShell = new THREE.Mesh(
        createHexGeometry(1.0, 0.8),
        new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          metalness: 0.9,
          roughness: 0.2,
        })
      );
      bShell.rotation.x = Math.PI / 2;
      bGroup.add(bShell);

      // Core glow
      const bCore = new THREE.Mesh(
        createHexGeometry(0.65, 0.85),
        new THREE.MeshStandardMaterial({
          color: idx === 2 ? 0xf59e0b : 0x0284c7,
          emissive: idx === 2 ? 0xd97706 : 0x0369a1,
          emissiveIntensity: idx === 2 ? 1.0 : 0.6,
        })
      );
      bCore.rotation.x = Math.PI / 2;
      bGroup.add(bCore);

      // Cryptographic chain link to previous block
      if (idx > 0) {
        const link = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9 })
        );
        link.rotation.z = Math.PI / 2;
        link.position.set(-1.4, 0, 0);
        bGroup.add(link);
      }

      blockchainGroup.add(bGroup);
      blocks.push({ group: bGroup, number: bNum, coreMesh: bCore });
      clickableObjects.push({ mesh: bGroup, target: 'blockchain' });
    });

    // Conduit: Smart Contract -> First Block
    const scToBcLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([smartContractGroup.position, blocks[0].group.position]),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 })
    );
    scene.add(scToBcLine);

    // -------------------------------------------------------------
    // DATA PACKET & MOVING PULSES
    // -------------------------------------------------------------
    // 1. Moving Sensor Pulses (Small, glowing spheres)
    const activePulses: {
      mesh: THREE.Mesh;
      path: THREE.QuadraticBezierCurve3;
      progress: number;
      speed: number;
    }[] = [];

    const pulseSphereGeom = new THREE.SphereGeometry(0.18, 12, 12);
    const spawnPulse = (sensorIndex: number) => {
      const s = sensorNodes[sensorIndex];
      const curve = new THREE.QuadraticBezierCurve3(
        s.position,
        new THREE.Vector3((s.position.x + gatewayGroup.position.x) / 2, s.position.y + 1.2, s.position.z / 2),
        gatewayGroup.position
      );
      const mesh = new THREE.Mesh(
        pulseSphereGeom,
        new THREE.MeshBasicMaterial({ color: s.pulseColor })
      );
      mesh.position.copy(s.position);
      scene.add(mesh);
      activePulses.push({
        mesh,
        path: curve,
        progress: 0,
        speed: 0.015 + Math.random() * 0.008,
      });
      oracleAudio.playPulseEmit(400 + sensorIndex * 80);
    };

    // 2. The Main Hexagonal Data Capsule (The travelling payload!)
    const capsuleGroup = new THREE.Group();
    const capBody = new THREE.Mesh(
      createHexGeometry(0.55, 0.4),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      })
    );
    capBody.rotation.x = Math.PI / 2;
    capsuleGroup.add(capBody);

    const capGlow = new THREE.Mesh(
      createHexGeometry(0.65, 0.42),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, wireframe: true })
    );
    capGlow.rotation.x = Math.PI / 2;
    capsuleGroup.add(capGlow);
    scene.add(capsuleGroup);
    capsuleGroup.position.set(-6, 0, 0);

    // Full 7-stage pathway for the data capsule:
    // 1: Gateway (-6, 0, 0)
    // 2: Backend API (0, 0, 0)
    // 3: Oracle Verification Gate (7, 0, 0)
    // 4: Smart Contract (13, -1.5, 0)
    // 5: Blockchain Block 3 (23.8, -1.5, 0)
    const capsulePathway = [
      new THREE.Vector3(-6, 0, 0),    // Stage 4: Gateway
      new THREE.Vector3(0, 0, 0),     // Stage 5: API
      new THREE.Vector3(7, 0, 0),     // Stage 6: Oracle
      new THREE.Vector3(13, -1.5, 0), // Stage 7: Smart Contract
      new THREE.Vector3(23.8, -1.5, 0),// Stage 8: Blockchain Block
    ];

    // Ambient floating dust particles
    const particleCount = 200;
    const particleGeom = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 50;
      particlePos[i + 1] = (Math.random() - 0.5) * 16;
      particlePos[i + 2] = (Math.random() - 0.5) * 20;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.12,
      transparent: true,
      opacity: 0.45,
    });
    const dustParticles = new THREE.Points(particleGeom, particleMat);
    scene.add(dustParticles);

    // -------------------------------------------------------------
    // RAYCASTING & INTERACTION
    // -------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check intersections
      for (const item of clickableObjects) {
        const intersects = raycaster.intersectObject(item.mesh, true);
        if (intersects.length > 0) {
          haptics.buttonClick();
          onSelectTarget(item.target);
          return;
        }
      }
    };

    canvas.addEventListener('click', handlePointerDown);

    // Target Camera Coordinates for each Stage
    const stageCameraMap: Record<StoryStage, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
      hive: {
        pos: new THREE.Vector3(-14, 2.0, 9.5),
        target: new THREE.Vector3(-14, 0, 0),
      },
      sensors: {
        pos: new THREE.Vector3(-11, 0.5, 7.0),
        target: new THREE.Vector3(-12.5, 0, 1.2),
      },
      convergence: {
        pos: new THREE.Vector3(-9, 1.5, 9.5),
        target: new THREE.Vector3(-8.5, 0, 0),
      },
      gateway: {
        pos: new THREE.Vector3(-6, 2.2, 7.2),
        target: new THREE.Vector3(-6, 0, 0),
      },
      api: {
        pos: new THREE.Vector3(0, 1.8, 7.0),
        target: new THREE.Vector3(0, 0, 0),
      },
      oracle: {
        pos: new THREE.Vector3(7, 1.6, 8.5),
        target: new THREE.Vector3(7, 0, 0),
      },
      smart_contract: {
        pos: new THREE.Vector3(13, 0.8, 7.5),
        target: new THREE.Vector3(13, -0.8, 0),
      },
      blockchain: {
        pos: new THREE.Vector3(21, 0.5, 8.0),
        target: new THREE.Vector3(21, -1.0, 0),
      },
      overview: {
        pos: new THREE.Vector3(4, 5.5, 32),
        target: new THREE.Vector3(4, 0, 0),
      },
    };

    let currentCameraPos = camera.position.clone();
    let currentCameraTarget = new THREE.Vector3(0, 0, 0);

    // Pulse emitter timer
    let lastPulseTime = 0;
    let pulseSensorIndex = 0;

    // Scan beam animation
    let scanBeamY = 0;
    let scanBeamDir = 1;

    // -------------------------------------------------------------
    // MAIN RENDER LOOP (60 FPS)
    // -------------------------------------------------------------
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const currentProps = propsRef.current;

      // 1. Organic Hive Movement
      hiveGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.12;

      // 2. Bees movement & wing fluttering
      bees.forEach((b) => {
        const angle = elapsedTime * b.orbitSpeed + b.phase;
        b.group.position.x = -14 + Math.cos(angle) * b.orbitRadius;
        b.group.position.z = Math.sin(angle) * b.orbitRadius;
        b.group.position.y = b.yOffset + Math.sin(elapsedTime * 3 + b.phase) * 0.3;
        b.group.rotation.y = -angle + Math.PI / 2;

        // Wing flutter
        const wingRot = Math.sin(elapsedTime * 45) * 0.6;
        b.wingL.rotation.z = wingRot;
        b.wingR.rotation.z = -wingRot;
      });

      // 3. Oracle Rotating Rings & Scan Beam
      oracleOuterRing.rotation.z = elapsedTime * 0.4;
      oracleInnerRing.rotation.z = -elapsedTime * 0.6;

      scanBeamY += scanBeamDir * delta * 2.2;
      if (scanBeamY > 1.8) {
        scanBeamY = 1.8;
        scanBeamDir = -1;
      } else if (scanBeamY < -1.8) {
        scanBeamY = -1.8;
        scanBeamDir = 1;
      }
      scanPlane.position.y = scanBeamY;

      // Oracle colors according to Outlier / Verified state
      if (currentProps.isOutlier) {
        scanPlaneMat.color.setHex(0xef4444); // Red/Amber outlier alert
        (oracleOuterRing.material as THREE.MeshBasicMaterial).color.setHex(0xf59e0b);
      } else if (currentProps.verificationState === 'verified') {
        scanPlaneMat.color.setHex(0x10b981); // Emerald verified
        (oracleOuterRing.material as THREE.MeshBasicMaterial).color.setHex(0x06b6d4);
      } else {
        scanPlaneMat.color.setHex(0x06b6d4); // Cyan scanning
        (oracleOuterRing.material as THREE.MeshBasicMaterial).color.setHex(0x06b6d4);
      }

      // 4. IoT Gateway core pulse
      gwCore.rotation.z = elapsedTime * 0.8;
      const gwPulse = 0.7 + Math.sin(elapsedTime * 4) * 0.3;
      (gwCore.material as THREE.MeshStandardMaterial).emissiveIntensity = gwPulse;

      // 5. Backend API Honeycomb field pulse
      apiArch.rotation.z = Math.sin(elapsedTime * 0.5) * 0.1;
      (apiField.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(elapsedTime * 3) * 0.15;

      // 6. AI Node rotation
      aiMesh.rotation.x = elapsedTime * 0.5;
      aiMesh.rotation.y = elapsedTime * 0.7;
      aiWire.rotation.y = -elapsedTime * 0.3;

      // 7. Blockchain rotation & glow
      blocks.forEach((b, idx) => {
        b.coreMesh.rotation.z = elapsedTime * (0.4 + idx * 0.1);
        if (idx === 2) {
          (b.coreMesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
            0.8 + Math.sin(elapsedTime * 5) * 0.4;
        }
      });

      // 8. Dynamic Sensor Pulses Generation
      if (elapsedTime - lastPulseTime > 1.2) {
        lastPulseTime = elapsedTime;
        spawnPulse(pulseSensorIndex % sensorNodes.length);
        pulseSensorIndex++;
      }

      // Update active sensor pulses
      for (let i = activePulses.length - 1; i >= 0; i--) {
        const p = activePulses[i];
        p.progress += p.speed;
        if (p.progress >= 1.0) {
          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          activePulses.splice(i, 1);
          // Illuminates gateway briefly
          oracleAudio.playGatewayAggregate();
        } else {
          p.mesh.position.copy(p.path.getPoint(p.progress));
        }
      }

      // 9. Data Capsule Motion Along Pathway
      // Map scrollProgress (0 to 1) or stage to pathway position
      let capsulePos = new THREE.Vector3(-6, 0, 0);
      let targetProgress = currentProps.scrollProgress;

      // Stage override if user navigated by stages
      if (currentProps.stage === 'gateway') targetProgress = 0.45;
      else if (currentProps.stage === 'api') targetProgress = 0.60;
      else if (currentProps.stage === 'oracle') targetProgress = 0.72;
      else if (currentProps.stage === 'smart_contract') targetProgress = 0.85;
      else if (currentProps.stage === 'blockchain') targetProgress = 1.0;

      // If outlier detected, hold capsule at Oracle gate (X = 7)
      if (currentProps.isOutlier && targetProgress >= 0.70) {
        capsulePos.set(7, 0, 0);
        (capBody.material as THREE.MeshStandardMaterial).color.setHex(0xef4444);
        (capBody.material as THREE.MeshStandardMaterial).emissive.setHex(0xb91c1c);
      } else {
        // Normal pathway interpolation across the 5 nodes
        if (targetProgress < 0.45) {
          capsulePos.copy(capsulePathway[0]); // at Gateway
        } else if (targetProgress < 0.60) {
          const t = (targetProgress - 0.45) / 0.15;
          capsulePos.lerpVectors(capsulePathway[0], capsulePathway[1], t);
        } else if (targetProgress < 0.75) {
          const t = (targetProgress - 0.60) / 0.15;
          capsulePos.lerpVectors(capsulePathway[1], capsulePathway[2], t);
        } else if (targetProgress < 0.88) {
          const t = (targetProgress - 0.75) / 0.13;
          capsulePos.lerpVectors(capsulePathway[2], capsulePathway[3], t);
        } else {
          const t = Math.min((targetProgress - 0.88) / 0.12, 1.0);
          capsulePos.lerpVectors(capsulePathway[3], capsulePathway[4], t);
        }

        // Color transition
        if (targetProgress >= 0.75) {
          // Verified golden/cyan
          (capBody.material as THREE.MeshStandardMaterial).color.setHex(0x10b981);
          (capBody.material as THREE.MeshStandardMaterial).emissive.setHex(0x059669);
        } else {
          (capBody.material as THREE.MeshStandardMaterial).color.setHex(0xf59e0b);
          (capBody.material as THREE.MeshStandardMaterial).emissive.setHex(0xd97706);
        }
      }

      // Smooth capsule translation
      capsuleGroup.position.lerp(capsulePos, 0.1);
      capsuleGroup.rotation.y = elapsedTime * 1.5;

      // 10. Smooth Camera Orbit / Navigation
      const targetCam = stageCameraMap[currentProps.stage] || stageCameraMap.hive;
      currentCameraPos.lerp(targetCam.pos, 0.05);
      currentCameraTarget.lerp(targetCam.target, 0.05);

      camera.position.copy(currentCameraPos);
      camera.lookAt(currentCameraTarget);

      // Dust particles drift
      dustParticles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handlePointerDown);

      // Dispose Three.js objects
      scene.clear();
      renderer.dispose();
      particleGeom.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="relative w-full h-full select-none overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
    </div>
  );
};
