/**
 * Circular Spatial Event Timeline Inside Block
 * Renders an interactive circular orbital timeline of honey traceability events:
 * ⭕ Harvest → ⭕ Quality Check → ⭕ Processing → ⭕ Packaging
 */

import React, { useState } from 'react';
import { BlockEventNode } from './types';
import { ExternalLink, Copy, Check, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
import { haptics } from '../../../utils/haptics';
import { blockchainAudio } from './blockchainAudio';

interface CircularEventTimelineProps {
  blockNumber: number;
  onOpenTxInspector: (txHash: string) => void;
}

export const CircularEventTimeline: React.FC<CircularEventTimelineProps> = ({
  blockNumber,
  onOpenTxInspector,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-harvest');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const eventNodes: BlockEventNode[] = [
    {
      id: 'node-harvest',
      stageName: 'Stage 01',
      title: 'Apiary Harvest Recorded',
      actor: 'Beekeeper Ramesh Patil',
      timestamp: '2026-09-12 10:30:15 UTC',
      txHash: '0x18a937bc901e855a4282e30f1469034cb72e0bf4148e65e6d6ff68a735c2491',
      batchId: 'HC-2026-MH-00124',
      hiveId: 'Hive #MH-024',
      metrics: [
        { label: 'Weight Harvested', value: '42.7 kg raw multi-flora' },
        { label: 'Ambient Temperature', value: '34.2°C at brood box' },
        { label: 'Geo-Coordinates', value: '18.5204° N, 73.8567° E (Western Ghats)' },
        { label: 'Hardware Enclave', value: 'ECC608 CryptoAuth Verified ✓' },
      ],
      status: 'VERIFIED',
      color: '#f59e0b',
      iconType: 'harvest',
    },
    {
      id: 'node-quality',
      stageName: 'Stage 02',
      title: 'Lab Quality & Purity Certification',
      actor: 'Dr. Anita Joshi (Agmark Lab)',
      timestamp: '2026-09-14 16:45:00 UTC',
      txHash: '0x71b29a834cfe0981240985472109854721098547210985472109854721098547',
      batchId: 'HC-2026-MH-00124',
      metrics: [
        { label: 'Moisture Content', value: '17.2% (Standard < 20%)' },
        { label: 'HMF Content', value: '12.4 mg/kg (Max 40 mg/kg)' },
        { label: 'Purity Score', value: '99.85% Pure Floral Nectar' },
        { label: 'Antibiotic Residue', value: 'Nil / Below LOQ (<0.01 ppb)' },
      ],
      status: 'CONFIRMED',
      color: '#10b981',
      iconType: 'lab',
    },
    {
      id: 'node-processing',
      stageName: 'Stage 03',
      title: 'Cold Processing & Sediment Filtration',
      actor: 'Western Ghats Agro-Processing Facility',
      timestamp: '2026-09-15 14:00:22 UTC',
      txHash: '0x49a1c890123ef4598bc83921004ab4f1890ef291823901a8ef1092834bfe92a1',
      batchId: 'HC-2026-MH-00124',
      metrics: [
        { label: 'Max Temperature', value: '36.5°C (Raw Unpasteurized)' },
        { label: 'Filtration Mesh', value: '200 Micron Stainless Steel' },
        { label: 'Enzyme Preservation', value: 'Diastase Activity 18.4 Schade' },
        { label: 'Batch Volume Ingested', value: '120.0 kg Total Run' },
      ],
      status: 'VERIFIED',
      color: '#38bdf8',
      iconType: 'processing',
    },
    {
      id: 'node-packaging',
      stageName: 'Stage 04',
      title: 'Hermetic Jarring & NFC Serialization',
      actor: 'Pristine Packaging Unit',
      timestamp: '2026-09-18 11:10:00 UTC',
      txHash: '0x8f2a937bc901e855a4282e30f1469034cb72e0bf4148e65e6d6ff68a735c2491',
      batchId: 'HC-2026-MH-00124',
      metrics: [
        { label: 'Total Jars Produced', value: '95 Units (500g Glass Jars)' },
        { label: 'Tamper Seal Type', value: 'Induction Foil + Cryptographic QR' },
        { label: 'IPFS Metadata CID', value: 'QmZtmD2qt8Srhmp...k3hN' },
        { label: 'Storage Guidance', value: 'Dark Dry Ambient (18°C-24°C)' },
      ],
      status: 'SEALED',
      color: '#8b5cf6',
      iconType: 'packaging',
    },
  ];

  const selectedNode = eventNodes.find((n) => n.id === selectedNodeId) || eventNodes[0];

  const handleCopy = (text: string) => {
    haptics.tap();
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    blockchainAudio.playPulsePing(1.5);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-amber-500/25 bg-[#090603]/90 backdrop-blur-md p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-950/70 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/60 block">
            Inside Block #{blockNumber}
          </span>
          <h4 className="text-base font-semibold text-white font-display flex items-center gap-2">
            <span>Circular Traceability Timeline</span>
          </h4>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-amber-300/80">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>4 Immutable Milestones Committed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Circular Orbital Radial Graphic */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 relative min-h-[300px]">
          {/* Radial Ring Path */}
          <div className="relative w-64 h-64 rounded-full border border-amber-500/20 flex items-center justify-center">
            {/* Concentric inner ring */}
            <div className="w-48 h-48 rounded-full border border-dashed border-amber-400/30 animate-[spin_40s_linear_infinite]" />

            {/* Central Block Badge */}
            <div className="absolute text-center space-y-0.5">
              <span className="text-[9px] font-mono text-amber-400/60 block">BLOCK</span>
              <span className="text-sm font-mono font-bold text-white block">#{blockNumber}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 border border-amber-700/50 text-amber-300">
                Sealed
              </span>
            </div>

            {/* 4 Radial Event Nodes Positioned along 90-degree intervals */}
            {eventNodes.map((node, idx) => {
              const isSelected = selectedNodeId === node.id;
              // Angles: 0 deg (Top), 90 deg (Right), 180 deg (Bottom), 270 deg (Left)
              const angleDeg = idx * 90 - 90;
              const angleRad = (angleDeg * Math.PI) / 180;
              const radius = 120; // px
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;

              return (
                <button
                  key={node.id}
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    haptics.cellSelect();
                    blockchainAudio.playLayerHum(300 + idx * 80);
                  }}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full flex flex-col items-center justify-center text-xs font-mono font-bold transition-all cursor-pointer shadow-lg group ${
                    isSelected
                      ? 'scale-125 z-20 border-2 bg-black ring-4 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                      : 'border bg-[#150d05] hover:scale-110 opacity-80 hover:opacity-100'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
                    style={{ backgroundColor: `${node.color}30`, color: node.color }}
                  >
                    0{idx + 1}
                  </span>
                  <span className="text-[8px] font-mono text-white/80 truncate max-w-[40px] text-center">
                    {node.title.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 text-center">
            <span className="text-[11px] font-mono text-amber-300/60">
              Click any circular node to inspect cryptographic proof
            </span>
          </div>
        </div>

        {/* Right: Selected Node Deep Inspector Card */}
        <div className="lg:col-span-7 p-5 rounded-xl border border-amber-500/30 bg-[#120a03]/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-950/60 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-black"
                  style={{ backgroundColor: selectedNode.color }}
                >
                  {selectedNode.stageName}
                </span>
                <span className="text-xs font-mono text-amber-300/80">{selectedNode.timestamp}</span>
              </div>
              <h5 className="text-base font-bold text-white font-display mt-1">{selectedNode.title}</h5>
            </div>

            <span className="px-2.5 py-1 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {selectedNode.status}
            </span>
          </div>

          {/* Actor & Batch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-black/40 border border-amber-950/50">
              <span className="text-[10px] text-amber-400/60 block">Verified Signer / Actor</span>
              <span className="text-white font-medium">{selectedNode.actor}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black/40 border border-amber-950/50">
              <span className="text-[10px] text-amber-400/60 block">Honey Batch Asset</span>
              <span className="text-amber-300 font-medium">{selectedNode.batchId}</span>
            </div>
          </div>

          {/* Verified Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {selectedNode.metrics.map((m, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-black/30 border border-white/5 space-y-0.5">
                <span className="text-[10px] text-amber-200/50 block">{m.label}</span>
                <span className="text-white font-semibold text-[11px]">{m.value}</span>
              </div>
            ))}
          </div>

          {/* Transaction Hash & Deep Inspection Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono border-t border-amber-950/60">
            <div className="flex items-center gap-2">
              <span className="text-amber-400/60 text-[10px]">Tx Hash:</span>
              <span className="text-sky-300 truncate max-w-[180px]">{selectedNode.txHash}</span>
              <button
                onClick={() => handleCopy(selectedNode.txHash)}
                className="p-1 rounded bg-amber-950/80 hover:bg-amber-900 text-amber-300 cursor-pointer"
                title="Copy Hash"
              >
                {copiedHash === selectedNode.txHash ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <button
              onClick={() => {
                onOpenTxInspector(selectedNode.txHash);
                blockchainAudio.playPulsePing(1.2);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Inspect Transaction</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
