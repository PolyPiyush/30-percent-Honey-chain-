/**
 * HoneyChain Supply Chain — "THE LIVING CHAIN DIPPED IN HONEY"
 * Literal 3D interconnected physical metallic chain dipped into a glowing bath of raw forest honey.
 * Each heavy forged link represents a tamper-evident custody stage.
 * Features CHAIN INTEGRITY validation: fully illuminates when 100% verified,
 * or visually fractures & decouples with severed honey strands during a simulated breach.
 */

import React, { useState } from 'react';
import { useHive } from '../../context/HiveContext';
import { apiService } from '../../services/api';
import { haptics } from '../../utils/haptics';
import {
  HoneyDippedChainVisualizer,
  ChainStageLink,
} from './HoneyDippedChainVisualizer';
import {
  Link as ChainLinkIcon,
  ShieldCheck,
  AlertTriangle,
  Send,
  Building2,
  Calendar,
  Layers,
  CheckCircle2,
  Sparkles,
  Droplets,
  ArrowRight,
  ExternalLink,
  Lock,
  Cpu,
} from 'lucide-react';

export const SupplyChainModule: React.FC = () => {
  const { batches, selectedBatchId, showToast, refreshData } = useHive();
  const [selectedLinkIndex, setSelectedLinkIndex] = useState<number>(2); // Default to Extraction & Processing
  const [isBrokenLinkSimulated, setIsBrokenLinkSimulated] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferRecipient, setTransferRecipient] = useState('Metro Retail Center Mumbai');
  const [transferQty, setTransferQty] = useState('25');

  const currentBatch = batches.find((b) => b.batchId === selectedBatchId) || batches[0];

  const rawLinks: ChainStageLink[] = [
    {
      index: 1,
      stage: '1. Apiary Hive Harvest',
      facility: 'Sahyadri Organic Bee Sanctuary #01',
      actor: 'Beekeeper Rajesh Patil',
      location: 'Mahabaleshwar (17.92° N, 73.65° E)',
      timestamp: '12 Sept 2026 10:30 AM',
      status: 'VERIFIED',
      txHash: '0x18a9...2491',
      notes: 'Natural combs harvested from Hive #MH-024. Monitored via IoT weight reduction and acoustic pitch stability.',
    },
    {
      index: 2,
      stage: '2. Regional Collection',
      facility: 'Satara Farmer Producer Depot',
      actor: 'Depot Consolidation Manager',
      location: 'Satara Agro Hub, Maharashtra',
      timestamp: '13 Sept 2026 04:00 PM',
      status: 'VERIFIED',
      txHash: '0x29c1...8491',
      notes: 'Sampled for unadulterated floral honey profile; zero sugar syrup or C4 markers. Sealed in food-grade 304 stainless barrels.',
    },
    {
      index: 3,
      stage: '3. Extraction & Processing',
      facility: 'Western Ghats Agro-Processing Park',
      actor: 'Dr. Sunita Kulkarni (Lead Processor)',
      location: 'Pune Processing Unit #4',
      timestamp: '15 Sept 2026 02:00 PM',
      status: 'VERIFIED',
      txHash: '0x49a1...92a1',
      notes: 'Cold filtered at strictly 36.5°C through 200μm stainless micro-mesh. Diastase activity & raw bee enzymes remain 100% bio-active.',
    },
    {
      index: 4,
      stage: '4. Quality Lab Certification',
      facility: 'NABL Certified Testing Laboratory',
      actor: 'Chief Inspector S. Deshmukh',
      location: 'Shivaji Nagar, Pune',
      timestamp: '17 Sept 2026 11:20 AM',
      status: isBrokenLinkSimulated ? 'MISSING_DATA' : 'VERIFIED',
      txHash: isBrokenLinkSimulated ? '0x0000...PENDING' : '0x17b9...3840',
      notes: isBrokenLinkSimulated
        ? 'Oracle signature missing from laboratory feed. Chain link physically fractures & decoupling warning triggers.'
        : 'Moisture 17.2%, HMF 11.8 mg/kg, Purity 99.85%. FSSAI & Agmark Grade-A Standard Certified.',
    },
    {
      index: 5,
      stage: '5. Packaging & QR Tagging',
      facility: 'Pristine Clean Packaging Terminal',
      actor: 'Quality Assurance Head',
      location: 'Khadki Terminal, Pune',
      timestamp: '19 Sept 2026 09:45 AM',
      status: 'VERIFIED',
      txHash: '0x77c9...4710',
      notes: 'Packaged into 500g UV-shielded hexagonal glass jars with encrypted tamper seal and dual-frequency NFC/QR chip.',
    },
    {
      index: 6,
      stage: '6. Cold-Chain Distribution',
      facility: 'Pristine Cold Logistics Hub',
      actor: 'Logistics Controller V. Mehta',
      location: 'Transit: Pune → Mumbai Express Corridor',
      timestamp: '22 Sept 2026 08:15 AM',
      status: 'VERIFIED',
      txHash: '0x8f2a...2491',
      notes: 'Refrigerated IoT vehicle MH-12-QZ-9912. Monitored temperature strictly maintained between 18.2°C and 19.6°C with GPS logging.',
    },
    {
      index: 7,
      stage: '7. Retail Stocking',
      facility: 'Metro Artisan Honey Emporium',
      actor: 'Authorized Retail Partner',
      location: 'Bandra & Colaba, Mumbai',
      timestamp: '24 Sept 2026 12:00 PM',
      status: 'VERIFIED',
      txHash: '0x99e2...1049',
      notes: 'QR code verified at retail intake; shelf RFID tracker linked to live point-of-sale inventory smart contract.',
    },
    {
      index: 8,
      stage: '8. Consumer Verification',
      facility: 'Final Customer Handover',
      actor: 'Verified Consumer Scan',
      location: 'Mumbai, Maharashtra',
      timestamp: 'Live Active State',
      status: 'VERIFIED',
      txHash: '0xaa10...55b2',
      notes: 'Authenticity confirmed on Polygon Amoy. 100% trace complete from flower to pantry.',
    },
  ];

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBatch) return;

    haptics.buttonClick();
    setIsTransferring(true);
    try {
      await apiService.transferBatch(currentBatch.id, {
        fromParticipant: 'Pristine Cold Logistics',
        toParticipant: transferRecipient,
        location: 'Mumbai Distribution Corridor',
        quantityKg: parseFloat(transferQty),
        notes: 'Handover verified with encrypted seal scan & honey viscosity confirmation.',
      });
      await refreshData();
      haptics.success();
      showToast(`Batch transferred: ${transferQty}kg to ${transferRecipient}`, 'success');
    } catch (err: unknown) {
      haptics.warning();
      const msg = err instanceof Error ? err.message : 'Transfer failed';
      showToast(msg, 'warning');
    } finally {
      setIsTransferring(false);
    }
  };

  const selectedLink = rawLinks[selectedLinkIndex] || rawLinks[0];
  const allVerified = rawLinks.every((l) => l.status === 'VERIFIED');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 h-[calc(100vh-80px)] overflow-y-auto space-y-6 relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-amber-900/50 bg-[#140b03]/90 backdrop-blur-md sticky top-0 z-30 shadow-lg">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-display flex items-center gap-2">
            <ChainLinkIcon className="w-5 h-5 text-amber-400" />
            <span>THE LIVING CHAIN — Physical Interlocked Custody</span>
          </h2>
          <p className="text-xs text-amber-200/60 mt-0.5">
            A literal metallic chain dipped in raw forest honey: heavy industrial links representing irreversible, tamper-evident physical supply-chain handoffs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const nextState = !isBrokenLinkSimulated;
              setIsBrokenLinkSimulated(nextState);
              if (nextState) haptics.warning();
              else haptics.success();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border cursor-pointer flex items-center gap-1.5 ${
              isBrokenLinkSimulated
                ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                : 'bg-black/50 text-amber-300 border-amber-900/80 hover:bg-black/80'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${isBrokenLinkSimulated ? 'text-rose-400' : 'text-amber-400'}`} />
            <span>{isBrokenLinkSimulated ? 'Reconnect & Verify Chain' : 'Simulate Severed Link (Demo)'}</span>
          </button>

          <span className="px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-800/40 text-xs font-mono text-amber-300">
            Batch: <strong>{currentBatch?.batchId}</strong>
          </span>
        </div>
      </div>

      {/* CHAIN INTEGRITY Status Bar */}
      <div
        className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between text-xs font-mono ${
          allVerified
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
            : 'bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {allVerified ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse shrink-0" />
          )}
          <div>
            <strong className="block text-sm font-display">
              CHAIN INTEGRITY: {allVerified ? '100% ILLUMINATED & CRYPTOGRAPHICALLY VERIFIED' : '⚠ CHAIN INTEGRITY BREACH DETECTED'}
            </strong>
            <span className="text-[11px] opacity-80">
              {allVerified
                ? 'All 8 metallic links are immersed in verified raw honey. Zero broken handoffs, zero adulteration markers.'
                : 'Link #4 (Quality Lab Certification) has missing oracle telemetry. Physical chain link is severed.'}
            </span>
          </div>
        </div>

        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded bg-black/50 border border-current">
          {allVerified ? 'Chain Sealed' : 'Verification Required'}
        </span>
      </div>

      {/* ========================================================================= */}
      {/* THE LITERAL METALLIC CHAIN DIPPED IN HONEY VISUALIZER                     */}
      {/* ========================================================================= */}
      <HoneyDippedChainVisualizer
        links={rawLinks}
        selectedLinkIndex={selectedLinkIndex}
        onSelectLink={(index) => setSelectedLinkIndex(index)}
        isBrokenLinkSimulated={isBrokenLinkSimulated}
        onToggleBrokenLink={() => setIsBrokenLinkSimulated(!isBrokenLinkSimulated)}
      />

      {/* Detailed Link Inspector & Custody Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Link Inspection Details (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-amber-900/40 bg-[#120a04]/90 backdrop-blur-md space-y-5 text-xs font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-950 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                  LINK #{selectedLink.index} OF 8
                </span>
                <span className="text-amber-400 font-bold text-base font-display">
                  {selectedLink.stage}
                </span>
              </div>
              <span className="text-amber-200/70 font-sans text-xs mt-1 block">
                Facility: <strong>{selectedLink.facility}</strong> · {selectedLink.location}
              </span>
            </div>

            <div
              className={`flex items-center gap-1.5 font-semibold px-3 py-1 rounded-lg border ${
                selectedLink.status === 'VERIFIED'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300 animate-pulse'
              }`}
            >
              {selectedLink.status === 'VERIFIED' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              )}
              <span>{selectedLink.status === 'VERIFIED' ? 'Sealed in Amber (Verified)' : 'Missing Lab Oracle Signature'}</span>
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-black/40 border border-amber-950 space-y-1">
              <span className="text-amber-400/60 block text-[10px] uppercase tracking-wider">Responsible Actor</span>
              <div className="text-white font-semibold text-xs">{selectedLink.actor}</div>
              <div className="text-amber-300/70 text-[10px]">Authorized HoneyChain Participant</div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-amber-950 space-y-1">
              <span className="text-amber-400/60 block text-[10px] uppercase tracking-wider">Timestamp & Transit</span>
              <div className="text-white font-semibold text-xs">{selectedLink.timestamp}</div>
              <div className="text-amber-300/70 text-[10px]">Physical Milestone Record</div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-amber-950 space-y-1">
              <span className="text-amber-400/60 block text-[10px] uppercase tracking-wider">On-Chain State Seal</span>
              <div className="text-sky-400 font-semibold text-xs truncate">{selectedLink.txHash}</div>
              <div className="text-emerald-400 text-[10px]">Polygon Amoy Verified</div>
            </div>
          </div>

          {/* Custody Integrity & Honey Preservation Metaphor Note */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/30 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
              <Droplets className="w-3.5 h-3.5 text-amber-400" />
              <span>Process Invariants & Physical Integrity:</span>
            </div>
            <p className="text-amber-100 font-sans text-xs leading-relaxed">{selectedLink.notes}</p>
          </div>

          {/* Honey Metaphor Explainer Callout */}
          <div className="p-3.5 rounded-xl bg-black/50 border border-amber-950/70 flex items-start gap-3 text-[11px] text-amber-300/70 font-sans">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block font-mono text-xs">The Honey-Dipped Metaphor:</strong>
              Honey is the only natural food on Earth that never spoils—archaeologists have excavated 3,000-year-old honey from Egyptian tombs still perfectly preserved. In HoneyChain, each metallic supply link is literally sealed in honey to mirror the immutable, eternal preservation of cryptographic blockchain records.
            </div>
          </div>
        </div>

        {/* Custody Transfer Action Card (1 Col) */}
        <div className="p-6 rounded-2xl border border-amber-900/40 bg-[#120a04]/90 backdrop-blur-md space-y-4 text-xs font-mono flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-amber-950 pb-3">
              <Send className="w-4 h-4 text-amber-400" />
              <h3 className="text-amber-200 font-bold text-sm font-display">
                Execute Custody Handover
              </h3>
            </div>
            <p className="text-[11px] text-amber-300/70 font-sans mt-2">
              Transfer physical batch possession to the next participant in the living chain. This operation signs an on-chain state transition.
            </p>

            <form onSubmit={handleTransfer} className="space-y-3.5 mt-4">
              <div>
                <label className="text-[10px] text-amber-400/80 block uppercase tracking-wider mb-1">
                  Recipient Entity / Facility:
                </label>
                <select
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-amber-900/60 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="Metro Retail Center Mumbai">Metro Retail Center Mumbai</option>
                  <option value="Bandra Artisan Honey Depot">Bandra Artisan Honey Depot</option>
                  <option value="NABL Certified Quality Lab Pune">NABL Certified Quality Lab Pune</option>
                  <option value="Western Ghats Agro-Terminal">Western Ghats Agro-Terminal</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-amber-400/80 block uppercase tracking-wider mb-1">
                  Transfer Quantity (kg):
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={transferQty}
                  onChange={(e) => setTransferQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-amber-900/60 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-black/40 border border-amber-950 text-[10px] text-amber-400/80 space-y-1">
                <div className="flex justify-between">
                  <span>Current Batch:</span>
                  <span className="text-white font-bold">{currentBatch?.batchId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Link:</span>
                  <span className="text-amber-300">#{selectedLink.index} {selectedLink.stage.split('.')[1]}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isTransferring || !allVerified}
                className={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  allVerified
                    ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-black hover:brightness-110 shadow-lg shadow-amber-600/20 active:scale-98'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                {isTransferring ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Signing Chain Transition...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Sign & Seal Custody Transfer</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-3 border-t border-amber-950 text-[10px] text-amber-400/60 flex items-center justify-between">
            <span>Security: SHA-256 State Hash</span>
            <span className="text-emerald-400">ECDSA Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
