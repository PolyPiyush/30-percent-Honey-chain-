/**
 * Story Progress Controller for "The Digital Nervous System"
 * Controls the 8-step journey from physical hive to immutable blockchain:
 * 0–15% Digital Hive -> 15–30% Sensors -> 30–45% Convergence -> 45–55% IoT Gateway ->
 * 55–65% Backend API -> 65–80% Oracle Gate -> 80–90% Smart Contract -> 90–100% Blockchain Block.
 */

import React from 'react';
import { StoryStage } from './types';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Layers,
  ShieldCheck,
  FileCode,
  Link2,
  Radio,
  Server,
  RotateCcw,
} from 'lucide-react';
import { haptics } from '../../../utils/haptics';

interface StoryProgressControllerProps {
  stage: StoryStage;
  onSetStage: (stage: StoryStage) => void;
  scrollProgress: number; // 0 to 1
  onProgressChange: (val: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
}

interface StageStep {
  id: StoryStage;
  stepNum: number;
  label: string;
  rangeLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  minProgress: number;
  maxProgress: number;
}

const STAGES: StageStep[] = [
  {
    id: 'hive',
    stepNum: 1,
    label: 'Digital Hive Twin',
    rangeLabel: '0–15%',
    icon: Sparkles,
    minProgress: 0,
    maxProgress: 0.15,
  },
  {
    id: 'sensors',
    stepNum: 2,
    label: 'Sensory Organs',
    rangeLabel: '15–30%',
    icon: Layers,
    minProgress: 0.15,
    maxProgress: 0.3,
  },
  {
    id: 'convergence',
    stepNum: 3,
    label: 'Signal Convergence',
    rangeLabel: '30–45%',
    icon: Radio,
    minProgress: 0.3,
    maxProgress: 0.45,
  },
  {
    id: 'gateway',
    stepNum: 4,
    label: 'IoT Gateway Hub',
    rangeLabel: '45–55%',
    icon: Radio,
    minProgress: 0.45,
    maxProgress: 0.55,
  },
  {
    id: 'api',
    stepNum: 5,
    label: 'Backend API Highway',
    rangeLabel: '55–65%',
    icon: Server,
    minProgress: 0.55,
    maxProgress: 0.65,
  },
  {
    id: 'oracle',
    stepNum: 6,
    label: 'Oracle Hero Gate',
    rangeLabel: '65–80%',
    icon: ShieldCheck,
    minProgress: 0.65,
    maxProgress: 0.8,
  },
  {
    id: 'smart_contract',
    stepNum: 7,
    label: 'Smart Contract',
    rangeLabel: '80–90%',
    icon: FileCode,
    minProgress: 0.8,
    maxProgress: 0.9,
  },
  {
    id: 'blockchain',
    stepNum: 8,
    label: 'Blockchain Memory',
    rangeLabel: '90–100%',
    icon: Link2,
    minProgress: 0.9,
    maxProgress: 1.0,
  },
];

export const StoryProgressController: React.FC<StoryProgressControllerProps> = ({
  stage,
  onSetStage,
  scrollProgress,
  onProgressChange,
  isPlaying,
  onTogglePlay,
  onReset,
}) => {
  const currentStepIndex = STAGES.findIndex((s) => s.id === stage);

  const handlePrev = () => {
    haptics.buttonClick();
    if (stage === 'overview') {
      onSetStage('blockchain');
      onProgressChange(1.0);
      return;
    }
    const prevIdx = Math.max(0, currentStepIndex - 1);
    const target = STAGES[prevIdx];
    onSetStage(target.id);
    onProgressChange((target.minProgress + target.maxProgress) / 2);
  };

  const handleNext = () => {
    haptics.buttonClick();
    if (stage === 'overview') return;
    if (currentStepIndex === STAGES.length - 1) {
      onSetStage('overview');
      return;
    }
    const nextIdx = Math.min(STAGES.length - 1, currentStepIndex + 1);
    const target = STAGES[nextIdx];
    onSetStage(target.id);
    onProgressChange((target.minProgress + target.maxProgress) / 2);
  };

  return (
    <div className="w-full bg-[#0c0804]/90 backdrop-blur-md border border-amber-900/40 rounded-2xl p-4 shadow-xl flex flex-col gap-3 font-mono text-xs">
      {/* Top Bar with Stage Buttons */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 flex-nowrap">
          {STAGES.map((s) => {
            const isActive = stage === s.id;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => {
                  haptics.buttonClick();
                  onSetStage(s.id);
                  onProgressChange((s.minProgress + s.maxProgress) / 2);
                }}
                className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                    : 'bg-black/40 text-amber-200/70 border-amber-950 hover:bg-amber-950/40 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.stepNum}. {s.label}</span>
                <span className={`text-[9px] opacity-75 ${isActive ? 'text-slate-900' : 'text-amber-400/60'}`}>
                  {s.rangeLabel}
                </span>
              </button>
            );
          })}

          {/* Zoom-out Overview Button */}
          <button
            onClick={() => {
              haptics.buttonClick();
              onSetStage(stage === 'overview' ? 'blockchain' : 'overview');
            }}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              stage === 'overview'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-bold'
                : 'bg-cyan-950/30 text-cyan-200/80 border-cyan-800/40 hover:bg-cyan-900/40'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-300" />
            <span>Macro Overview</span>
          </button>
        </div>

        {/* Play / Reset Controls */}
        <div className="flex items-center gap-2 pl-2 border-l border-amber-950/80 shrink-0">
          <button
            onClick={() => {
              haptics.buttonClick();
              onTogglePlay();
            }}
            className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 cursor-pointer transition-all flex items-center gap-1 text-[11px] font-bold"
            title={isPlaying ? 'Pause Continuous Journey' : 'Play Continuous Journey'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play Tour'}</span>
          </button>

          <button
            onClick={() => {
              haptics.buttonClick();
              onReset();
            }}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-amber-950 text-amber-300/60 hover:text-white cursor-pointer transition-all"
            title="Reset to Stage 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrubber Slider & Prev/Next Step Bar */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={handlePrev}
          disabled={currentStepIndex <= 0 && stage !== 'overview'}
          className="p-1.5 rounded-lg border border-amber-950 bg-black/40 text-amber-200 hover:bg-amber-950/40 disabled:opacity-30 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={scrollProgress}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onProgressChange(val);
              // auto match stage
              const matched = STAGES.find((s) => val >= s.minProgress && val <= s.maxProgress);
              if (matched) onSetStage(matched.id);
            }}
            className="w-full accent-amber-500 bg-amber-950/50 h-1.5 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-amber-400/80 font-mono w-10 text-right">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={stage === 'overview'}
          className="p-1.5 rounded-lg border border-amber-950 bg-black/40 text-amber-200 hover:bg-amber-950/40 disabled:opacity-30 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
