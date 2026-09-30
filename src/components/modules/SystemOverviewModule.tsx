/**
 * HoneyChain System Overview Module — "SEE THE WHOLE HIVE"
 * Macro-architectural spatial visualization zooming far backward to display
 * the 7 interconnected layers of the entire ecosystem:
 * Physical World → Digital Data → Verified Data → Blockchain → Intelligence → Consumer
 */

import React from 'react';
import { useHive, HiveModule } from '../../context/HiveContext';
import { BeeGraphic } from '../common/BeeGraphic';
import {
  Radio,
  Server,
  Network,
  Link2,
  Brain,
  Truck,
  QrCode,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const SystemOverviewModule: React.FC = () => {
  const { zoomIntoModule } = useHive();

  const layers: {
    id: HiveModule;
    step: number;
    title: string;
    category: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    color: string;
    flowLabel: string;
    desc: string;
  }[] = [
    {
      id: 'monitoring',
      step: 1,
      title: 'IoT Layer',
      category: 'Physical World',
      icon: Radio,
      color: '#f59e0b',
      flowLabel: 'Telemetry Inflow',
      desc: 'Edge probes measuring brood temperature, hive weight, and acoustics at 185 Hz.',
    },
    {
      id: 'oracle_pipeline',
      step: 2,
      title: 'Backend / API Layer',
      category: 'Digital Data',
      icon: Server,
      color: '#3b82f6',
      flowLabel: 'Validated Stream',
      desc: 'REST & MQTT ingestion with biological bounds screening and rate limiting.',
    },
    {
      id: 'oracle_pipeline',
      step: 3,
      title: 'Oracle Layer',
      category: 'Verified Data',
      icon: Network,
      color: '#06b6d4',
      flowLabel: 'Signed Merkle Roots',
      desc: 'Decentralized verification gateway certifying milestones and signing payloads.',
    },
    {
      id: 'blockchain',
      step: 4,
      title: 'Blockchain Layer',
      category: 'Tamper-Evident Ledger',
      icon: Link2,
      color: '#8b5cf6',
      flowLabel: 'Polygon Amoy State',
      desc: 'Smart contract state machine ensuring irreversible harvest custody and tokenization.',
    },
    {
      id: 'ai_intelligence',
      step: 5,
      title: 'AI Layer',
      category: 'Intelligence & Health',
      icon: Brain,
      color: '#ec4899',
      flowLabel: 'Bio-Inference',
      desc: 'Fast-Fourier spectral acoustic modeling predicting swarming and colony vitality.',
    },
    {
      id: 'supply_chain',
      step: 6,
      title: 'Supply Chain Layer',
      category: 'Custody Network',
      icon: Truck,
      color: '#a855f7',
      flowLabel: 'Refrigerated Corridor',
      desc: 'Physical living chain interlinking apiaries, processors, labs, and logistics.',
    },
    {
      id: 'qr_consumer',
      step: 7,
      title: 'Consumer Layer',
      category: 'End Consumer Trust',
      icon: QrCode,
      color: '#10b981',
      flowLabel: 'Authenticity Confirmed',
      desc: 'Consumer mobile verification and holographic portal with 100% trace guarantee.',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 h-[calc(100vh-80px)] overflow-y-auto space-y-6 relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-amber-900/50 bg-[#140b03]/90 backdrop-blur-md sticky top-0 z-30 shadow-lg">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>SEE THE WHOLE HIVE — Full Ecosystem Architecture</span>
          </h2>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Physical World → Digital Data → Verified Data → Blockchain → Intelligence → Consumer.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/40 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>7 Interlocked Tiers Active</span>
        </span>
      </div>

      {/* Central HoneyChain Hub and Orbital Layers Stage */}
      <div className="relative rounded-3xl border border-amber-900/40 bg-gradient-to-b from-[#180e05] via-[#0d0702] to-[#050201] overflow-hidden p-8 shadow-2xl space-y-8">
        {/* Core Center Badge */}
        <div className="flex flex-col items-center justify-center text-center relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border border-amber-500/60 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.4)] mb-3">
            <BeeGraphic size={44} glow={true} />
          </div>
          <h3 className="text-xl font-bold text-white font-display">HONEYCHAIN CORE</h3>
          <p className="text-xs font-mono text-amber-300/80 mt-1 max-w-md">
            Decentralized IoT Telemetry, AI Colony Diagnostics, and Polygon Amoy Blockchain Traceability
          </p>
        </div>

        {/* 7 Connected Tiers Flow Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 relative z-10">
          {layers.map((layer, idx) => {
            const Icon = layer.icon;
            return (
              <div
                key={layer.step}
                onClick={() => zoomIntoModule(layer.id)}
                className="group relative p-4 rounded-xl border border-amber-950/80 bg-black/50 hover:bg-[#180d05] transition-all duration-300 cursor-pointer flex flex-col justify-between hover:scale-105 hover:border-amber-500/60 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-amber-400/80 mb-2">
                    <span>TIER 0{layer.step}</span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
                  </div>

                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: `${layer.color}15`,
                      border: `1px solid ${layer.color}40`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: layer.color }} />
                  </div>

                  <span className="text-[10px] font-mono text-amber-300/60 uppercase block">
                    {layer.category}
                  </span>
                  <h4 className="text-sm font-semibold text-white font-display mb-1 truncate">
                    {layer.title}
                  </h4>
                  <p className="text-[11px] text-amber-200/60 line-clamp-3 font-sans leading-tight">
                    {layer.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-amber-950 flex items-center justify-between text-[10px] font-mono text-amber-400">
                  <span className="truncate">{layer.flowLabel}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
