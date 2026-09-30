/**
 * HoneyChain — DigitalHive Component
 * Built with React Three Fiber (@react-three/fiber)
 *
 * Renders a stylized, 3D hexagonal honeycomb structure at the center-left.
 * Features:
 * - 19-cell interlocking 3D hexagonal honeycomb lattice with beveled cell chambers
 * - Procedural pulsing animations on individual cells reflecting dynamic IoT telemetry:
 *   - 🌡 Temperature: Frequency-modulated brood pulse, shifts to rapid alarm on outlier (>38°C)
 *   - 💧 Humidity: Smooth hygrometric tidal breathing wave
 *   - ⚖ Weight: Heavy rhythmic load respiration with radial breathing expansion
 *   - 🐝 Bee Activity: High-frequency stochastic traffic flutter
 *   - 🌱 Environment: Gentle ambient microclimate ripple
 *   - 🍯 Honey Store: Deep golden liquid honey luminescence
 *   - Surrounding Comb: Procedural harmonic ripple radiating from center
 * - Organic bee particle swarm: 70+ glowing bee particles simulating natural foraging
 *   using multi-frequency 3D vector fields, clustering near cell entrances and hovering,
 *   supplemented by stylized worker bees with oscillating wings.
 */

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LiveTelemetry, InteractiveTarget } from './types';
import { oracleAudio } from './oracleAudio';
import { haptics } from '../../../utils/haptics';

export interface DigitalHiveProps {
  /** 3D position vector in the scene. Defaults to center-left [-3.8, 0, 0] */
  position?: [number, number, number];
  /** Scale multiplier for the hive */
  scale?: number;
  /** Live telemetry data driving the cell metrics and procedural pulse frequencies */
  telemetry?: Partial<LiveTelemetry>;
  /** Whether an outlier anomaly is currently active */
  isOutlier?: boolean;
  /** Callback when user clicks on the hive or one of its sensory cells */
  onSelectTarget?: (target: InteractiveTarget) => void;
  /** Callback when hovering over an interactive cell */
  onHoverCell?: (cellName: string | null) => void;
  /** Active selected target to highlight */
  selectedTarget?: InteractiveTarget | null;
}

// -------------------------------------------------------------
// ORGANIC BEE PARTICLE SWARM COMPONENT (60-80 PARTICLES)
// -------------------------------------------------------------
const BeeParticleSwarm: React.FC<{ count?: number }> = ({ count = 75 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Initialize particle orbits & parameters
  const [positions, particleMeta] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const meta = [];

    for (let i = 0; i < count; i++) {
      // Base center near the honeycomb cluster
      const baseRadius = 1.4 + Math.random() * 3.8;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * baseRadius;
      const y = (Math.random() - 0.5) * 4.2;
      const z = (Math.random() - 0.5) * 3.5 + 0.8;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      meta.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        radius: baseRadius,
        orbitSpeed: (0.4 + Math.random() * 0.7) * (Math.random() > 0.5 ? 1 : -1),
        bobFreq: 1.5 + Math.random() * 2.5,
        bobAmp: 0.25 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        dartPhase: Math.random() * Math.PI * 2,
        dartSpeed: 0.8 + Math.random() * 1.2,
      });
    }

    return [pos, meta];
  }, [count]);

  // Update particle positions procedurally each frame
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const m = particleMeta[i];

      // Procedural orbit & Lissajous hovering motion
      const currentAngle = t * m.orbitSpeed + m.phase;
      const dart = Math.sin(t * m.dartSpeed + m.dartPhase);

      const rad = m.radius + dart * 0.45;
      const x = Math.cos(currentAngle) * rad;
      const y = m.baseY + Math.sin(t * m.bobFreq + m.phase) * m.bobAmp;
      const z = Math.sin(currentAngle) * (rad * 0.8) + Math.cos(t * 2.1 + m.phase) * 0.3 + 0.6;

      array[i * 3] = x;
      array[i * 3 + 1] = y;
      array[i * 3 + 2] = z;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#fbbf24"
        size={0.14}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// -------------------------------------------------------------
