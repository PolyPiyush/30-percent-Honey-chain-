/**
 * Follow Honey Cinematic Journey Controller
 * Orchestrates step-by-step physical batch traversal across the Earth with audio-tactile cues.
 */

import React, { useEffect } from 'react';
import { TraceabilityBatch, TraceabilityLocation } from './types';
import { Play, Pause, RotateCcw, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { haptics } from '../../../utils/haptics';

interface FollowHoneyControllerProps {
  batch: TraceabilityBatch;
  isFollowingHoney: boolean;
  onToggleFollow: () => void;
  activeFollowIndex: number;
  onSetFollowIndex: (idx: number) => void;
  onClose?: () => void;
}

export const FollowHoneyController: React.FC<FollowHoneyControllerProps> = ({
  batch,
  isFollowingHoney,
  onToggleFollow,
  activeFollowIndex,
  onSetFollowIndex,
}) => {
  const locations = batch.locations || [];
  const currentLocation = locations[activeFollowIndex] || locations[0];
  const isComplete = activeFollowIndex >= locations.length - 1;

  // Automated progression timer when following
  useEffect(() => {
    if (!isFollowingHoney) return;

    const timer = setInterval(() => {
      onSetFollowIndex(
        activeFollowIndex >= locations.length - 1 ? 0 : activeFollowIndex + 1
      );
      haptics.stageAdvance(activeFollowIndex);
    }, 4000);

    return () => clearInterval(timer);
  }, [isFollowingHoney, activeFollowIndex, locations.length, onSetFollowIndex]);

  return (
    <div className="p-4 rounded-3xl border border-amber-500/30 bg-[#0e0904]/90 backdrop-blur-xl shadow-2xl space-y-3 text-xs font-mono">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            FOLLOW HONEY JOURNEY MODE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onSetFollowIndex(0);
              haptics.buttonClick();
            }}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
            title="Restart Journey from Hive"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              onToggleFollow();
              haptics.buttonClick();
            }}
            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition-transform hover:scale-105"
          >
            {isFollowingHoney ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isFollowingHoney ? 'Pause Journey' : '▶ FOLLOW HONEY'}</span>
          </button>
        </div>
      </div>

      {/* Active Stage Callout Card */}
      {currentLocation && (
        <div className="p-3 rounded-2xl bg-black/60 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[10px] text-amber-400/80 font-bold uppercase">
              Current Node 0{activeFollowIndex + 1}/{locations.length}: {currentLocation.stageLabel}
            </span>
            <div className="text-white font-bold text-sm font-display flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{currentLocation.name}</span>
            </div>
            <p className="text-amber-200/60 text-[11px]">{currentLocation.locationName}</p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified ✓
            </span>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-center font-bold text-xs flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>HONEY JOURNEY COMPLETE — VERIFIED HIVE TO CONSUMER ✓</span>
        </div>
      )}
    </div>
  );
};
