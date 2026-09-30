/**
 * HoneyChain — "THE DIGITAL NERVOUS SYSTEM"
 * IoT + Oracle + Smart Contract + Blockchain Architecture
 *
 * Visualizes the complete journey from physical apiary edge hardware
 * to cryptographic decentralized verification and immutable ledger storage.
 *
 * Motto: "We don't put the hive on the blockchain. We bring verified hive events to the blockchain."
 */

import React, { useState, useEffect, useRef } from 'react';
import { useHive } from '../../context/HiveContext';
import { DigitalNervousSystem3D } from './oracle/DigitalNervousSystem3D';
import { DigitalHive, DigitalHiveCanvas } from './oracle/DigitalHive';
import { DataInspectorDrawer } from './oracle/DataInspectorDrawer';
import { StoryProgressController } from './oracle/StoryProgressController';
import { LiveHiveController } from './oracle/LiveHiveController';
import {
  StoryStage,
  InteractiveTarget,
  LiveTelemetry,
  VerificationState,
  OracleRuleCheck,
} from './oracle/types';
import { oracleAudio } from './oracle/oracleAudio';
import { haptics } from '../../utils/haptics';
import {
  Activity,
  Layers,
  Network,
  ShieldCheck,
  FileCode,
  Link2,
  Cpu,
  Sparkles,
  ArrowRight,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Eye,
  ArrowLeft,
  Info,
} from 'lucide-react';

