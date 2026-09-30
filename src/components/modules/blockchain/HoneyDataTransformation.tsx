/**
 * Honey Data Transformation & Hash Cryptographic Animation
 * Visually communicates:
 * Honey Event → JSON Data → Transaction Lifecycle → Cryptographic Hash → Sealed Block
 */

import React, { useState, useEffect } from 'react';
import { Droplet, ShieldCheck, ArrowRight, Binary, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { blockchainAudio } from './blockchainAudio';

interface HoneyDataTransformationProps {
  stage: 'DROLET' | 'JSON' | 'TRANSACTION' | 'HASH' | 'SEALED';
  isLiveSimulating?: boolean;
}

export const HoneyDataTransformation: React.FC<HoneyDataTransformationProps> = ({
  stage,
  isLiveSimulating = false,
}) => {
  const [txLifecycleIndex, setTxLifecycleIndex] = useState(0);
  const [currentHashIndex, setCurrentHashIndex] = useState(0);

  const txStages = [
    { label: 'Pending', color: 'text-amber-400 bg-amber-950/60 border-amber-500/40' },
    { label: 'Submitted', color: 'text-sky-400 bg-sky-950/60 border-sky-500/40' },
    { label: 'Verified', color: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/40' },
    { label: 'Confirmed ✓', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40' },
    { label: 'Recorded in Block', color: 'text-amber-300 bg-amber-900/60 border-amber-400/50' },
  ];

  // Cycling transaction lifecycle animation
  useEffect(() => {
    const timer = setInterval(() => {
      setTxLifecycleIndex((prev) => (prev + 1) % txStages.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [txStages.length]);

  // Swirling hash mutation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHashIndex((prev) => prev + 1);
    }, 150);
    return () => clearInterval(timer);
  }, []);

  const fullHash = '0x7a916e3c84f29d01b4e578a9c82fb10492837461829374618293746182937461';

  return (
    <div className="w-full rounded-2xl border border-amber-500/25 bg-[#0d0904]/90 backdrop-blur-md p-5 shadow-2xl space-y-4">
      {/* 4-Step Transformation Metaphor Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-amber-950/70 pb-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/70 block">
            Cryptographic Data Metaphor
          </span>
          <h4 className="text-sm md:text-base font-semibold text-white font-display flex items-center gap-2">
            <span>Honey Event → Transaction → Verification → Sealed Block</span>
          </h4>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded-md bg-amber-950/50 border border-amber-800/40 text-amber-300">
            Polygon Amoy Testnet
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-950/50 border border-emerald-800/40 text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Zero-Knowledge Merkle Tree
          </span>
        </div>
      </div>

      {/* Grid: 3 Interactive Visual Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1: Physical Honey Event (The Droplet) */}
        <div className="p-4 rounded-xl border border-amber-500/20 bg-black/40 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400 font-semibold flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-amber-400 fill-amber-400/30" />
              1. PHYSICAL HONEY EVENT
            </span>
            <span className="text-[10px] text-amber-300/60">IoT Hardware</span>
          </div>

          {/* Droplet Card Mockup */}
          <div className="p-3.5 rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-transparent space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-200">Hive #MH-024</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                14 Sept 2026
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div>
                <span className="text-[10px] text-amber-400/60 block">Weight Harvested</span>
                <span className="text-white font-bold">42.7 kg</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-400/60 block">Internal Temp</span>
                <span className="text-white font-bold">34.2°C</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-400/60 block">Batch ID</span>
                <span className="text-amber-300">HC-2026-MH-00124</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-400/60 block">Moisture Profile</span>
                <span className="text-emerald-400 font-bold">17.2%</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-amber-300/70 leading-relaxed">
            Raw sensor payload captured by digital load cells and calibrated ambient thermistors.
          </div>
        </div>

        {/* Column 2: Transaction Lifecycle (State Transitions) */}
        <div className="p-4 rounded-xl border border-sky-500/20 bg-black/40 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-sky-400 font-semibold flex items-center gap-1.5">
              <Binary className="w-4 h-4 text-sky-400" />
              2. TRANSACTION LIFECYCLE
            </span>
            <span className="text-[10px] text-sky-300/60">State Machine</span>
          </div>

          {/* Stepper Display */}
          <div className="space-y-1.5 pt-1">
            {txStages.map((st, i) => {
              const isCurrent = txLifecycleIndex === i;
              const isDone = txLifecycleIndex > i;
              return (
                <div
                  key={st.label}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                    isCurrent
                      ? `${st.color} scale-[1.02] shadow-[0_0_15px_rgba(56,189,248,0.25)] font-bold`
                      : isDone
                      ? 'border-emerald-900/40 text-emerald-400/80 bg-emerald-950/20'
                      : 'border-white/5 text-white/30 bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] w-4 text-center">{i + 1}.</span>
                    <span>{st.label}</span>
                  </div>
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />}
                  {isDone && <span className="text-[10px]">✓</span>}
                </div>
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-sky-300/70 truncate">
            Tx: <code className="text-white">0x8F3A...72B1</code> · Nonce #18
          </div>
        </div>

        {/* Column 3: Cryptographic Collapse (Hashing into Sealed Block) */}
        <div className="p-4 rounded-xl border border-amber-500/20 bg-black/40 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-amber-300 font-semibold flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-400" />
              3. CRYPTOGRAPHIC HASH
            </span>
            <span className="text-[10px] text-emerald-400">Keccak-256</span>
          </div>

          {/* Swirling Hash Animation Box */}
          <div className="p-3.5 rounded-lg border border-amber-500/30 bg-[#120a03] space-y-2">
            <span className="text-[10px] font-mono uppercase text-amber-400/60 block">
              Swirling Honey-Gold Data Stream
            </span>

            {/* Simulated Live Hash Collapse Stream */}
            <div className="p-2 rounded bg-black/60 border border-amber-900/50 font-mono text-xs text-amber-300 font-semibold tracking-wider break-all select-all">
              {fullHash.slice(0, 10)}
              <span className="text-white animate-pulse">
                {fullHash.slice(10, 22 + (currentHashIndex % 12))}
              </span>
              ...
              {fullHash.slice(-8)}
            </div>

            <p className="text-[10px] font-mono text-amber-200/60 italic pt-1">
              "This compact cryptographic fingerprint permanently identifies this honey record."
            </p>
          </div>

          {/* Block Sealing Status */}
          <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              BLOCK SEALED & VERIFIED ✓
            </span>
            <span className="text-[10px] text-emerald-400/80">#182904</span>
          </div>
        </div>
      </div>
    </div>
  );
};
