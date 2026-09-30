/**
 * HoneyChain SIH Live Demo Controller Banner
 * Orchestrates automated traversal of the 9 ecosystem stages for evaluators
 */

import React from 'react';
import { useHive, LIVE_DEMO_STEPS } from '../../context/HiveContext';
import { haptics } from '../../utils/haptics';
import { Play, Pause, FastForward, Sparkles, CheckCircle2 } from 'lucide-react';

export const LiveDemoController: React.FC = () => {
  const {
    isLiveDemoRunning,
    toggleLiveDemo,
    liveDemoStep,
    setLiveDemoStep,
    zoomIntoModule,
    viewMode,
  } = useHive();

  if (viewMode === 'outside' || viewMode === 'entering') return null;

  const currentStepInfo = LIVE_DEMO_STEPS.find((s) => s.step === liveDemoStep) || LIVE_DEMO_STEPS[0];

  const handleNextStep = () => {
    haptics.buttonClick();
    const next = liveDemoStep >= LIVE_DEMO_STEPS.length ? 1 : liveDemoStep + 1;
    setLiveDemoStep(next);
    const target = LIVE_DEMO_STEPS.find((s) => s.step === next);
    if (target) zoomIntoModule(target.moduleTarget);
  };

  return (
    <div className="fixed top-18 right-6 z-40 max-w-sm">
      <div className="rounded-xl border border-amber-500/50 bg-[#160d05]/95 backdrop-blur-md p-3.5 shadow-[0_4px_25px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.2)] text-xs font-mono space-y-2">
        {/* Top Title & Play/Pause */}
        <div className="flex items-center justify-between gap-2 border-b border-amber-950 pb-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>SIH Live Demo Engine</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleLiveDemo}
              className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                isLiveDemoRunning
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-amber-950/60 text-amber-300 border border-amber-800 hover:bg-amber-900/60'
              }`}
            >
              {isLiveDemoRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isLiveDemoRunning ? 'Pause' : 'Start Demo'}</span>
            </button>

            {isLiveDemoRunning && (
              <button
                onClick={handleNextStep}
                className="p-1 rounded text-amber-400 hover:text-white hover:bg-amber-950 cursor-pointer"
                title="Skip to Next Step"
              >
                <FastForward className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Current Step Progress */}
        <div>
          <div className="flex items-center justify-between text-[10px] text-amber-400/80 mb-1">
            <span className="font-semibold text-white truncate max-w-[200px]">
              {currentStepInfo.title}
            </span>
            <span>{currentStepInfo.step} / {LIVE_DEMO_STEPS.length}</span>
          </div>

          <div className="w-full h-1 bg-black/60 rounded-full overflow-hidden border border-amber-950 mb-2">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStepInfo.step / LIVE_DEMO_STEPS.length) * 100}%` }}
            />
          </div>

          <p className="text-[11px] text-amber-200/80 font-sans leading-tight">
            {currentStepInfo.description}
          </p>
        </div>
      </div>
    </div>
  );
};