export const OraclePipelineModule: React.FC = () => {
  const { hives, batches, showToast, exitToDashboard } = useHive();

  const activeHiveRef = hives[0] || {
    hiveNumber: 'Hive #MH-024',
    currentTemp: 34.2,
    currentHumidity: 68.0,
    currentWeight: 42.7,
  };

  // Stage & Story Navigation
  const [stage, setStage] = useState<StoryStage>('hive');
  const [scrollProgress, setScrollProgress] = useState<number>(0.05);
  const [isPlayingTour, setIsPlayingTour] = useState<boolean>(false);
  const [selectedTarget, setSelectedTarget] = useState<InteractiveTarget | null>(null);
  const [viewMode, setViewMode] = useState<'pipeline' | 'digital_hive_3d'>('pipeline');

  // Live Hive Telemetry State
  const [isLiveStreamActive, setIsLiveStreamActive] = useState<boolean>(true);
  const [isOutlier, setIsOutlier] = useState<boolean>(false);
  const [isSimulatingHarvest, setIsSimulatingHarvest] = useState<boolean>(false);
  const [verificationState, setVerificationState] = useState<VerificationState>('verified');
  const [activeBlockNumber, setActiveBlockNumber] = useState<number>(182906);

  const [telemetry, setTelemetry] = useState<LiveTelemetry>({
    hiveId: activeHiveRef.hiveNumber || 'Hive #MH-024',
    apiary: 'Satara Apiary Reserve #4',
    temp: 34.2,
    humidity: 68.0,
    weight: 42.7,
    activity: 'Optimal (218 bees/min)',
    activityCount: 218,
    environment: 27.8,
    honeyProductionKg: 14.5,
    batteryPercent: 96,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    isOutlier: false,
  });

  // 5-Rule Real-time Oracle Checklist
  const [oracleRules, setOracleRules] = useState<OracleRuleCheck[]>([
    {
      id: 'rule-identity',
      label: 'Hive Identity & Hardware Public Key',
      status: 'passed',
      expectedRange: 'Valid ECDSA key registered',
      actualValue: '0x3c81...02fa ✓',
    },
    {
      id: 'rule-timestamp',
      label: 'Timestamp Freshness (<60s drift)',
      status: 'passed',
      expectedRange: '±60 sec block drift',
      actualValue: '12s ago ✓',
    },
    {
      id: 'rule-signature',
      label: 'secp256k1 Sensor Payload Signature',
      status: 'passed',
      expectedRange: 'Cryptographically valid',
      actualValue: '0x81b4...291f ✓',
    },
    {
      id: 'rule-integrity',
      label: 'HMAC Data Integrity Checksum',
      status: 'passed',
      expectedRange: 'Hash matched SHA256',
      actualValue: '0xd4e5...8fa3 ✓',
    },
    {
      id: 'rule-range',
      label: 'Brood Chamber Tolerance Range',
      status: 'passed',
      expectedRange: '32.0°C — 38.0°C',
      actualValue: '34.2°C (Nominal) ✓',
    },
  ]);

  // Handle continuous subtle live hive updates
  useEffect(() => {
    if (!isLiveStreamActive) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        if (isOutlier) return prev; // Keep outlier if active

        // Subtle realistic organic jitter
        const tempDelta = (Math.random() - 0.5) * 0.2;
        const humDelta = (Math.random() - 0.5) * 0.4;
        const newTemp = Math.max(33.8, Math.min(34.8, prev.temp + tempDelta));
        const newHum = Math.max(66.0, Math.min(70.0, prev.humidity + humDelta));
        const newAct = 210 + Math.floor(Math.random() * 20);

        return {
          ...prev,
          temp: parseFloat(newTemp.toFixed(1)),
          humidity: parseFloat(newHum.toFixed(1)),
          activityCount: newAct,
          activity: `Optimal (${newAct} bees/min)`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [isLiveStreamActive, isOutlier]);

  // Automated Tour / Play Mode
  useEffect(() => {
    if (!isPlayingTour) return;

    const stagesInOrder: StoryStage[] = [
      'hive',
      'sensors',
      'convergence',
      'gateway',
      'api',
      'oracle',
      'smart_contract',
      'blockchain',
      'overview',
    ];

    const currentIdx = stagesInOrder.indexOf(stage);

    const timer = setTimeout(() => {
      if (currentIdx < stagesInOrder.length - 1) {
        const nextStage = stagesInOrder[currentIdx + 1];
        setStage(nextStage);
        setScrollProgress((currentIdx + 1) / (stagesInOrder.length - 1));
      } else {
        setIsPlayingTour(false);
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [isPlayingTour, stage]);

  // Trigger Outlier Anomaly
  const handleToggleOutlier = () => {
    haptics.buttonClick();
    if (!isOutlier) {
      // Invalidate
      setIsOutlier(true);
      setVerificationState('outlier_rejected');
      oracleAudio.playOracleOutlier();
      setTelemetry((prev) => ({
        ...prev,
        temp: 48.7, // Abnormal temperature!
        isOutlier: true,
        outlierType: 'temperature',
      }));

      // Update Oracle rule check #5
      setOracleRules((rules) =>
        rules.map((r) =>
          r.id === 'rule-range'
            ? {
                ...r,
                status: 'failed',
                actualValue: '48.7°C (OUTLIER! >38.0°C)',
              }
            : r
        )
      );

      // Pan to Oracle gate if not already there
      setStage('oracle');
      setScrollProgress(0.72);
      showToast('⚠ Outlier Detected (48.7°C) — Oracle Gate halted packet!', 'warning');
    } else {
      handleRestoreValidData();
    }
  };

  // Restore Valid Data
  const handleRestoreValidData = () => {
    haptics.success();
    setIsOutlier(false);
    setVerificationState('scanning');
    oracleAudio.playScanningTick(3);

    setTelemetry((prev) => ({
      ...prev,
      temp: 34.2,
      isOutlier: false,
    }));

    setTimeout(() => {
      setVerificationState('verified');
      oracleAudio.playOracleSuccess();

      setOracleRules((rules) =>
        rules.map((r) =>
          r.id === 'rule-range'
            ? {
                ...r,
                status: 'passed',
                actualValue: '34.2°C (Nominal) ✓',
              }
            : r
        )
      );
      showToast('Sensor readings restored to nominal bounds — Oracle Verified ✓', 'success');
    }, 900);
  };

  // Trigger Harvest Event Simulation
  const handleSimulateHarvest = () => {
    haptics.verificationRipple();
    setIsSimulatingHarvest(true);

    // 1. Weight crosses threshold 45kg
    setTelemetry((prev) => ({
      ...prev,
      weight: 45.2,
      honeyProductionKg: 18.2,
    }));
    showToast('⚖ Weight Threshold Crossed: 45.2 kg -> HARVEST EVENT GENERATED', 'info');

    // 2. Animate journey: Gateway -> API -> Oracle -> Smart Contract -> Blockchain
    setStage('gateway');
    setScrollProgress(0.5);

    setTimeout(() => {
      setStage('oracle');
      setScrollProgress(0.72);
      oracleAudio.playScanningTick(2);
    }, 1200);

    setTimeout(() => {
      oracleAudio.playOracleSuccess();
      setStage('smart_contract');
      setScrollProgress(0.85);
      oracleAudio.playContractAccept();
    }, 2400);

    setTimeout(() => {
      const nextBlock = activeBlockNumber + 1;
      setActiveBlockNumber(nextBlock);
      setStage('blockchain');
      setScrollProgress(1.0);
      oracleAudio.playBlockSeal();
      setIsSimulatingHarvest(false);
      showToast(`Block #${nextBlock} Sealed Immutably on Polygon Amoy!`, 'success');
    }, 3800);
  };

  // Reset to initial state
  const handleReset = () => {
    haptics.buttonClick();
    setStage('hive');
    setScrollProgress(0.05);
    setIsPlayingTour(false);
    setIsOutlier(false);
    setVerificationState('verified');
    setTelemetry((prev) => ({
      ...prev,
      temp: 34.2,
      humidity: 68.0,
      weight: 42.7,
      isOutlier: false,
    }));
    setOracleRules((rules) =>
      rules.map((r) => ({
        ...r,
        status: 'passed',
        actualValue: r.id === 'rule-range' ? '34.2°C (Nominal) ✓' : r.actualValue,
      }))
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-3 md:py-5 min-h-[calc(100vh-80px)] flex flex-col space-y-4 relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Header Banner with Architectural Motto */}
      <div className="p-4 md:p-5 rounded-2xl border border-amber-900/50 bg-[#0c0804]/90 backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
              IoT + Oracle Architecture
            </span>
            <span className="text-xs text-amber-200/50 font-mono">
              Polygon Amoy Synced · Contract 0x91F5...3C98
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-white font-display flex items-center gap-2">
            <span>THE DIGITAL NERVOUS SYSTEM</span>
          </h2>

          <p className="text-xs text-amber-200/70 max-w-2xl font-sans leading-relaxed">
            Visualizing the complete journey from physical hive telemetry to cryptographic Oracle verification, smart contract logic, and immutable blockchain blocks.
          </p>
        </div>

        {/* Quick Action Badges & View Switcher */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-amber-950 text-xs font-mono">
            <button
              onClick={() => {
                haptics.buttonClick();
                setViewMode('pipeline');
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'pipeline'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-amber-200/70 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Full Nervous System</span>
            </button>
            <button
              onClick={() => {
                haptics.buttonClick();
                setViewMode('digital_hive_3d');
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'digital_hive_3d'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-amber-200/70 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Digital Hive 3D (R3F)</span>
            </button>
          </div>

          <button
            onClick={() => {
              haptics.buttonClick();
              setSelectedTarget('oracle');
            }}
            className="px-3 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Inspect Oracle Gate</span>
          </button>

          <button
            onClick={() => {
              haptics.buttonClick();
              exitToDashboard();
            }}
            className="px-3 py-2 rounded-xl bg-black/60 hover:bg-white/10 border border-amber-950 text-amber-300/80 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Transformation Data Highway Ribbon (Section 6 & 13) */}
      <div className="hidden sm:flex items-center justify-between gap-1 px-4 py-2.5 rounded-xl border border-amber-950/70 bg-black/50 text-[11px] font-mono text-amber-200/70 overflow-x-auto scrollbar-none">
        <span className="flex items-center gap-1 font-bold text-amber-300 shrink-0">
          <span>🐝 REAL HIVE</span>
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-amber-500/40 shrink-0" />
        <span className="flex items-center gap-1 shrink-0">
          <span>🌡️ SENSORS</span>
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-amber-500/40 shrink-0" />
        <span className="flex items-center gap-1 shrink-0">
          <span>⬡ IOT GATEWAY</span>
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-amber-500/40 shrink-0" />
        <span className="flex items-center gap-1 shrink-0">
          <span>📦 DATA PACKET</span>
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-amber-500/40 shrink-0" />
        <span className="flex items-center gap-1 shrink-0">
          <span>🌐 BACKEND API</span>
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-cyan-500/40 shrink-0" />
        <span className="flex items-center gap-1 font-bold text-cyan-300 shrink-0">
          <span>🔐 ORACLE VERIFICATION</span>
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-indigo-500/40 shrink-0" />
        <span className="flex items-center gap-1 shrink-0">
          <span>⚙️ SMART CONTRACT</span>
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-sky-500/40 shrink-0" />
        <span className="flex items-center gap-1 font-bold text-sky-300 shrink-0">
          <span>⬡ BLOCKCHAIN RECORD</span>
        </span>
      </div>

      {/* 3. The Central 3D Canvas Stage */}
      {viewMode === 'digital_hive_3d' ? (
        <div className="relative w-full h-[540px] md:h-[600px] rounded-3xl border border-amber-900/40 bg-gradient-to-b from-[#0e0904] via-[#090502] to-[#040201] overflow-hidden shadow-2xl flex flex-col">
          {/* Header Tag */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
            <div className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-amber-500/40 text-xs font-mono flex items-center gap-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-amber-200/80 font-bold uppercase tracking-wider">
                REACT THREE FIBER — DIGITAL HIVE TWIN
              </span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/70">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Center-Left 3D Hive · Orbiting Worker Bees · Organic Cell Pulsing</span>
            </div>
          </div>

          {/* R3F Digital Hive Canvas (Stylized Honeycomb Hive positioned at Center-Left) */}
          <DigitalHiveCanvas
            className="w-full h-full"
            position={[-3.6, 0, 0]}
            scale={1.05}
            telemetry={telemetry}
            isOutlier={isOutlier}
            selectedTarget={selectedTarget}
            onSelectTarget={(target) => setSelectedTarget(target)}
          />

          {/* Right Floating Monitored Parameters HUD */}
          <div className="absolute top-16 right-4 z-20 w-72 max-w-[calc(100vw-2rem)] flex flex-col gap-2 pointer-events-auto">
            <div className="p-3.5 rounded-2xl bg-black/85 backdrop-blur-md border border-amber-950/80 shadow-2xl text-xs font-mono space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-amber-950">
                <span className="text-amber-400/90 font-bold uppercase text-[10px]">
                  ORGANIC PULSING PARAMETERS
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  {telemetry.hiveId}
                </span>
              </div>

              {/* 6 Monitored Parameter Indicators */}
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedTarget('sensor_temp')}
                  className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isOutlier
                      ? 'border-red-500/60 bg-red-950/30 text-red-200'
                      : 'border-orange-950 bg-black/40 hover:bg-orange-950/30'
                  }`}
                >
                  <span className="text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    🌡 Brood Temperature
                  </span>
                  <span className="font-bold font-mono-numbers text-orange-400">
                    {telemetry.temp.toFixed(1)}°C
                  </span>
                </button>

                <button
                  onClick={() => setSelectedTarget('sensor_humidity')}
                  className="w-full p-2 rounded-xl border border-cyan-950 bg-black/40 hover:bg-cyan-950/30 text-left flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    💧 Chamber Humidity
                  </span>
                  <span className="font-bold font-mono-numbers text-cyan-300">
                    {telemetry.humidity.toFixed(1)}%
                  </span>
                </button>

                <button
                  onClick={() => setSelectedTarget('sensor_weight')}
                  className="w-full p-2 rounded-xl border border-emerald-950 bg-black/40 hover:bg-emerald-950/30 text-left flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ⚖ Platform Weight
                  </span>
                  <span className="font-bold font-mono-numbers text-emerald-400">
                    {telemetry.weight.toFixed(1)} kg
                  </span>
                </button>

                <button
                  onClick={() => setSelectedTarget('sensor_activity')}
                  className="w-full p-2 rounded-xl border border-amber-950 bg-black/40 hover:bg-amber-950/30 text-left flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    🐝 Bee Activity
                  </span>
                  <span className="font-bold font-mono-numbers text-amber-300">
                    {telemetry.activityCount}/m
                  </span>
                </button>

                <button
                  onClick={() => setSelectedTarget('sensor_env')}
                  className="w-full p-2 rounded-xl border border-lime-950 bg-black/40 hover:bg-lime-950/30 text-left flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-lime-400" />
                    🌱 Ambient Environment
                  </span>
                  <span className="font-bold font-mono-numbers text-lime-400">
                    {telemetry.environment.toFixed(1)}°C
                  </span>
                </button>

                <button
                  onClick={() => setSelectedTarget('hive')}
                  className="w-full p-2 rounded-xl border border-amber-950 bg-black/40 hover:bg-amber-950/30 text-left flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    🍯 Honey Super Mass
                  </span>
                  <span className="font-bold font-mono-numbers text-amber-400">
                    {telemetry.honeyProductionKg.toFixed(1)} kg
                  </span>
                </button>
              </div>

              {/* Quick Action in 3D Mode */}
              <div className="pt-2 border-t border-amber-950 flex items-center gap-2">
                <button
                  onClick={handleToggleOutlier}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                    isOutlier
                      ? 'bg-red-500 text-white border-red-400'
                      : 'bg-black/60 text-amber-300 border-amber-950 hover:bg-amber-950/50'
                  }`}
                >
                  {isOutlier ? 'Restore Nominal' : 'Test Anomaly (48.7°C)'}
                </button>
                <button
                  onClick={handleSimulateHarvest}
                  className="flex-1 py-1.5 rounded-lg text-[10px] font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer"
                >
                  Simulate Harvest
                </button>
              </div>
            </div>
          </div>

          {/* 3D Scene Bottom Quick Jump Bar */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-auto">
            <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md p-1.5 rounded-xl border border-amber-950 text-[10px] font-mono">
              <span className="text-amber-400/80 font-bold px-2">Click Cells in 3D to Inspect Live Parameters</span>
            </div>

            <button
              onClick={() => {
                haptics.buttonClick();
                setViewMode('pipeline');
              }}
              className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 text-[10px] font-mono text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Pipeline</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-[520px] md:h-[580px] rounded-3xl border border-amber-900/40 bg-gradient-to-b from-[#0e0904] via-[#090502] to-[#040201] overflow-hidden shadow-2xl flex flex-col">
          {/* Floating Canvas UI Header: Current Architectural Phase Indicator */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
            <div className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-amber-500/40 text-xs font-mono flex items-center gap-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-200/80 font-bold uppercase tracking-wider">
                {stage === 'overview'
                  ? 'SYSTEM OVERVIEW: THE COMPLETE 5-LAYER ECOSYSTEM'
                  : `STAGE: ${stage.toUpperCase().replace('_', ' ')}`}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/70">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Click any 3D object to inspect live specifications</span>
            </div>
          </div>

          {/* Floating Outlier Alert Ribbon if triggered */}
          {isOutlier && (
            <div className="absolute top-4 right-4 z-20 px-4 py-2 rounded-xl bg-red-950/90 border border-red-500/80 text-xs font-mono text-red-200 flex items-center gap-2 shadow-2xl animate-bounce">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="font-bold">⚠ OUTLIER DETECTED (48.7°C): ORACLE HALTED PACKET</span>
            </div>
          )}

          {/* Three.js 3D WebGL Canvas */}
          <DigitalNervousSystem3D
            stage={stage}
            scrollProgress={scrollProgress}
            telemetry={telemetry}
            verificationState={verificationState}
            onSelectTarget={(target) => setSelectedTarget(target)}
            selectedTarget={selectedTarget}
            isOutlier={isOutlier}
            isSimulatingHarvest={isSimulatingHarvest}
            activeBlockNumber={activeBlockNumber}
          />

          {/* 3D Scene Bottom Quick Jump Bar */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-auto">
            <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md p-1.5 rounded-xl border border-amber-950 text-[10px] font-mono">
              <span className="text-amber-400/60 px-2 font-bold uppercase hidden sm:inline">3D Hotspots:</span>
              <button
                onClick={() => {
                  haptics.buttonClick();
                  setSelectedTarget('hive');
                  setStage('hive');
                }}
                className="px-2 py-1 rounded bg-white/5 hover:bg-amber-500/20 text-white cursor-pointer"
              >
                Hive Twin
              </button>
              <button
                onClick={() => {
                  haptics.buttonClick();
                  setSelectedTarget('sensor_temp');
                  setStage('sensors');
                }}
                className="px-2 py-1 rounded bg-white/5 hover:bg-amber-500/20 text-white cursor-pointer"
              >
                Sensors
              </button>
              <button
                onClick={() => {
                  haptics.buttonClick();
                  setSelectedTarget('gateway');
                  setStage('gateway');
                }}
                className="px-2 py-1 rounded bg-white/5 hover:bg-amber-500/20 text-white cursor-pointer"
              >
                Gateway
              </button>
              <button
                onClick={() => {
                  haptics.buttonClick();
                  setSelectedTarget('oracle');
                  setStage('oracle');
                }}
                className="px-2 py-1 rounded bg-white/5 hover:bg-cyan-500/20 text-cyan-200 cursor-pointer font-bold"
              >
                Oracle Gate
              </button>
              <button
                onClick={() => {
                  haptics.buttonClick();
                  setSelectedTarget('smart_contract');
                  setStage('smart_contract');
                }}
                className="px-2 py-1 rounded bg-white/5 hover:bg-indigo-500/20 text-indigo-200 cursor-pointer"
              >
                Contract
              </button>
              <button
                onClick={() => {
                  haptics.buttonClick();
                  setSelectedTarget('blockchain');
                  setStage('blockchain');
                }}
                className="px-2 py-1 rounded bg-white/5 hover:bg-sky-500/20 text-sky-200 cursor-pointer"
              >
                Blockchain
              </button>
              <button
                onClick={() => {
                  haptics.buttonClick();
                  setSelectedTarget('ai_node');
                }}
                className="px-2 py-1 rounded bg-white/5 hover:bg-emerald-500/20 text-emerald-200 cursor-pointer"
              >
                AI Vitality
              </button>
            </div>

            <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-950 text-[10px] font-mono text-amber-300">
              Block: <strong className="text-white">#{activeBlockNumber}</strong>
            </div>
          </div>
        </div>
      )}

      {/* 4. Story Scrubber & Step Controller (Section 20) */}
      <StoryProgressController
        stage={stage}
        onSetStage={(st) => setStage(st)}
        scrollProgress={scrollProgress}
        onProgressChange={(val) => setScrollProgress(val)}
        isPlaying={isPlayingTour}
        onTogglePlay={() => setIsPlayingTour(!isPlayingTour)}
        onReset={handleReset}
      />

      {/* 5. Live Hive & Event Triggers & Oracle Status (Sections 9, 16, 17) */}
      <LiveHiveController
        telemetry={telemetry}
        isLiveStreamActive={isLiveStreamActive}
        onToggleLiveStream={() => setIsLiveStreamActive(!isLiveStreamActive)}
        isSimulatingHarvest={isSimulatingHarvest}
        onSimulateHarvest={handleSimulateHarvest}
        isOutlier={isOutlier}
        onToggleOutlier={handleToggleOutlier}
        onRestoreValidData={handleRestoreValidData}
        verificationState={verificationState}
        oracleRules={oracleRules}
        onTriggerManualVerification={() => {
          setVerificationState('scanning');
          setTimeout(() => setVerificationState('verified'), 800);
        }}
      />

      {/* 6. Section 10: Verified Data Split Architecture Explainer */}
      <div className="p-5 rounded-2xl border border-amber-950/70 bg-[#0c0804]/90 backdrop-blur-md shadow-xl font-mono text-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-amber-950">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-sm">
              VERIFIED DATA SPLIT: WHY WE DO NOT PUT RAW DATA ON-CHAIN
            </h3>
          </div>
          <span className="text-[10px] text-amber-400/60 uppercase">
            Architectural Dual Path
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Path A */}
          <div className="p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                PATH A — APPLICATION LAYER
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                Off-Chain
              </span>
            </div>
            <div className="text-[11px] text-emerald-200/80 leading-relaxed font-sans">
              Verified sensor readings flow directly to backend dashboards and <strong>HIVE AI</strong> for anomaly prediction, queen vitality tracking, and colony health forecasting without gas fees or ledger bloat.
            </div>
            <div className="text-[10px] text-emerald-300 font-mono pt-1">
              Colony Vitality: 98% Optimal · Disease Risk: Low · Production: +14%
            </div>
          </div>

          {/* Path B */}
          <div className="p-4 rounded-xl border border-sky-900/40 bg-sky-950/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sky-400 font-bold text-xs flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5" />
                PATH B — TRUST LAYER
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-800/40">
                On-Chain (Polygon Amoy)
              </span>
            </div>
            <div className="text-[11px] text-sky-200/80 leading-relaxed font-sans">
              Only cryptographically verified milestone events (such as harvest thresholds, custody handoffs, and lab purity seals) are committed to the <strong>Smart Contract</strong> and permanently minted into blocks.
            </div>
            <div className="text-[10px] text-sky-300 font-mono pt-1">
              Smart Contract: HoneyChainTraceability.sol · Method: recordVerifiedHarvest()
            </div>
          </div>
        </div>
      </div>

      {/* 7. Deep Specification Inspector Drawer (Section 19) */}
      <DataInspectorDrawer
        target={selectedTarget}
        onClose={() => setSelectedTarget(null)}
        telemetry={telemetry}
        activeBlockNumber={activeBlockNumber}
      />
    </div>
  );
};
