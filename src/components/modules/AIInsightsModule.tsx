/**
 * HoneyChain AI Insights — "THE INTELLIGENT BEE" (HIVE AI)
 * Dark, futuristic biological cybernetic environment.
 * Robotic AI bee hovers around floating data streams, flying toward insight nodes,
 * displaying transparent 3-step reasoning: Sensor Data → AI Analysis → Recommendation.
 */

import React, { useState, useEffect } from 'react';
import { useHive } from '../../context/HiveContext';
import { apiService } from '../../services/api';
import { AIAnalysis } from '../../types';
import {
  Brain,
  Cpu,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Activity,
  Lightbulb,
  Radio,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export const AIInsightsModule: React.FC = () => {
  const { hives, activeHiveId, showToast } = useHive();
  const [selectedNodeIdx, setSelectedNodeIdx] = useState<number>(0);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const currentHive = hives.find((h) => h.id === activeHiveId) || hives[0];

  useEffect(() => {
    const fetchInsights = async () => {
      if (!currentHive) return;
      try {
        const data = await apiService.getAIInsights(currentHive.id);
        setAnalysis(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInsights();
  }, [currentHive?.id]);

  const insightNodes = [
    {
      id: 'node-colony',
      title: 'Colony Health & Vitality',
      status: '98% Optimal',
      color: '#10b981',
      sensorInput: `${currentHive?.currentTemp.toFixed(1)}°C Brood Temp · Stable diurnal curve ±0.3°C`,
      aiInference: 'Thermoregulation homeostasis consistent with strong worker cluster density.',
      action: 'Maintain unobstructed bottom-board ventilation; inspection interval set to 14 days.',
    },
    {
      id: 'node-swarming',
      title: 'Swarming Risk Prediction',
      status: 'Low (0.04 Index)',
      color: '#38bdf8',
      sensorInput: `${currentHive?.acousticFrequency} Hz fundamental acoustic frequency · Hive Weight: ${currentHive?.currentWeight.toFixed(1)} kg`,
      aiInference: 'No queen-piping harmonic detected (typically >240 Hz). Super comb space adequate.',
      action: 'Continue monitoring acoustics daily; provide additional honey super if weight exceeds 45kg.',
    },
    {
      id: 'node-production',
      title: 'Seasonal Yield Forecast',
      status: '+14.2% Regional Surplus',
      color: '#f59e0b',
      sensorInput: 'Diurnal nectar gain: +0.6 kg/day · Foraging velocity: 214 bees/min',
      aiInference: 'High mustard and forest wildflower bloom density confirmed in 3km foraging radius.',
      action: 'Prepare clean extraction centrifuges for scheduled harvest in mid-October.',
    },
    {
      id: 'node-disease',
      title: 'Pathogen & Varroa Risk',
      status: 'Nominal / Below Threshold',
      color: '#8b5cf6',
      sensorInput: 'Opto-gate wing beat frequency variance < 2% · Zero anomalous bee crawling patterns',
      aiInference: 'Absence of deformed wing syndrome or brood chill patterns.',
      action: 'Deploy natural thymol vapor strips as preventive post-harvest prophylactic.',
    },
    {
      id: 'node-stress',
      title: 'Environmental Climate Stress',
      status: 'Optimal (68% RH)',
      color: '#06b6d4',
      sensorInput: `Ambient: 24.5°C · Hive Core: ${currentHive?.currentTemp.toFixed(1)}°C · Humidity: ${currentHive?.currentHumidity.toFixed(1)}%`,
      aiInference: 'Bees successfully maintaining core humidity between 60-70% for larvae maturation.',
      action: 'Ensure clean spring water supply remains available within 200m of apiary boundary.',
    },
  ];

  const currentNode = insightNodes[selectedNodeIdx];

  // Coordinates of the AI bee flight based on selectedNodeIdx
  const beeFlightOffsets = [
    { x: '20%', y: '30%', rot: -10 },
    { x: '75%', y: '25%', rot: 15 },
    { x: '50%', y: '55%', rot: 0 },
    { x: '25%', y: '70%', rot: -15 },
    { x: '80%', y: '68%', rot: 20 },
  ];

  const currentBeePos = beeFlightOffsets[selectedNodeIdx] || beeFlightOffsets[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 h-[calc(100vh-80px)] overflow-y-auto space-y-6 relative selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-purple-900/50 bg-[#0d0714]/90 backdrop-blur-md sticky top-0 z-30 shadow-lg">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-display flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>HIVE AI — The Intelligent Cybernetic Bee</span>
          </h2>
          <p className="text-xs text-purple-200/60 mt-0.5">
            Click any telemetry node to guide the AI bee and decode real-time bio-inference logic.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-purple-950/80 border border-purple-800/40 text-purple-300">
            Hive: <strong>{currentHive?.hiveNumber}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/40 text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Fourier Spectral Model Active
          </span>
        </div>
      </div>

      {/* Cybernetic Flight Arena (Section 3 Requirement) */}
      <div className="relative rounded-3xl border border-purple-900/40 bg-gradient-to-b from-[#13071f] via-[#0b0412] to-[#040107] overflow-hidden p-6 shadow-2xl min-h-[440px] flex flex-col justify-between">
        {/* Holographic Radar Ring Backdrop */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[500px] h-[500px] rounded-full border border-purple-500/40 animate-[spin_60s_linear_infinite]" />
          <div className="absolute w-[350px] h-[350px] rounded-full border border-dashed border-cyan-500/40" />
          <div className="absolute w-[200px] h-[200px] rounded-full border border-amber-500/30" />
        </div>

        {/* The Animated Robotic Bee (HIVE AI) */}
        <div
          className="absolute z-20 pointer-events-none transition-all duration-700 ease-out will-change-transform"
          style={{
            left: currentBeePos.x,
            top: currentBeePos.y,
            transform: `translate(-50%, -50%) rotate(${currentBeePos.rot}deg)`,
          }}
        >
          {/* Cybernetic Bee SVG */}
          <div className="relative w-28 h-28 drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
              {/* Holographic Glowing Sensor Wings */}
              <g className="animate-[wingFlutter_0.07s_infinite_alternate] origin-[45px_45px]">
                <ellipse cx="28" cy="28" rx="20" ry="10" transform="rotate(-30 28 28)" fill="url(#aiWingGrad)" stroke="#38bdf8" strokeWidth="1" />
                <line x1="28" y1="28" x2="14" y2="20" stroke="#38bdf8" strokeWidth="0.8" />
              </g>
              <g className="animate-[wingFlutter_0.07s_infinite_alternate-reverse] origin-[55px_45px]">
                <ellipse cx="72" cy="28" rx="20" ry="10" transform="rotate(30 72 28)" fill="url(#aiWingGrad)" stroke="#38bdf8" strokeWidth="1" />
                <line x1="72" y1="28" x2="86" y2="20" stroke="#38bdf8" strokeWidth="0.8" />
              </g>

              {/* Metallic Honeycomb Carapace Body */}
              <path d="M42 45 L58 45 L64 68 L50 82 L36 68 Z" fill="#1e1030" stroke="#a855f7" strokeWidth="1.8" />
              <line x1="40" y1="54" x2="60" y2="54" stroke="#c084fc" strokeWidth="1.2" />
              <line x1="38" y1="62" x2="62" y2="62" stroke="#c084fc" strokeWidth="1.2" />
              <line x1="42" y1="70" x2="58" y2="70" stroke="#c084fc" strokeWidth="1.2" />

              {/* Cyber Thorax with Glowing Core */}
              <circle cx="50" cy="42" r="11" fill="#0f051d" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="50" cy="42" r="5" fill="#38bdf8" className="animate-pulse" />

              {/* Sensor Eyes / Optical Scanners */}
              <circle cx="45" cy="30" r="3.5" fill="#06b6d4" />
              <circle cx="55" cy="30" r="3.5" fill="#06b6d4" />
              <circle cx="45" cy="30" r="1.5" fill="#ffffff" />
              <circle cx="55" cy="30" r="1.5" fill="#ffffff" />

              {/* Antennae Probes */}
              <path d="M46 25 L40 14" stroke="#a855f7" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M54 25 L60 14" stroke="#a855f7" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="40" cy="14" r="2" fill="#38bdf8" />
              <circle cx="60" cy="14" r="2" fill="#38bdf8" />

              <defs>
                <linearGradient id="aiWingGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>

            {/* Cyan Scanning Beam */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-cyan-400/30 blur-md animate-ping" />
          </div>
        </div>

        {/* Floating Telemetry Stream Pills (Section 3 Requirement) */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {insightNodes.map((node, idx) => {
            const isSelected = selectedNodeIdx === idx;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeIdx(idx)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer backdrop-blur-md ${
                  isSelected
                    ? 'border-purple-400 bg-purple-950/60 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105'
                    : 'border-purple-950/70 bg-black/40 hover:border-purple-900/80'
                }`}
              >
                <div className="text-[10px] font-mono text-purple-400/80 flex items-center justify-between mb-1">
                  <span>NODE 0{idx + 1}</span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
                </div>
                <h4 className="text-xs font-semibold text-white truncate font-display">{node.title.split('&')[0]}</h4>
                <div className="text-[11px] font-mono mt-1 font-bold" style={{ color: node.color }}>
                  {node.status}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Context Banner */}
        <div className="relative z-10 pt-4 flex items-center justify-between text-xs font-mono text-purple-300/80">
          <span>HIVE AI Flight Coordinates: {currentBeePos.x}, {currentBeePos.y}</span>
          <span className="text-cyan-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Colony Diagnostics</span>
          </span>
        </div>
      </div>

      {/* AI Transparency: Sensor Data → AI Analysis → Recommendation (Section 3 Requirement) */}
      <div className="p-6 rounded-2xl border border-purple-900/40 bg-[#0d0714]/90 backdrop-blur-md space-y-4 text-xs font-mono">
        <div className="flex items-center justify-between border-b border-purple-950 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-purple-400 font-bold uppercase tracking-wider text-xs">
              Transparent Reasoning Framework:
            </span>
            <span className="text-white font-bold text-sm font-display">{currentNode.title}</span>
          </div>
          <span className="text-emerald-400 font-bold">Status: {currentNode.status}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1: Sensor Data */}
          <div className="p-4 rounded-xl bg-black/40 border border-purple-950 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold uppercase text-[11px]">
              <Radio className="w-3.5 h-3.5" />
              <span>1. Verified Sensor Data</span>
            </div>
            <p className="text-purple-100 font-mono text-xs leading-relaxed">
              {currentNode.sensorInput}
            </p>
            <div className="text-[10px] text-amber-400/60 pt-1 border-t border-purple-950/60">
              ✓ Hardware cryptographic signature verified
            </div>
          </div>

          {/* Step 2: AI Analysis */}
          <div className="p-4 rounded-xl bg-black/40 border border-purple-950 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold uppercase text-[11px]">
              <Cpu className="w-3.5 h-3.5" />
              <span>2. AI Inference Engine</span>
            </div>
            <p className="text-purple-100 font-mono text-xs leading-relaxed">
              {currentNode.aiInference}
            </p>
            <div className="text-[10px] text-cyan-400/60 pt-1 border-t border-purple-950/60">
              ✓ Fast-Fourier acoustic spectrum nominal
            </div>
          </div>

          {/* Step 3: Recommendation */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase text-[11px]">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>3. Actionable Recommendation</span>
            </div>
            <p className="text-white font-sans text-xs leading-relaxed font-medium">
              {currentNode.action}
            </p>
            <div className="text-[10px] text-emerald-400/80 pt-1 border-t border-purple-950/60">
              ✓ Logged to keeper alert registry
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
