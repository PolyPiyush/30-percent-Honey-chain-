/**
 * HoneyChain Cinematic Blockchain Ledger Module
 * "A digital vault where every drop of honey leaves an immutable trace."
 *
 * Implements:
 * - 9 Defined Camera Journey States (Outside → Approaching → Entering → Disassembly →
 *   Verification → Sealing → Full Chain → Block Inspection → Return to Hive)
 * - 3D Translucent Golden Block #182904 with internal honeycomb patterns & particles
 * - Scroll & Step-driven camera journey with auto-play cinematic tour
 * - Honey Event → JSON → Transaction → Hash Collapse → Sealed Block
 * - 3D perspective chain with depth (Blocks #182901 to #182906)
 * - Previous Hash → Current Hash cryptographic connection
 * - Interactive 3D raycasting block selection & circular radial event timeline
 * - Tamper simulation ("What happens if this record changes?") with broken link
 * - Sequential chain verification pulse (Block → Block → Block)
 * - Live Ledger real-time transaction ingestion simulation
 * - Deep Glass Transaction Inspector panel with external Polygonscan links
 * - Smooth exit animation back to the HoneyChain universe
 */

import React, { useState, useEffect, useRef } from 'react';
import { useHive } from '../../context/HiveContext';
import { apiService } from '../../services/api';
import { BlockchainBlock, BlockchainTransaction } from '../../types';
import { LedgerCameraState } from './blockchain/types';
import { Blockchain3DScene } from './blockchain/Blockchain3DScene';
import { HoneyDataTransformation } from './blockchain/HoneyDataTransformation';
import { CircularEventTimeline } from './blockchain/CircularEventTimeline';
import { TransactionInspectorModal } from './blockchain/TransactionInspectorModal';
import { blockchainAudio } from './blockchain/blockchainAudio';
import { haptics } from '../../utils/haptics';
import {
  Link2,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Eye,
  Radio,
  Copy,
  Check,
  Compass,
  ArrowRight,
} from 'lucide-react';