// STYLIZED WORKER BEE AGENT (HERO BEES WITH FLUTTERING WINGS)
// -------------------------------------------------------------
interface BeeProps {
  orbitRadius: number;
  orbitSpeed: number;
  phase: number;
  yOffset: number;
  bobFreq: number;
}

const WorkerBee: React.FC<BeeProps> = ({
  orbitRadius,
  orbitSpeed,
  phase,
  yOffset,
  bobFreq,
}) => {
  const beeGroupRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (beeGroupRef.current) {
      const angle = t * orbitSpeed + phase;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      const y = yOffset + Math.sin(t * bobFreq + phase) * 0.45;

      beeGroupRef.current.position.set(x, y, z);
      beeGroupRef.current.rotation.y = -angle + Math.PI / 2;
      beeGroupRef.current.rotation.z = Math.sin(t * 3 + phase) * 0.15;
    }

    if (leftWingRef.current && rightWingRef.current) {
      const wingAngle = Math.sin(t * 48) * 0.65;
      leftWingRef.current.rotation.z = wingAngle;
      rightWingRef.current.rotation.z = -wingAngle;
    }
  });

  return (
    <group ref={beeGroupRef}>
      {/* Abdomen / Body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.1, 0.38, 8]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* Abdomen Dark Stripe */}
      <mesh position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.135, 0.135, 0.1, 8]} />
        <meshStandardMaterial color="#1a1106" roughness={0.6} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0, 0.24]}>
        <sphereGeometry args={[0.11, 8, 8]} />
        <meshStandardMaterial color="#1c1208" roughness={0.5} />
      </mesh>

      {/* Translucent Wings */}
      <mesh ref={leftWingRef} position={[-0.18, 0.1, 0.02]}>
        <boxGeometry args={[0.26, 0.015, 0.14]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      <mesh ref={rightWingRef} position={[0.18, 0.1, 0.02]}>
        <boxGeometry args={[0.26, 0.015, 0.14]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// PROCEDURAL HONEYCOMB CELL CONFIGURATIONS
// -------------------------------------------------------------
export interface HexCellData {
  id: string;
  gridX: number; // Hex axial coordinates
  gridY: number;
  worldPos: [number, number, number];
  role: 'temp' | 'humidity' | 'weight' | 'activity' | 'env' | 'honey' | 'comb';
  target?: InteractiveTarget;
  title: string;
  color: string;
  depth: number;
}

// Generate an authentic 19-cell interlocking hexagonal honeycomb cluster
const HEX_RADIUS = 0.52;
const HEX_WIDTH = Math.sqrt(3) * HEX_RADIUS; // horizontal spacing between centers
const HEX_HEIGHT = 1.5 * HEX_RADIUS; // vertical spacing between centers

function generateHoneycombLattice(): HexCellData[] {
  const cells: HexCellData[] = [];

  // Axial grid offsets for a 3-ring hexagonal cluster (19 cells)
  const coords: [number, number, HexCellData['role'], string, string, InteractiveTarget | undefined][] = [
    // Center: Honey Store / Extractable Super Core
    [0, 0, 'honey', 'Honey Core', '#f59e0b', 'hive'],

    // Ring 1 (6 cells - Primary IoT Telemetry Sensory Organs)
    [0, 1, 'temp', 'Brood Temperature', '#f97316', 'sensor_temp'],
    [1, 0, 'humidity', 'Chamber Humidity', '#06b6d4', 'sensor_humidity'],
    [1, -1, 'weight', 'Platform Weight', '#10b981', 'sensor_weight'],
    [0, -1, 'activity', 'Forager Traffic', '#fbbf24', 'sensor_activity'],
    [-1, 0, 'env', 'Ambient Microclimate', '#84cc16', 'sensor_env'],
    [-1, 1, 'comb', 'Nectar Comb North-West', '#d97706', 'hive'],

    // Ring 2 (12 surrounding structural cells with procedural wave propagation)
    [0, 2, 'comb', 'Comb Storage N', '#b45309', 'hive'],
    [1, 1, 'comb', 'Comb Storage NE', '#b45309', 'hive'],
    [2, 0, 'comb', 'Pollen Reserve E', '#b45309', 'hive'],
    [2, -1, 'comb', 'Comb Storage SE', '#b45309', 'hive'],
    [2, -2, 'comb', 'Brood Support SE-2', '#b45309', 'hive'],
    [1, -2, 'comb', 'Comb Storage S', '#b45309', 'hive'],
    [0, -2, 'comb', 'Comb Storage S-2', '#b45309', 'hive'],
    [-1, -1, 'comb', 'Pollen Reserve SW', '#b45309', 'hive'],
    [-2, 0, 'comb', 'Comb Storage W', '#b45309', 'hive'],
    [-2, 1, 'comb', 'Wax Gland Cell W-2', '#b45309', 'hive'],
    [-2, 2, 'comb', 'Nectar Store NW', '#b45309', 'hive'],
    [-1, 2, 'comb', 'Comb Storage NNW', '#b45309', 'hive'],
  ];

  coords.forEach(([q, r, role, title, color, target], idx) => {
    // Hexagonal geometry axial-to-cartesian projection
    const x = HEX_RADIUS * Math.sqrt(3) * (q + r / 2);
    const y = HEX_RADIUS * (3 / 2) * r;
    // Vary cell depth slightly for organic 3D relief
    const zOffset = role === 'honey' ? 0.35 : role === 'comb' ? 0.15 + (idx % 3) * 0.08 : 0.28;

    cells.push({
      id: `cell_${idx}_${q}_${r}`,
      gridX: q,
      gridY: r,
      worldPos: [x, y, zOffset],
      role,
      target,
      title,
      color,
      depth: 0.45 + (idx % 2) * 0.1,
    });
  });

  return cells;
}

const HONEYCOMB_LATTICE = generateHoneycombLattice();

// -------------------------------------------------------------
// INDIVIDUAL PROCEDURALLY ANIMATED HONEYCOMB CELL
// -------------------------------------------------------------
interface ProceduralCellProps {
  cell: HexCellData;
  telemetry: Partial<LiveTelemetry>;
  isOutlier?: boolean;
  isSelected?: boolean;
  onSelectTarget?: (target: InteractiveTarget) => void;
  onHover?: (label: string | null) => void;
}

const ProceduralHoneycombCell: React.FC<ProceduralCellProps> = ({
  cell,
  telemetry,
  isOutlier,
  isSelected,
  onSelectTarget,
  onHover,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Compute dynamic label for tooltip
  const cellMetricValue = useMemo(() => {
    switch (cell.role) {
      case 'temp':
        return `${isOutlier ? '48.7' : (telemetry.temp ?? 34.2).toFixed(1)}°C`;
      case 'humidity':
        return `${(telemetry.humidity ?? 68.0).toFixed(0)}% RH`;
      case 'weight':
        return `${(telemetry.weight ?? 42.7).toFixed(1)} kg`;
      case 'activity':
        return `${telemetry.activityCount ?? 218} bees/min`;
      case 'env':
        return `${(telemetry.environment ?? 27.8).toFixed(1)}°C Ambient`;
      case 'honey':
        return `${(telemetry.honeyProductionKg ?? 14.5).toFixed(1)} kg Pure Honey`;
      default:
        return 'Hexagonal Comb Cell';
    }
  }, [cell.role, telemetry, isOutlier]);

  // Distance from center for procedural wave propagation
  const distFromCenter = Math.sqrt(cell.worldPos[0] ** 2 + cell.worldPos[1] ** 2);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 1. PROCEDURAL EMISSIVE PULSE FORMULAS TIED TO IOT DATA
    let pulseIntensity = 0.5;
    let targetColor = cell.color;

    if (cell.role === 'temp') {
      // Temperature modulates pulse speed and frequency
      const currentTemp = isOutlier ? 48.7 : (telemetry.temp ?? 34.2);
      if (isOutlier || currentTemp > 38.0) {
        // High-frequency agitation alarm pulse (8.5 rad/s)
        pulseIntensity = 0.8 + 0.6 * Math.sin(t * 8.5);
        targetColor = '#ef4444'; // Red alert
      } else {
        // Natural brood temperature breathing wave
        const tempFreq = 1.6 + ((currentTemp - 32) / 6) * 1.5;
        pulseIntensity = 0.55 + 0.35 * Math.sin(t * tempFreq);
      }
    } else if (cell.role === 'humidity') {
      // Humidity tidal breath wave (smooth harmonic)
      const humVal = telemetry.humidity ?? 68.0;
      const humFreq = 1.3 + (humVal / 100) * 1.2;
      pulseIntensity = 0.5 + 0.35 * Math.sin(t * humFreq + 1.2);
    } else if (cell.role === 'weight') {
      // Weight load cell respiration
      const weightVal = telemetry.weight ?? 42.7;
      const weightFactor = Math.min(1.5, weightVal / 40);
      pulseIntensity = 0.6 + 0.3 * Math.cos(t * 1.5 * weightFactor + 2.4);
    } else if (cell.role === 'activity') {
      // Stochastic activity traffic flutter
      const trafficJitter = Math.sin(t * 6.2) * Math.cos(t * 2.8);
      pulseIntensity = 0.65 + 0.35 * trafficJitter;
    } else if (cell.role === 'env') {
      // Ambient solar microclimate drift
      pulseIntensity = 0.45 + 0.25 * Math.sin(t * 1.2 + 3.5);
    } else if (cell.role === 'honey') {
      // Viscous golden liquid honey core pulsation
      pulseIntensity = 0.85 + 0.35 * Math.sin(t * 2.2);
    } else {
      // Structural comb ripple wave radiating from center
      pulseIntensity = 0.25 + 0.2 * Math.sin(t * 2.2 - distFromCenter * 1.6);
    }

    // Boost if hovered or selected
    if (hovered) pulseIntensity = Math.max(pulseIntensity, 1.4);
    if (isSelected) pulseIntensity = Math.max(pulseIntensity, 1.3);

    // Apply to material
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = pulseIntensity;
      if (cell.role === 'temp') {
        materialRef.current.color.set(targetColor);
        materialRef.current.emissive.set(targetColor);
      }
    }

    // 2. PROCEDURAL BREATHING SCALE
    if (meshRef.current) {
      let scaleOffset = 0;
      if (cell.role === 'weight') {
        scaleOffset = Math.sin(t * 1.5) * 0.05;
      } else if (cell.role !== 'comb') {
        scaleOffset = Math.sin(t * 2.0 + distFromCenter) * 0.03;
      }
      const baseScale = hovered ? 1.12 : isSelected ? 1.08 : 1.0;
      const finalScale = baseScale + scaleOffset;
      meshRef.current.scale.set(finalScale, 1.0, finalScale);
    }

    // Liquid honey shimmer rotation
    if (innerMeshRef.current && cell.role === 'honey') {
      innerMeshRef.current.rotation.y = t * 0.4;
    }
  });

  return (
    <group position={cell.worldPos} rotation={[Math.PI / 2, 0, 0]}>
      {/* Outer Hexagonal Prism / Cell Chamber Rim */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover?.(`${cell.title}: ${cellMetricValue}`);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onHover?.(null);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          haptics.buttonClick();
          oracleAudio.playPulseEmit(480 + distFromCenter * 80);
          if (cell.target) onSelectTarget?.(cell.target);
        }}
      >
        {/* 6-sided cylinder = 3D Hexagon */}
        <cylinderGeometry args={[HEX_RADIUS * 0.94, HEX_RADIUS * 0.94, cell.depth, 6]} />
        <meshStandardMaterial
          ref={materialRef}
          color={cell.color}
          emissive={cell.color}
          emissiveIntensity={0.6}
          roughness={cell.role === 'honey' ? 0.15 : 0.4}
          metalness={cell.role === 'honey' ? 0.3 : 0.2}
        />
      </mesh>

      {/* Hexagonal Cell Cavity Inset (Beveled inner chamber) */}
      <mesh position={[0, cell.depth / 2 + 0.02, 0]}>
        <cylinderGeometry args={[HEX_RADIUS * 0.74, HEX_RADIUS * 0.74, 0.06, 6]} />
        <meshStandardMaterial
          color="#0d0803"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Inner Glowing Crystal Core or Liquid Honey Pool */}
      {cell.role !== 'comb' && (
        <mesh ref={innerMeshRef} position={[0, cell.depth / 2 + 0.06, 0]}>
          <cylinderGeometry args={[HEX_RADIUS * 0.45, HEX_RADIUS * 0.45, 0.08, 6]} />
          <meshBasicMaterial
            color={cell.role === 'temp' && isOutlier ? '#ef4444' : cell.color}
          />
        </mesh>
      )}

      {/* Fine Hexagonal Gold Wire Accent */}
      <mesh position={[0, cell.depth / 2 + 0.01, 0]}>
        <cylinderGeometry args={[HEX_RADIUS * 0.95, HEX_RADIUS * 0.95, 0.02, 6]} />
        <meshBasicMaterial
          color={cell.role === 'comb' ? '#78350f' : '#fef08a'}
          wireframe
        />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// MAIN DIGITAL HIVE 3D MESH COMPONENT
