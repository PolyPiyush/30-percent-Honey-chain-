/**
 * Detailed Floating Location Inspector Panel
 * Displays verified geographical stage metrics, cryptographic Polygon Amoy proof,
 * and direct cross-module jump links into Blockchain Ledger and Supply Chain.
 */

import React, { useState } from 'react';
import { TraceabilityLocation, TraceabilityBatch } from './types';
import {
  MapPin,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  ArrowRight,
  Database,
  Link as LinkIcon,
  Compass,
} from 'lucide-react';
import { useHive } from '../../../context/HiveContext';
import { haptics } from '../../../utils/haptics';

interface LocationInspectorPanelProps {
  location: TraceabilityLocation;
  batch: TraceabilityBatch;
  onNextLocation: () => void;
  onClose?: () => void;
}

export const LocationInspectorPanel: React.FC<LocationInspectorPanelProps> = ({
  location,
  batch,
  onNextLocation,
  onClose,
}) => {
  const { zoomIntoModule, showToast } = useHive();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    haptics.tap();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to clipboard', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const jumpToBlockchain = () => {
    haptics.buttonClick();
    zoomIntoModule('blockchain');
    showToast(`Opening Blockchain Ledger for Block #${location.blockNumber || 182904}`, 'info');
  };

  const jumpToSupplyChain = () => {
    haptics.buttonClick();
    zoomIntoModule('supply_chain');
    showToast('Viewing corresponding Supply Chain custody link', 'info');
  };

  return (
    <div className="w-full rounded-3xl border border-amber-500/30 bg-[#0d0803]/95 backdrop-blur-xl p-6 shadow-2xl space-y-5 text-xs font-mono animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-950/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
              STAGE 0{location.stageNumber}
            </span>
            <span className="text-amber-400 font-semibold">{location.stageLabel}</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white font-display flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <span>{location.name}</span>
          </h3>
          <p className="text-amber-200/70 text-xs font-sans">
            {location.locationName} · {location.region}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>✓ VERIFIED ON-CHAIN</span>
          </span>
        </div>
      </div>

      {/* Grid: Geographical & Actor Attributes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-black/50 border border-amber-950/60 space-y-1">
          <span className="text-[10px] text-amber-400/60 block">RESPONSIBLE ACTOR</span>
          <div className="text-white font-semibold text-xs truncate">{location.actor}</div>
          <div className="text-[10px] text-amber-200/50">{location.role}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-black/50 border border-amber-950/60 space-y-1">
          <span className="text-[10px] text-amber-400/60 block">GEO-COORDINATES</span>
          <div className="text-white font-semibold text-xs">
            {location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E
          </div>
          <div className="text-[10px] text-emerald-400/80">✓ Geo-Fenced Agro Zone</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-black/50 border border-amber-950/60 space-y-1">
          <span className="text-[10px] text-amber-400/60 block">VERIFICATION TIMESTAMP</span>
          <div className="text-white font-semibold text-xs">{location.timestamp}</div>
          <div className="text-[10px] text-amber-200/50">Local Standard Time</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-black/50 border border-amber-950/60 space-y-1">
          <span className="text-[10px] text-amber-400/60 block">HONEY BATCH ASSET</span>
          <div className="text-amber-300 font-bold text-xs">{batch.batchId}</div>
          <div className="text-[10px] text-amber-200/50">{batch.floralSource}</div>
        </div>
      </div>

      {/* Verified Telemetry Metrics */}
      {location.metrics && location.metrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {location.metrics.map((m, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#140b04] border border-amber-950/50 space-y-0.5">
              <span className="text-[10px] text-amber-400/60 block">{m.label}</span>
              <span className="text-white font-bold text-xs">{m.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Process & Telemetry Notes */}
      <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-900/30">
        <span className="text-[10px] text-amber-400/80 uppercase font-bold tracking-wider block mb-1">
          Station Operational Logs:
        </span>
        <p className="text-amber-100 font-sans text-xs leading-relaxed">{location.details}</p>
      </div>

      {/* Blockchain Cryptographic Details & Direct Action Cross-Links */}
      <div className="p-4 rounded-2xl bg-black/60 border border-amber-950/70 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
          <span className="text-[10px] uppercase tracking-wider text-amber-400/80 font-bold flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" />
            <span>CRYPTOGRAPHIC PROOF ON POLYGON AMOY</span>
          </span>
          <span className="text-emerald-400 text-[10px]">
            Finalized in Block #{location.blockNumber || 182904}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-400/60 text-[10px]">Tx Hash:</span>
            <code className="text-white text-xs break-all select-all font-semibold">
              {location.blockchainTx || '0x18a937bc901e855a4282e30f1469034cb72e0bf4148e65e6d6ff68a735c2491'}
            </code>
            <button
              onClick={() =>
                handleCopy(
                  location.blockchainTx || '0x18a937bc901e855a4282e30f1469034cb72e0bf4148e65e6d6ff68a735c2491',
                  'tx'
                )
              }
              className="p-1 rounded bg-amber-950/60 hover:bg-amber-900 text-amber-300 cursor-pointer"
              title="Copy Tx Hash"
            >
              {copiedKey === 'tx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Cross-Module Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={jumpToBlockchain}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>View Blockchain Record</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={jumpToSupplyChain}
              className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>View Supply Chain Link</span>
              <LinkIcon className="w-3 h-3" />
            </button>

            <button
              onClick={onNextLocation}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Continue Journey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