export const BlockchainLedgerModule: React.FC = () => {
  const { selectedBatchId, showToast, exitToDashboard } = useHive();

  // Master State Machine
  const [cameraState, setCameraState] = useState<LedgerCameraState>('STATE_01_OUTSIDE');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [blocks, setBlocks] = useState<BlockchainBlock[]>([]);
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [selectedBlockNumber, setSelectedBlockNumber] = useState<number>(182904);

  // Feature Toggles & Simulations
  const [isAutoTourRunning, setIsAutoTourRunning] = useState<boolean>(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isTampered, setIsTampered] = useState<boolean>(false);
  const [tamperStep, setTamperStep] = useState<'NONE' | 'FAILED' | 'RESTORED'>('NONE');
  const [pulseBlockIndex, setPulseBlockIndex] = useState<number | null>(null);
  const [isVerifyingChain, setIsVerifyingChain] = useState<boolean>(false);
  const [isLiveLedgerActive, setIsLiveLedgerActive] = useState<boolean>(false);
  const [liveStep, setLiveStep] = useState<string>('IDLE');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [inspectorTxHash, setInspectorTxHash] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [activeDisassemblyTab, setActiveDisassemblyTab] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fetch initial blockchain data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [b, tx] = await Promise.all([
          apiService.getBlocks(),
          apiService.getTransactions(),
        ]);
        setBlocks(b);
        setTransactions(tx);
      } catch (err) {
        console.error('Failed to fetch blockchain data:', err);
      }
    };
    fetchData();
  }, []);

  // Sync audio toggle with audio service
  useEffect(() => {
    blockchainAudio.enabled = isAudioEnabled;
  }, [isAudioEnabled]);

  // Defined 9 Camera States ordered list
  const stateSequence: { state: LedgerCameraState; num: string; label: string; desc: string }[] = [
    { state: 'STATE_01_OUTSIDE', num: '01', label: 'The Block', desc: 'Golden translucent Block #182904' },
    { state: 'STATE_02_APPROACHING', num: '02', label: 'Approach', desc: 'Camera dollies toward crystalline cube' },
    { state: 'STATE_03_ENTERING', num: '03', label: 'Enter Block', desc: 'Camera passes through golden glass face' },
    { state: 'STATE_04_DISASSEMBLY', num: '04', label: 'Cube Disassembly', desc: '4 data strata float independently in 3D' },
    { state: 'STATE_05_VERIFICATION', num: '05', label: 'Data & Hash', desc: 'Honey droplet streams into Keccak-256 hash' },
    { state: 'STATE_06_SEALING', num: '06', label: 'Block Sealing', desc: 'Hexagonal seal locks and emits energy wave' },
    { state: 'STATE_07_CHAIN', num: '07', label: 'Full Blockchain', desc: '3D perspective chain: Blocks #182901-#182906' },
    { state: 'STATE_08_INSPECTION', num: '08', label: 'Block Inspection', desc: 'Circular spatial timeline of honey events' },
    { state: 'STATE_09_EXIT', num: '09', label: 'Return to Hive', desc: 'Exit blockchain vault to main hive' },
  ];

  const currentStateIndex = stateSequence.findIndex((s) => s.state === cameraState);

  // Transition to a specific camera state
  const goToState = (targetState: LedgerCameraState) => {
    setCameraState(targetState);
    haptics.buttonClick();
    blockchainAudio.playLayerHum(320);

    // If entering state 09 (exit), run exit animation then return to dashboard
    if (targetState === 'STATE_09_EXIT') {
      showToast('Collapsing blockchain vault... Returning to Hive', 'info');
      setTimeout(() => {
        exitToDashboard();
      }, 1400);
    }
  };

  // Auto-play Cinematic Tour timer
  useEffect(() => {
    if (!isAutoTourRunning) return;

    const interval = setInterval(() => {
      setCameraState((current) => {
        const idx = stateSequence.findIndex((s) => s.state === current);
        if (idx >= stateSequence.length - 2) {
          // Pause at State 08
          setIsAutoTourRunning(false);
          return 'STATE_08_INSPECTION';
        }
        const next = stateSequence[idx + 1].state;
        blockchainAudio.playLayerHum(260 + idx * 40);
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoTourRunning, stateSequence]);

  // Scroll listener on main container to smoothly update camera state
  const handleContainerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;
    const progress = Math.min(1, Math.max(0, el.scrollTop / maxScroll));
    setScrollProgress(progress);
  };

  // Sequential Chain Verification Pulse
  const triggerChainVerificationPulse = () => {
    if (isVerifyingChain) return;
    setIsVerifyingChain(true);
    haptics.success();
    blockchainAudio.playPulsePing(1.0);

    let currentIdx = 0;
    const pulseInterval = setInterval(() => {
      if (currentIdx < 6) {
        setPulseBlockIndex(currentIdx);
        blockchainAudio.playPulsePing(1.0 + currentIdx * 0.15);
        currentIdx++;
      } else {
        clearInterval(pulseInterval);
        setPulseBlockIndex(null);
        setIsVerifyingChain(false);
        blockchainAudio.playBlockSealed();
        showToast('CHAIN INTEGRITY VERIFIED ✓ All Merkle roots intact', 'success');
      }
    }, 450);
  };

  // Immutability Tamper Simulation
  const simulateTamper = () => {
    setIsTampered(true);
    setTamperStep('FAILED');
    haptics.warning();
    blockchainAudio.playTamperAlarm();
    showToast('CRITICAL: Block #182904 data tampered! Chain broken!', 'warning');

    // Auto-restore after 5.5 seconds to show restoration
    setTimeout(() => {
      setIsTampered(false);
      setTamperStep('RESTORED');
      blockchainAudio.playBlockSealed();
      showToast('ORIGINAL RECORD RESTORED — CHAIN VALID ✓', 'success');
      setTimeout(() => setTamperStep('NONE'), 3000);
    }, 5500);
  };

  // Live Ledger Ingestion Simulation
  const toggleLiveLedger = () => {
    if (isLiveLedgerActive) {
      setIsLiveLedgerActive(false);
      setLiveStep('IDLE');
      return;
    }

    setIsLiveLedgerActive(true);
    setLiveStep('DROPLET_ARRIVING');
    blockchainAudio.playDataChime();
    showToast('LIVE LEDGER: New IoT honey harvest event received from Hive #MH-024', 'info');

    // 1. Droplet arrives
    setTimeout(() => {
      setLiveStep('ORACLE_CHECK');
      blockchainAudio.playPulsePing(1.2);
    }, 2000);

    // 2. Oracle verified
    setTimeout(() => {
      setLiveStep('CONTRACT_EXEC');
      blockchainAudio.playHashCollapse();
    }, 3800);

    // 3. Smart contract executed & block sealed
    setTimeout(() => {
      setLiveStep('BLOCK_MINED');
      blockchainAudio.playBlockSealed();
      showToast('Block #182907 Mined & Finalized on Polygon Amoy! ✓', 'success');

      // Add newly mined block
      const newBlock: BlockchainBlock = {
        blockNumber: 182907,
        timestamp: new Date().toISOString(),
        hash: '0x37a91823901a8ef1092834bfe92a109847102938471029384710293847102938',
        prevHash: '0x269034cb72e0bf4148e65e6d6ff68a735c24918f2a937bc901e855a4282e30f1',
        transactionsCount: 1,
        validator: 'Polygon Amoy Validator #33',
        gasUsed: '842,100 gwei',
        merkleRoot: '0xee10293847102938471029384710293847102938471029384710293847102938',
        isImmutable: true,
      };
      setBlocks((prev) => [...prev, newBlock]);
      setSelectedBlockNumber(182907);
    }, 5600);
  };

  const currentBlock =
    blocks.find((b) => b.blockNumber === selectedBlockNumber) ||
    blocks[3] || {
      blockNumber: 182904,
      timestamp: '2026-09-12T10:30:15Z',
      hash: '0x0481f9a2b5346718d09854721985472109854721098547210985472109854721',
      prevHash: '0x0372e891a4235607c98743610874361098743610987436109874361098743610',
      transactionsCount: 3,
      validator: 'Polygon Amoy Validator #14',
      gasUsed: '1,240,812 gwei',
      merkleRoot: '0x9923841029384710293847102938471029384710293847102938471029384710',
      isImmutable: true,
    };

  const handleCopy = (text: string, label: string) => {
    haptics.tap();
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    showToast(`${label} copied to clipboard`, 'success');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // 4 Disassembly Layers Data
  const disassemblyLayers = [
    {
      name: 'DATA LAYER',
      color: '#38bdf8',
      desc: 'Physical Honey Batch & IoT Telemetry Attributes',
      details: [
        { label: 'Batch ID', value: selectedBatchId || 'HC-2026-MH-00124' },
        { label: 'Hive ID', value: 'Hive #MH-024 (Brood Box Alpha)' },
        { label: 'Timestamp', value: '14 Sept 2026, 10:30:15 UTC' },
        { label: 'Telemetry Sensor', value: 'Load Cell 42.7 kg · 34.2°C Brood Temp' },
      ],
    },
    {
      name: 'TRANSACTION LAYER',
      color: '#f59e0b',
      desc: 'Cryptographic Handoff Payload & Digital Signers',
      details: [
        { label: 'Transaction Hash', value: '0x18a937bc901e855a4282e30f1469034cb72e0bf4148e65e6d6ff68a735c2491' },
        { label: 'Sender', value: '0x71C824aB39e8F0192847102938471029384749b2 (Ramesh Patil)' },
        { label: 'Receiver', value: '0x91F5B4dF0Ac77b0F01309852dB214FEBe0b93C98 (HoneyChain Protocol)' },
        { label: 'Gas Used', value: '42,100 units (Polygon Amoy)' },
      ],
    },
    {
      name: 'SMART CONTRACT LAYER',
      color: '#8b5cf6',
      desc: 'Immutable Solidity State Machine Invariants',
      details: [
        { label: 'Contract Address', value: '0x91F5B4dF0Ac77b0F01309852dB214FEBe0b93C98' },
        { label: 'Function Called', value: 'recordHarvest(bytes32 batchId, uint256 weight, uint256 temp)' },
        { label: 'Event Emitted', value: 'HarvestCommitted(batchId, hiveId, moisture, timestamp)' },
        { label: 'Compiler', value: 'Solidity 0.8.24 with OpenZeppelin AccessControl' },
      ],
    },
    {
      name: 'VERIFICATION LAYER',
      color: '#10b981',
      desc: 'Multi-Oracle Consensus & Merkle State Commitment',
      details: [
        { label: 'Oracle Status', value: 'Hardware Cryptographic Signature Verified ✓' },
        { label: 'Validator Node', value: 'Polygon Amoy Validator #14' },
        { label: 'Merkle Root', value: '0x9923841029384710293847102938471029384710293847102938471029384710' },
        { label: 'Confirmation', value: 'Finalized (64/64 Network Epochs)' },
      ],
    },
  ];

  return (
    <div
      ref={containerRef}
      onScroll={handleContainerScroll}
      className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 h-[calc(100vh-80px)] overflow-y-auto space-y-6 relative selection:bg-amber-500/30 selection:text-amber-200"
    >
      {/* 1. TOP CINEMATIC CONTROLLER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl border border-amber-500/30 bg-[#0c0803]/90 backdrop-blur-xl sticky top-0 z-30 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80 font-bold">
              CINEMATIC BLOCKCHAIN LEDGER
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-display flex items-center gap-2">
            <Link2 className="w-5 h-5 text-amber-400" />
            <span>Block #182904 — Spatial Vault</span>
          </h2>
          <p className="text-xs text-amber-200/60">
            A digital vault where every drop of honey leaves an immutable trace.
          </p>
        </div>

        {/* Action Controls Cluster */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={() => {
              setIsAudioEnabled(!isAudioEnabled);
              haptics.tap();
            }}
            className={`p-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors ${
              isAudioEnabled
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                : 'bg-black/40 border-white/10 text-white/40'
            }`}
            title="Toggle Ambient Audio Resonance"
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reduced Motion Toggle */}
          <button
            onClick={() => {
              setReducedMotion(!reducedMotion);
              haptics.tap();
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono cursor-pointer transition-colors ${
              reducedMotion
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                : 'bg-black/40 border-amber-900/50 text-amber-300/80 hover:text-white'
            }`}
          >
            {reducedMotion ? 'Motion: Reduced' : 'Motion: Smooth'}
          </button>

          {/* Auto Tour Play/Pause */}
          <button
            onClick={() => {
              setIsAutoTourRunning(!isAutoTourRunning);
              haptics.buttonClick();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
          >
            {isAutoTourRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isAutoTourRunning ? 'Pause Cinematic Tour' : 'Auto Cinematic Tour'}</span>
          </button>

          {/* Live Ledger Simulation Toggle */}
          <button
            onClick={() => {
              toggleLiveLedger();
              haptics.buttonClick();
            }}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              isLiveLedgerActive
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-black/50 border-amber-500/40 text-amber-300 hover:bg-amber-950/50'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isLiveLedgerActive ? 'LIVE LEDGER ACTIVE' : 'LIVE LEDGER'}</span>
          </button>

          {/* Inspect Transaction Modal Button */}
          <button
            onClick={() => {
              setIsInspectorOpen(true);
              haptics.buttonClick();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>INSPECT TRANSACTION</span>
          </button>
        </div>
      </div>

      {/* 2. NINE CAMERA STATES STEPPER & SCRUBBER */}
      <div className="p-3.5 rounded-2xl border border-amber-500/20 bg-[#090502]/80 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/70">
            Camera Journey Stages (Tap to Teleport or Scroll)
          </span>
          <span className="text-[11px] font-mono text-amber-300 font-bold">
            State {currentStateIndex + 1} of 9: {stateSequence[currentStateIndex].label}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1.5">
          {stateSequence.map((item, idx) => {
            const isCurrent = cameraState === item.state;
            return (
              <button
                key={item.state}
                onClick={() => goToState(item.state)}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-amber-400 bg-amber-950/70 shadow-[0_0_15px_rgba(245,158,11,0.35)] scale-[1.02]'
                    : 'border-white/5 bg-black/40 hover:border-amber-900/60 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className={isCurrent ? 'text-amber-400 font-bold' : 'text-white/40'}>{item.num}</span>
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
                </div>
                <div className="text-[11px] font-semibold text-white truncate mt-0.5">{item.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 3D SPATIAL CANVAS STAGE */}
      <div className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#110b04] via-[#090502] to-[#040201] overflow-hidden shadow-2xl">
        <Blockchain3DScene
          cameraState={cameraState}
          scrollProgress={scrollProgress}
          selectedBlockNumber={selectedBlockNumber}
          onSelectBlock={(bNum) => {
            setSelectedBlockNumber(bNum);
            goToState('STATE_08_INSPECTION');
          }}
          blocks={blocks}
          isTampered={isTampered}
          isSealed={cameraState === 'STATE_06_SEALING' || cameraState === 'STATE_07_CHAIN' || cameraState === 'STATE_08_INSPECTION'}
          pulseBlockIndex={pulseBlockIndex}
          isLiveSimulating={isLiveLedgerActive}
          liveStep={liveStep}
          reducedMotion={reducedMotion}
        />

        {/* Floating In-Scene Holographic HUD Overlay */}
        <div className="absolute top-5 left-5 z-20 pointer-events-none space-y-1">
          <div className="px-3.5 py-1.5 rounded-xl bg-black/80 border border-amber-500/40 backdrop-blur-md text-xs font-mono text-amber-300 shadow-xl inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>BLOCK #182904</span>
            <span className="text-white/40">·</span>
            <span className="text-emerald-400 font-bold">IMMUTABLE VAULT</span>
          </div>
          <div className="text-[11px] font-mono text-amber-200/60 pl-1">
            Glass surfaces · Honeycomb lattice · Micro-particles
          </div>
        </div>

        {/* Tamper Warning Banner if Simulating Broken Block */}
        {isTampered && (
          <div className="absolute top-5 right-5 z-20 px-4 py-2 rounded-xl bg-red-950/90 border border-red-500 text-red-200 text-xs font-mono font-bold flex items-center gap-2 animate-bounce shadow-2xl">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>CHAIN VERIFICATION FAILED: Merkle root mismatch on Block #182904!</span>
          </div>
        )}

        {/* State Indicator Bottom Center Overlay */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {cameraState === 'STATE_01_OUTSIDE' && (
            <button
              onClick={() => goToState('STATE_02_APPROACHING')}
              className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono shadow-[0_0_25px_rgba(245,158,11,0.5)] cursor-pointer flex items-center gap-2 transition-transform hover:scale-105"
            >
              <span>Tap / Scroll to Enter Block #182904</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {cameraState === 'STATE_07_CHAIN' && (
            <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md p-1.5 rounded-full border border-amber-500/40 text-xs font-mono">
              <button
                onClick={triggerChainVerificationPulse}
                className="px-4 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verify Full Chain Pulse</span>
              </button>
              <button
                onClick={simulateTamper}
                className="px-4 py-1.5 rounded-full bg-red-950 hover:bg-red-900 border border-red-500/60 text-red-300 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Simulate Record Tamper</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. CONDITIONAL DEEP EXPERIENCES BASED ON ACTIVE CAMERA STATE */}

      {/* State 04: CUBE DISASSEMBLY (4 Independent Strata) */}
      {(cameraState === 'STATE_04_DISASSEMBLY' || cameraState === 'STATE_03_ENTERING') && (
        <div className="p-6 rounded-3xl border border-amber-500/30 bg-[#0d0904]/95 backdrop-blur-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-950/80 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/70 block">
                Spatial Deconstruction
              </span>
              <h3 className="text-base md:text-lg font-bold text-white font-display">
                Cube Disassembly — 4 Independent Cryptographic Strata
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-300/80">
              The 6 faces move apart to reveal interior data layers
            </span>
          </div>

          {/* 4 Layer Tab Selector */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {disassemblyLayers.map((layer, idx) => {
              const isSelected = activeDisassemblyTab === idx;
              return (
                <button
                  key={layer.name}
                  onClick={() => {
                    setActiveDisassemblyTab(idx);
                    haptics.tap();
                    blockchainAudio.playLayerHum(300 + idx * 70);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/60 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'border-white/5 bg-black/40 hover:border-amber-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-amber-400/80 mb-1">
                    <span>LAYER 0{idx + 1}</span>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: layer.color }}
                    />
                  </div>
                  <h4 className="text-xs font-bold text-white font-mono truncate">{layer.name}</h4>
                  <p className="text-[10px] text-amber-200/50 line-clamp-1 mt-0.5">{layer.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Active Disassembled Layer Data Details */}
          <div className="p-4 rounded-2xl bg-black/60 border border-amber-950/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            {disassemblyLayers[activeDisassemblyTab].details.map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#140b04] border border-amber-950/60 space-y-1">
                <span className="text-[10px] text-amber-400/60 block">{item.label}</span>
                <span className="text-white font-medium text-xs break-all block">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => goToState('STATE_05_VERIFICATION')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next: Witness Honey Data Entering Block</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* State 05: HONEY DATA TRANSFORMATION & HASH COLLAPSE */}
      {(cameraState === 'STATE_05_VERIFICATION' || cameraState === 'STATE_06_SEALING') && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <HoneyDataTransformation stage="DROLET" isLiveSimulating={isLiveLedgerActive} />

          <div className="flex items-center justify-between p-4 rounded-2xl border border-amber-500/20 bg-[#090502]/80 text-xs font-mono">
            <span className="text-amber-300/80">
              Data transformed into immutable transaction payload and finalized in Block #182904.
            </span>
            <button
              onClick={() => goToState('STATE_07_CHAIN')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Expand to Full Blockchain</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* State 07 & 08: FULL BLOCKCHAIN & TIME TRAVEL & CIRCULAR TIMELINE */}
      {(cameraState === 'STATE_07_CHAIN' || cameraState === 'STATE_08_INSPECTION') && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Section 8: Chained Blocks Perspective Ribbon (Polygon Amoy Testnet) */}
          <div className="p-6 rounded-3xl border border-amber-500/30 bg-[#0b0703]/90 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-950/70 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/70 block">
                  3D Spatial History & Time Travel
                </span>
                <h3 className="text-base md:text-lg font-bold text-white font-display">
                  Connected Blockchain Chain (Blocks #182901 → #182906)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={triggerChainVerificationPulse}
                  disabled={isVerifyingChain}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-200 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Verify Full Chain Pulse</span>
                </button>

                <button
                  onClick={simulateTamper}
                  className="px-3.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-red-200 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>Simulate Data Tamper</span>
                </button>
              </div>
            </div>

            {/* Time Travel Slider Control */}
            <div className="flex items-center gap-4 py-2 text-xs font-mono">
              <span className="text-amber-400/70 shrink-0">Time Travel Scrubber:</span>
              <input
                type="range"
                min={182901}
                max={blocks.length > 0 ? blocks[blocks.length - 1].blockNumber : 182906}
                value={selectedBlockNumber}
                onChange={(e) => {
                  const bNum = Number(e.target.value);
                  setSelectedBlockNumber(bNum);
                  haptics.tap();
                  blockchainAudio.playPulsePing(1.1);
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-white font-bold shrink-0">Block #{selectedBlockNumber}</span>
            </div>

            {/* Horizontal Chained Blocks Ribbon */}
            <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-2">
              {blocks.map((b, idx) => {
                const isSelected = selectedBlockNumber === b.blockNumber;
                const isTamperedBlock = isTampered && b.blockNumber === 182904;
                const isLit = pulseBlockIndex === idx;

                return (
                  <React.Fragment key={b.blockNumber}>
                    <div
                      onClick={() => {
                        setSelectedBlockNumber(b.blockNumber);
                        haptics.cellSelect();
                        blockchainAudio.playPulsePing(1.2);
                        goToState('STATE_08_INSPECTION');
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer shrink-0 min-w-[210px] space-y-2 ${
                        isTamperedBlock
                          ? 'border-red-500 bg-red-950/70 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
                          : isLit
                          ? 'border-sky-400 bg-sky-950/70 shadow-[0_0_20px_rgba(56,189,248,0.5)] scale-105'
                          : isSelected
                          ? 'border-amber-400 bg-amber-950/60 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105'
                          : 'border-white/5 bg-black/40 hover:border-amber-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white font-bold">Block #{b.blockNumber}</span>
                        {isTamperedBlock ? (
                          <span className="text-red-400 font-bold text-[10px]">FAILED ✗</span>
                        ) : (
                          <span className="text-emerald-400 text-[10px]">✓ Sealed</span>
                        )}
                      </div>

                      <div className="text-[11px] font-mono text-amber-200/70 truncate">
                        Hash: {b.hash}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-amber-400/60 pt-1 border-t border-white/5">
                        <span>{b.transactionsCount} Transactions</span>
                        <span>{new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {/* Connecting Link Arrow / Broken Glyph */}
                    {idx < blocks.length - 1 && (
                      <div className="shrink-0 font-mono text-base px-1">
                        {isTampered && b.blockNumber === 182904 ? (
                          <span className="text-red-500 font-bold animate-ping">⚡ BROKEN ⚡</span>
                        ) : (
                          <span className="text-amber-500 animate-pulse">🔗 →</span>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Section 9: Previous Hash → Current Hash Cryptographic Connection Card */}
            {currentBlock && (
              <div className="p-4 rounded-2xl border border-amber-500/25 bg-black/50 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400/80 font-bold uppercase tracking-wider">
                    Cryptographic Hash Relationship (Parent → Child Linkage)
                  </span>
                  <span className="text-emerald-400 text-[11px]">SHA3-256 Merkle Proven</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {/* Previous Block Hash */}
                  <div className="p-3 rounded-xl bg-[#140c04] border border-amber-950/60 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-amber-400/60">
                      <span>PREVIOUS BLOCK HASH (PARENT LINK)</span>
                      <button
                        onClick={() => handleCopy(currentBlock.prevHash, 'Parent Hash')}
                        className="text-amber-400 hover:text-white cursor-pointer"
                      >
                        {copiedHash === currentBlock.prevHash ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="text-white text-xs break-all select-all font-semibold">
                      {currentBlock.prevHash}
                    </div>
                    <span className="text-[10px] text-amber-200/50 block">
                      Feeds directly into Block #{currentBlock.blockNumber}'s state root.
                    </span>
                  </div>

                  {/* Current Block Hash */}
                  <div className="p-3 rounded-xl bg-[#140c04] border border-amber-950/60 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-amber-400/60">
                      <span>CURRENT BLOCK HASH (THIS BLOCK)</span>
                      <button
                        onClick={() => handleCopy(currentBlock.hash, 'Current Hash')}
                        className="text-amber-400 hover:text-white cursor-pointer"
                      >
                        {copiedHash === currentBlock.hash ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="text-white text-xs break-all select-all font-semibold">
                      {currentBlock.hash}
                    </div>
                    <span className="text-[10px] text-emerald-400/80 block">
                      ✓ Any alteration to earlier blocks invalidates this hash.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 11: Circular Spatial Event Timeline Inside Block */}
          <CircularEventTimeline
            blockNumber={selectedBlockNumber}
            onOpenTxInspector={(txHash) => {
              setInspectorTxHash(txHash);
              setIsInspectorOpen(true);
            }}
          />
        </div>
      )}

      {/* 5. TRANSACTION INSPECTOR MODAL */}
      <TransactionInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        txHash={inspectorTxHash}
        transactions={transactions}
        blockNumber={selectedBlockNumber}
      />
    </div>
  );
};