// -------------------------------------------------------------
export const DigitalHive: React.FC<DigitalHiveProps> = ({
  position = [-3.8, 0, 0],
  scale = 1.0,
  telemetry = {
    temp: 34.2,
    humidity: 68.0,
    weight: 42.7,
    activityCount: 218,
    environment: 27.8,
    honeyProductionKg: 14.5,
  },
  isOutlier = false,
  onSelectTarget,
  onHoverCell,
  selectedTarget,
}) => {
  const hiveMainGroupRef = useRef<THREE.Group>(null);
  const [hiveHovered, setHiveHovered] = useState(false);

  // Subtle organic bobbing/floating of the entire hive structure
  useFrame(({ clock }) => {
    if (hiveMainGroupRef.current) {
      const t = clock.getElapsedTime();
      // Gentle floating sine motion (0.12 units)
      hiveMainGroupRef.current.position.y = position[1] + Math.sin(t * 1.4) * 0.12;
      // Gentle micro-sway on Y axis
      hiveMainGroupRef.current.rotation.y = Math.sin(t * 0.8) * 0.04;
    }
  });

  // Pre-generate stylized worker bees orbiting the hive
  const beeFlock = useMemo(() => {
    return [
      { orbitRadius: 2.9, orbitSpeed: 0.75, phase: 0.2, yOffset: 1.2, bobFreq: 2.4 },
      { orbitRadius: 3.5, orbitSpeed: 0.60, phase: 1.8, yOffset: -0.4, bobFreq: 3.1 },
      { orbitRadius: 2.5, orbitSpeed: 0.90, phase: 3.4, yOffset: 2.1, bobFreq: 2.8 },
      { orbitRadius: 3.9, orbitSpeed: 0.50, phase: 4.6, yOffset: 0.6, bobFreq: 1.9 },
      { orbitRadius: 3.0, orbitSpeed: 0.80, phase: 5.7, yOffset: -1.2, bobFreq: 3.5 },
      { orbitRadius: 3.3, orbitSpeed: 0.65, phase: 2.9, yOffset: 1.8, bobFreq: 2.2 },
    ];
  }, []);

  return (
    <group
      ref={hiveMainGroupRef}
      position={position}
      scale={[scale, scale, scale]}
      onClick={(e) => {
        e.stopPropagation();
        haptics.buttonClick();
        onSelectTarget?.('hive');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHiveHovered(true);
      }}
      onPointerOut={() => setHiveHovered(false)}
    >
      {/* --------------------------------------------------------- */}
      {/* 1. BACKING COMB FRAME (Cedar & Dark Wax Foundation)       */}
      {/* --------------------------------------------------------- */}
      <mesh position={[0, 0, -0.35]} receiveShadow>
        <boxGeometry args={[4.4, 4.4, 0.4]} />
        <meshStandardMaterial
          color={hiveHovered ? '#261609' : '#170e05'}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Frame Outer Wooden Trim & Apiary Joint */}
      <mesh position={[0, 0, -0.32]}>
        <boxGeometry args={[4.5, 4.5, 0.45]} />
        <meshStandardMaterial color="#854d0e" wireframe />
      </mesh>

      {/* Apiary Gabled Copper Roof Crown */}
      <mesh position={[0, 2.75, -0.1]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[3.4, 1.15, 4]} />
        <meshStandardMaterial
          color="#92400e"
          roughness={0.35}
          metalness={0.7}
        />
      </mesh>

      {/* Apiary Landing Flight Board (Bottom) */}
      <mesh position={[0, -2.4, 0.6]}>
        <boxGeometry args={[3.6, 0.14, 0.8]} />
        <meshStandardMaterial color="#78350f" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Entrance slit */}
      <mesh position={[0, -2.25, 0.35]}>
        <boxGeometry args={[2.8, 0.18, 0.12]} />
        <meshBasicMaterial color="#050302" />
      </mesh>

      {/* --------------------------------------------------------- */}
      {/* 2. 19 INTERLOCKING 3D PROCEDURAL HONEYCOMB CELLS          */}
      {/* --------------------------------------------------------- */}
      <group>
        {HONEYCOMB_LATTICE.map((cell) => (
          <ProceduralHoneycombCell
            key={cell.id}
            cell={cell}
            telemetry={telemetry}
            isOutlier={isOutlier}
            isSelected={selectedTarget === cell.target}
            onSelectTarget={onSelectTarget}
            onHover={onHoverCell}
          />
        ))}
      </group>

      {/* --------------------------------------------------------- */}
      {/* 3. ORGANIC BEE PARTICLE SWARM (70+ SIMULATED BEES)        */}
      {/* --------------------------------------------------------- */}
      <BeeParticleSwarm count={75} />

      {/* --------------------------------------------------------- */}
      {/* 4. HERO WORKER BEES ORBITING WITH FLUTTERING WINGS        */}
      {/* --------------------------------------------------------- */}
      <group>
        {beeFlock.map((bee, idx) => (
          <WorkerBee
            key={`hero_bee_${idx}`}
            orbitRadius={bee.orbitRadius}
            orbitSpeed={bee.orbitSpeed}
            phase={bee.phase}
            yOffset={bee.yOffset}
            bobFreq={bee.bobFreq}
          />
        ))}
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// STANDALONE CANVAS WRAPPER (For direct drop-in usage)
// -------------------------------------------------------------
export interface DigitalHiveCanvasProps extends DigitalHiveProps {
  className?: string;
  enableCameraControls?: boolean;
}

