/**
 * HoneyChain Giant Interactive Honeycomb Dashboard
 * Depth-based navigation where each honeycomb cell is an interactive ecosystem gateway
 */

import React, { useState } from 'react';
import { useHive, HiveModule } from '../../context/HiveContext';
import { HoneycombCanvas } from '../common/HoneycombCanvas';
import { BeeGraphic } from '../common/BeeGraphic';
import { haptics } from '../../utils/haptics';
import {
  Activity,
  Layers,
  Link2,
  QrCode,
  Cpu,
  Truck,
  User,
  BarChart3,
  Network,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface HexCellConfig {
  id: HiveModule;
  title: string;
  subtitle: string;
  metric: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  glowColor: string;
  gridArea?: string;
  tag: string;
}

export const HoneycombDashboard: React.FC = () => {
  const { zoomIntoModule, hives, batches, unreadAlertsCount, selectedRole } = useHive();
  const [hoveredCell, setHoveredCell] = useState<HiveModule | null>(null);

  const activeHive = hives[0] || { currentTemp: 34.2, currentHumidity: 68.0, currentWeight: 42.7 };
  const verifiedBatchesCount = batches.length;

  const cells: HexCellConfig[] = [
    {
      id: 'monitoring',
      title: 'Hive Monitoring',
      subtitle: 'Real-time IoT temperature, humidity & acoustics',
      metric: `${activeHive.currentTemp.toFixed(1)}°C · ${activeHive.currentWeight.toFixed(1)} kg`,
      icon: Activity,
      glowColor: '#f59e0b',
      tag: 'IoT Telemetry',
    },
    {
      id: 'traceability',
      title: 'Honey Traceability',
      subtitle: 'Complete lifecycle from comb to consumer',
      metric: 'Batch HC-2026-MH-00124',
      icon: Layers,
      glowColor: '#fbbf24',
      tag: 'End-to-End',
    },
    {
      id: 'blockchain',
      title: 'Blockchain Ledger',
      subtitle: 'Immutable Polygon Amoy blocks & hashes',
      metric: 'Block #182906 · Verified',
      icon: Link2,
      glowColor: '#38bdf8',
      tag: 'Web3 Ledger',
    },
    {
      id: 'qr_consumer',
      title: 'QR Authentication',
      subtitle: 'Consumer mobile verification simulator',
      metric: '100% Pure & Traceable',
      icon: QrCode,
      glowColor: '#ec4899',
      tag: 'Consumer Portal',
    },
    {
      id: 'ai_intelligence',
      title: 'AI Insights',
      subtitle: 'Colony vitality, swarming & disease analysis',
      metric: 'Colony Health: 98% Optimal',
      icon: Cpu,
      glowColor: '#10b981',
      tag: 'Hive Intelligence',
    },
    {
      id: 'supply_chain',
      title: 'Living Supply Chain',
      subtitle: 'Metallic chain dipped in honey · 8 custody handoffs',
      metric: '8 Links · Dipped in Honey',
      icon: Truck,
      glowColor: '#f59e0b',
      tag: 'Physical Custody',
    },
    {
      id: 'beekeeper',
      title: 'Beekeeper Console',
      subtitle: 'Manage apiaries, harvest logs & colonies',
      metric: '42 Active Hives · Satara',
      icon: User,
      glowColor: '#eab308',
      tag: 'Apiary Manager',
    },
    {
      id: 'oracle_pipeline',
      title: 'The Digital Nervous System',
      subtitle: 'Real Hive → Sensors → Gateway → Oracle → Smart Contract → Blockchain',
      metric: 'Real-World Oracle Verification',
      icon: Network,
      glowColor: '#06b6d4',
      tag: 'Architecture',
    },
    {
      id: 'system_overview',
      title: 'Whole Hive Overview',
      subtitle: 'Macro-architectural view connecting all 7 layers',
      metric: 'Physical → Digital → Blockchain',
      icon: Sparkles,
      glowColor: '#ec4899',
      tag: 'Macro View',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full overflow-hidden bg-[#090502] text-[#f7e7ce] flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background Honeycomb Lattice */}
      <HoneycombCanvas intensity={0.9} />

      {/* Floating Honey Atmosphere */}
      <div className="absolute top-10 right-10 pointer-events-none opacity-40">
        <BeeGraphic size={42} glow={true} />
      </div>

      {/* Header Context Kicker */}
      <div className="relative z-10 text-center mb-8 max-w-xl">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400/80 uppercase tracking-widest mb-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Role: {selectedRole} · Decentralized Mesh</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display">
          The Living Hive Network
        </h1>
        <p className="text-xs sm:text-sm text-amber-200/60 mt-1">
          Select any honeycomb cell to zoom into its live cryptographic environment.
        </p>
      </div>

      {/* Honeycomb Centerpiece & Orbit Grid */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* Central Command Cell */}
        <div className="mb-6 flex justify-center">
          <div className="relative group w-full max-w-md p-5 rounded-2xl border border-amber-500/40 bg-[#160d05]/90 backdrop-blur-md shadow-[0_4px_30px_rgba(245,158,11,0.2)] text-center transition-all duration-300 hover:border-amber-400">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-300 uppercase tracking-wider">
              Hive Command Center
            </div>
            <div className="flex items-center justify-center gap-2 mb-1.5 mt-1">
              <BeeGraphic size={28} glow={false} />
              <h2 className="text-lg font-bold text-white font-display">HONEYCHAIN CORE</h2>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs font-mono text-amber-300/80 pt-2 border-t border-amber-900/40">
              <span>{hives.length} Monitored Hives</span>
              <span>·</span>
              <span>{verifiedBatchesCount} Verified Batches</span>
              <span>·</span>
              <span>Polygon Amoy</span>
            </div>
          </div>
        </div>

        {/* The 8 Interactive Honeycomb Cells */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {cells.map((cell) => {
            const Icon = cell.icon;
            const isHovered = hoveredCell === cell.id;

            return (
              <div
                key={cell.id}
                onMouseEnter={() => {
                  setHoveredCell(cell.id);
                  haptics.cellHover();
                }}
                onTouchStart={() => {
                  haptics.cellHover();
                }}
                onMouseLeave={() => setHoveredCell(null)}
                onClick={() => {
                  haptics.cellSelect();
                  zoomIntoModule(cell.id);
                }}
                className="group relative cursor-pointer rounded-xl border border-amber-900/50 bg-[#140b04]/80 hover:bg-[#1a0e05]/95 backdrop-blur-md p-5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-amber-500/60 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.25)] flex flex-col justify-between"
              >
                {/* Hexagon Ambient Corner Accent */}
                <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-60 transition-opacity">
                  <svg className="w-6 h-6 text-amber-500" viewBox="0 0 100 100" fill="currentColor">
                    <polygon points="50 0, 93 25, 93 75, 50 100, 7 75, 7 25" />
                  </svg>
                </div>

                <div>
                  {/* Top Row: Icon & Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${cell.glowColor}15`,
                        border: `1px solid ${cell.glowColor}40`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: cell.glowColor }} />
                    </div>

                    <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-black/40 border border-amber-950 text-amber-300/70">
                      {cell.tag}
                    </span>
                  </div>

                  {/* Cell Title & Description */}
                  <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors font-display mb-1">
                    {cell.title}
                  </h3>
                  <p className="text-xs text-amber-200/60 leading-relaxed mb-4 line-clamp-2">
                    {cell.subtitle}
                  </p>
                </div>

                {/* Footer Metric and Zoom Affordance */}
                <div className="pt-3 border-t border-amber-950/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-300/90 truncate font-mono-numbers">
                    {cell.metric}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    <span className="text-[11px] font-sans">Zoom</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Subtle Amber Glow Rim */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 20px ${cell.glowColor}20`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
