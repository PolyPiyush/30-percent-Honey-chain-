/**
 * HoneyChain — Live Hive & Oracle Event Controller
 * Handles:
 * - Live Hive Stream toggle (continuous subtle updates)
 * - Harvest Event simulation (weight threshold trigger -> on-chain event)
 * - Outlier anomaly simulation (abnormal 48.7°C -> Oracle halts -> Simulate Valid Data)
 * - Real-time Oracle Verification Ring & Criteria Checklist
 */

import React from 'react';
import { LiveTelemetry, VerificationState, OracleRuleCheck } from './types';
import {
  Radio,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { haptics } from '../../../utils/haptics';

interface LiveHiveControllerProps {
  telemetry: LiveTelemetry;
  isLiveStreamActive: boolean;
  onToggleLiveStream: () => void;
  isSimulatingHarvest: boolean;
  onSimulateHarvest: () => void;
  isOutlier: boolean;
  onToggleOutlier: () => void;
  onRestoreValidData: () => void;
  verificationState: VerificationState;
  oracleRules: OracleRuleCheck[];
  onTriggerManualVerification: () => void;
}

export const LiveHiveController: React.FC<LiveHiveControllerProps> = ({
  telemetry,
  isLiveStreamActive,
  onToggleLiveStream,
  isSimulatingHarvest,
  onSimulateHarvest,
  isOutlier,
  onToggleOutlier,
  onRestoreValidData,
  verificationState,
  oracleRules,
  onTriggerManualVerification,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono text-xs">
      {/* 1. Live Hive Stream & Telemetry Box */}
      <div className="p-4 rounded-2xl border border-amber-950/70 bg-[#0c0804]/90 backdrop-blur-md flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-amber-950">
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${isLiveStreamActive ? 'text-emerald-400 animate-pulse' : 'text-amber-400/60'}`} />
            <span className="font-bold text-white text-sm">LIVE HIVE TELEMETRY</span>
          </div>
          <button
            onClick={() => {
              haptics.buttonClick();
              onToggleLiveStream();
            }}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isLiveStreamActive
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-black/50 text-amber-300/80 border border-amber-950 hover:bg-amber-950/40'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStreamActive ? 'bg-slate-950 animate-ping' : 'bg-amber-500/50'}`} />
            <span>{isLiveStreamActive ? 'LIVE ACTIVE' : 'START STREAM'}</span>
          </button>
        </div>

        {/* Real-time Telemetry Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 py-3">
          <div className={`p-2.5 rounded-xl border ${isOutlier ? 'border-red-500/60 bg-red-950/30' : 'border-amber-950 bg-black/40'}`}>
            <span className="text-[10px] text-amber-400/60 block">TEMP</span>
            <div className={`text-base font-bold font-mono-numbers mt-0.5 ${isOutlier ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {telemetry.temp.toFixed(1)}°C
            </div>
            <span className="text-[9px] text-amber-400/40 block mt-0.5">Brood Probe</span>
          </div>

          <div className="p-2.5 rounded-xl border border-amber-950 bg-black/40">
            <span className="text-[10px] text-cyan-400/60 block">HUMIDITY</span>
            <div className="text-base font-bold text-white font-mono-numbers mt-0.5">
              {telemetry.humidity.toFixed(1)}%
            </div>
            <span className="text-[9px] text-cyan-400/40 block mt-0.5">SHT40 Rel</span>
          </div>

          <div className="p-2.5 rounded-xl border border-amber-950 bg-black/40">
            <span className="text-[10px] text-emerald-400/60 block">WEIGHT</span>
            <div className="text-base font-bold text-white font-mono-numbers mt-0.5">
              {telemetry.weight.toFixed(1)} kg
            </div>
            <span className="text-[9px] text-emerald-400/40 block mt-0.5">HX711 Tare</span>
          </div>
        </div>

        <div className="pt-2 border-t border-amber-950 flex items-center justify-between text-[11px] text-amber-200/60">
          <span>Hive: <strong className="text-amber-300">{telemetry.hiveId}</strong></span>
          <span>Activity: <strong className="text-emerald-400">{telemetry.activity}</strong></span>
        </div>
      </div>

      {/* 2. Oracle Verification Gate Real-Time Status */}
      <div className={`p-4 rounded-2xl border backdrop-blur-md flex flex-col justify-between shadow-xl transition-all ${
        isOutlier
          ? 'border-red-500/50 bg-[#160808]/90'
          : verificationState === 'verified'
          ? 'border-emerald-500/50 bg-[#05140d]/90'
          : 'border-cyan-900/50 bg-[#07131a]/90'
      }`}>
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`w-4 h-4 ${
              isOutlier ? 'text-red-400' : verificationState === 'verified' ? 'text-emerald-400' : 'text-cyan-400'
            }`} />
            <div>
              <span className="font-bold text-white text-sm">ORACLE VERIFICATION GATE</span>
              <span className="text-[9px] text-cyan-300/60 block uppercase">Real-World Data Verification</span>
            </div>
          </div>

          {/* Verification Badge */}
          <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
            isOutlier
              ? 'bg-red-950/80 text-red-400 border-red-500/60 animate-pulse'
              : verificationState === 'verified'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
              : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60'
          }`}>
            {isOutlier
              ? '⚠ OUTLIER DETECTED'
              : verificationState === 'verified'
              ? 'VERIFIED ✓'
              : 'VERIFYING...'}
          </div>
        </div>

        {/* 5-Rule Verification Checklist */}
        <div className="space-y-1.5 py-2">
          {oracleRules.map((r) => (
            <div key={r.id} className="flex items-center justify-between text-[11px] px-2 py-1 rounded bg-black/30">
              <span className="text-white/80">{r.label}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-white/50">{r.actualValue}</span>
                {r.status === 'passed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {r.status === 'failed' && <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-bounce" />}
                {r.status === 'checking' && <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
              </div>
            </div>
          ))}
        </div>

        {/* Outlier Resolution or Trigger Button */}
        {isOutlier ? (
          <button
            onClick={() => {
              haptics.success();
              onRestoreValidData();
            }}
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simulate Valid Data (Resume Flow)</span>
          </button>
        ) : (
          <div className="flex items-center justify-between text-[10px] text-white/60 pt-1 border-t border-white/10">
            <span>secp256k1 Signature: <strong className="text-cyan-300 font-mono">0x81b4...291f</strong></span>
            <span className="text-emerald-400">Tolerance Checked</span>
          </div>
        )}
      </div>

      {/* 3. Event Triggers: Harvest Simulation & Outlier Test */}
      <div className="p-4 rounded-2xl border border-amber-950/70 bg-[#0c0804]/90 backdrop-blur-md flex flex-col justify-between shadow-xl">
        <div className="pb-2 border-b border-amber-950">
          <span className="text-amber-400/80 font-bold uppercase tracking-wider text-[10px] block">
            DEMO EVENT TRIGGERS
          </span>
          <h4 className="text-sm font-bold text-white font-display">
            Blockchain Event Triggers
          </h4>
        </div>

        <div className="space-y-2 py-2">
          {/* Harvest Event Trigger */}
          <button
            onClick={() => {
              haptics.verificationRipple();
              onSimulateHarvest();
            }}
            disabled={isSimulatingHarvest}
            className="w-full p-2.5 rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20 text-white font-semibold transition-all cursor-pointer flex items-center justify-between disabled:opacity-50"
          >
            <div className="flex items-center gap-2 text-left">
              <Zap className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold block text-amber-200">Simulate Harvest Event</span>
                <span className="text-[10px] text-amber-400/70">
                  Weight: 42.7kg → 45.2kg (Threshold crossed)
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Trigger
            </span>
          </button>

          {/* Outlier Anomaly Simulation Toggle */}
          <button
            onClick={() => {
              haptics.buttonClick();
              onToggleOutlier();
            }}
            className={`w-full p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              isOutlier
                ? 'border-red-500/60 bg-red-950/30 text-red-200'
                : 'border-amber-950 bg-black/40 hover:bg-white/5 text-white/80'
            }`}
          >
            <div className="flex items-center gap-2 text-left">
              <AlertTriangle className={`w-4 h-4 ${isOutlier ? 'text-red-400 animate-bounce' : 'text-amber-400/60'}`} />
              <div>
                <span className="text-xs font-bold block">
                  {isOutlier ? 'Outlier Active: 48.7°C' : 'Test Outlier / Anomaly'}
                </span>
                <span className="text-[10px] text-white/50">
                  Injects abnormal temperature to test Oracle gate rejection
                </span>
              </div>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded ${isOutlier ? 'bg-red-500/30 text-red-300' : 'bg-black/50 text-white/60'}`}>
              {isOutlier ? 'Active' : 'Test'}
            </span>
          </button>
        </div>

        {/* Motto Banner */}
        <div className="pt-2 border-t border-amber-950 text-[10px] text-amber-200/50 italic leading-snug">
          "We don't put the hive on the blockchain. We bring verified hive events to the blockchain."
        </div>
      </div>
    </div>
  );
};