export const DigitalHiveCanvas: React.FC<DigitalHiveCanvasProps> = ({
  className = 'w-full h-96',
  position = [-3.2, 0, 0],
  scale = 1.0,
  telemetry,
  isOutlier = false,
  onSelectTarget,
  selectedTarget,
}) => {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  return (
    <div className={`relative ${className} select-none overflow-hidden rounded-2xl bg-gradient-to-b from-[#0e0804] to-[#050302] border border-amber-900/40 shadow-2xl`}>
      {/* Floating Hover Indicator */}
      {hoveredLabel && (
        <div className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-md border border-amber-500/50 text-xs font-mono text-amber-300 shadow-lg pointer-events-none animate-in fade-in">
          {hoveredLabel}
        </div>
      )}

      {/* React Three Fiber Canvas */}
      <Canvas
        camera={{ position: [0, 1.2, 8.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} color="#fff1db" />
        <pointLight position={[-4, 4, 6]} intensity={2.0} color="#f59e0b" />
        <pointLight position={[4, 2, 4]} intensity={1.5} color="#06b6d4" />
        <directionalLight position={[0, 10, 5]} intensity={1.0} color="#ffffff" castShadow />

        <DigitalHive
          position={position}
          scale={scale}
          telemetry={telemetry}
          isOutlier={isOutlier}
          onSelectTarget={onSelectTarget}
          onHoverCell={setHoveredLabel}
          selectedTarget={selectedTarget}
        />
      </Canvas>
    </div>
  );
};

export default DigitalHive;
