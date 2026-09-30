/**
 * HoneyChain Persistent Batch Badge & Overview Modal
 * Floats across all 3D modules, maintaining cross-module continuity and unified provenance.
 */

import React from 'react';
import { useHive } from '../../context/HiveContext';
import { haptics } from '../../utils/haptics';
import {
  Layers,
  CheckCircle2,
  X,
  ExternalLink,
  MapPin,
  Calendar,
  Flower2,
  ShieldCheck,
  Scale,
  Truck,
  Cpu,
  Copy,
  Check,
} from 'lucide-react';

export const PersistentBatchBadge: React.FC = () => {
  const {
    selectedBatchId,
    setSelectedBatchId,
    batches,
    batchModalOpen,
    setBatchModalOpen,
    viewMode,
    zoomIntoModule,
    showToast,
  } = useHive();

  const [copiedHash, setCopiedHash] = React.useState(false);

  // Only show when inside the hive (dashboard or module)
  if (viewMode === 'outside' || viewMode === 'entering') return null;

  const currentBatch = batches.find((b) => b.batchId === selectedBatchId) || batches[0];

  const handleCopyHash = (hash: string) => {
    haptics.tap();
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    showToast('Transaction hash copied', 'success');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <>
      {/* Floating Persistent Batch Badge */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => {
            haptics.buttonClick();
            setBatchModalOpen(true);
          }}
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-amber-500/40 bg-[#160d05]/95 hover:bg-[#201308] backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.7),0_0_20px_rgba(245,158,11,0.2)] transition-all duration-200 hover:scale-105 cursor-pointer text-left"
          title="Inspect Unified Batch State"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 group-hover:rotate-12 transition-transform">
            <Layers className="w-3.5 h-3.5" />
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase text-amber-400/70 tracking-wider">
              Selected Batch
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-white">
              <span>{currentBatch ? currentBatch.batchId : selectedBatchId}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </button>
      </div>

      {/* Comprehensive Batch Provenance Overview Modal */}
      {batchModalOpen && currentBatch && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-amber-500/40 bg-[#140b04] p-6 shadow-2xl text-xs font-mono space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-amber-950 pb-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>UNIFIED HONEY PROVENANCE · IMMUTABLE LEDGER</span>
                </div>
                <h3 className="text-xl font-bold text-white font-display">
                  {currentBatch.productName}
                </h3>
                <span className="text-amber-300 font-mono text-xs">
                  Batch ID: <strong>{currentBatch.batchId}</strong> · Status: {currentBatch.status}
                </span>
              </div>

              <button
                onClick={() => setBatchModalOpen(false)}
                className="p-1 rounded-lg text-amber-400 hover:text-white hover:bg-amber-950 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Switch Batch Selector */}
            <div className="flex items-center gap-2 pb-2">
              <span className="text-amber-400/70">Switch Active Batch:</span>
              <div className="flex gap-2">
                {batches.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBatchId(b.batchId)}
                    className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer border ${
                      b.batchId === currentBatch.batchId
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-black/40 text-amber-300 border-amber-950 hover:bg-black/60'
                    }`}
                  >
                    {b.batchId}
                  </button>
                ))}
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-amber-200/80">
              <div className="p-3 rounded-lg bg-black/40 border border-amber-950 space-y-1">
                <span className="text-[10px] text-amber-400/60 uppercase flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" /> Geographic Origin
                </span>
                <div className="text-white font-semibold">{currentBatch.origin}</div>
                <div className="text-[11px] text-amber-300/70">{currentBatch.region}</div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-amber-950 space-y-1">
                <span className="text-[10px] text-amber-400/60 uppercase flex items-center gap-1">
                  <Flower2 className="w-3 h-3 text-amber-400" /> Floral Spectrum
                </span>
                <div className="text-white font-semibold">{currentBatch.floralSource}</div>
                <div className="text-[11px] text-amber-300/70">Cold extracted, raw pollen preserved</div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-amber-950 space-y-1">
                <span className="text-[10px] text-amber-400/60 uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" /> Harvest & Beekeeper
                </span>
                <div className="text-white font-semibold">{currentBatch.beekeeperName}</div>
                <div className="text-[11px] text-amber-300/70">Harvest Date: {currentBatch.harvestDate}</div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-amber-950 space-y-1">
                <span className="text-[10px] text-amber-400/60 uppercase flex items-center gap-1">
                  <Scale className="w-3 h-3 text-amber-400" /> Volume & Custody
                </span>
                <div className="text-white font-semibold">{currentBatch.remainingKg} kg / {currentBatch.quantityKg} kg</div>
                <div className="text-[11px] text-amber-300/70">Facility: {currentBatch.processingFacility || 'Pune Agro Park'}</div>
              </div>
            </div>

            {/* Blockchain Sealed Details */}
            <div className="p-3.5 rounded-lg bg-sky-950/20 border border-sky-900/40 space-y-1.5 text-sky-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-sky-400 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Polygon Amoy Testnet (Chain ID 80002)
                </span>
                <span className="text-[11px] text-emerald-400 font-bold">✓ Sealed Block #{currentBatch.blockNumber}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-sky-300/80 pt-1">
                <span className="truncate max-w-md">Tx: {currentBatch.blockchainTxHash}</span>
                <button
                  onClick={() => handleCopyHash(currentBatch.blockchainTxHash)}
                  className="text-sky-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Quick Navigation to Corresponding Visual Metaphors */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-amber-400/60 text-[11px]">Navigate 3D Perspective:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    zoomIntoModule('traceability');
                    setBatchModalOpen(false);
                  }}
                  className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 border border-amber-500/40 text-[11px] cursor-pointer"
                >
                  3D Globe Route
                </button>
                <button
                  onClick={() => {
                    zoomIntoModule('blockchain');
                    setBatchModalOpen(false);
                  }}
                  className="px-2.5 py-1 rounded bg-sky-500/20 hover:bg-sky-500/40 text-sky-200 border border-sky-500/40 text-[11px] cursor-pointer"
                >
                  3D Ledger Cube
                </button>
                <button
                  onClick={() => {
                    zoomIntoModule('supply_chain');
                    setBatchModalOpen(false);
                  }}
                  className="px-2.5 py-1 rounded bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 border border-purple-500/40 text-[11px] cursor-pointer"
                >
                  Living Chain
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
