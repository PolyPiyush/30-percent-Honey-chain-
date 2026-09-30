/**
 * HoneyChain Landing Experience — "Enter the Hive"
 * Fullscreen cinematic environment, glowing honeycomb matrix, and interactive flying honey bee
 */

import React, { useState, useEffect, useRef } from 'react';
import { useHive } from '../../context/HiveContext';
import { HoneycombCanvas } from '../common/HoneycombCanvas';
import { BeeGraphic } from '../common/BeeGraphic';
import { haptics } from '../../utils/haptics';
import { ArrowDown, Compass, ShieldCheck, Sparkles, ChevronUp } from 'lucide-react';

export const LandingExperience: React.FC = () => {
  const { enterHive, loginAsDemo } = useHive();
  const [approachProgress, setApproachProgress] = useState(0); // 0 (far) to 1 (at entrance)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mouse move parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Wheel scroll to advance progress
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setApproachProgress((prev) => {
        const delta = e.deltaY > 0 ? 0.05 : -0.05;
        const next = Math.min(1, Math.max(0, prev + delta));
        if (next >= 0.98) {
          setTimeout(() => enterHive(), 250);
        }
        return next;
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) container.removeEventListener('wheel', handleWheel);
    };
  }, [enterHive]);

  // Touch swipe support for mobile
  const lastHapticMilestone = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    haptics.tap();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const diff = touchStartY - currentY;
    if (diff > 20) {
      // Swiping up
      const progressDelta = Math.min(1, diff / 250);
      setApproachProgress((prev) => {
        const next = Math.min(1, Math.max(0, prev + progressDelta * 0.08));

        // Milestone tactile clicks at 25%, 50%, 75%
        const currentMilestone = Math.floor(next * 4);
        if (currentMilestone > lastHapticMilestone.current) {
          lastHapticMilestone.current = currentMilestone;
          haptics.light();
        }

        if (next >= 0.95) {
          haptics.heavy();
          setTimeout(() => enterHive(), 200);
        }
        return next;
      });
    }
  };

  // Compute bee position: starts outside bottom right, flies smoothly to center honeycomb cell
  const startBeeX = 85 + (mousePos.x - 0.5) * 8;
  const startBeeY = 82 + (mousePos.y - 0.5) * 8;
  const targetBeeX = 50;
  const targetBeeY = 48;

  const currentBeeX = startBeeX + (targetBeeX - startBeeX) * approachProgress;
  const currentBeeY = startBeeY + (targetBeeY - startBeeY) * approachProgress;
  const beeScale = 0.9 + approachProgress * 1.4;
  const beeRotation = (1 - approachProgress) * -22 + (mousePos.x - 0.5) * 12;

  // Honeycomb scale: expands from 1.0 to 2.4 as we approach
  const honeycombScale = 1 + approachProgress * 1.5;
  const honeycombOpacity = Math.max(0.2, 1 - approachProgress * 0.4);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="relative w-screen h-screen overflow-hidden bg-[#070402] text-[#fef3c7] select-none cursor-default"
    >
      {/* Background Interactive Honeycomb Matrix */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `scale(${honeycombScale}) translate(${(mousePos.x - 0.5) * -15}px, ${(mousePos.y - 0.5) * -15}px)`,
          opacity: honeycombOpacity,
        }}
      >
        <HoneycombCanvas intensity={1.2} mousePos={mousePos} />
      </div>

      {/* Center Glowing Entrance Hexagon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="relative transition-all duration-300"
          style={{
            transform: `scale(${1 + approachProgress * 2.2})`,
          }}
        >
          {/* Outer glowing pulsing ring */}
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-amber-500/30 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30" />
          <div className="absolute inset-0 w-64 h-64 md:w-80 md:h-80 rounded-full bg-radial from-amber-500/20 via-amber-700/10 to-transparent blur-2xl" />

          {/* Golden Honeycomb Central Cell SVG */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-48 h-48 md:w-60 md:h-60 filter drop-shadow-[0_0_35px_rgba(245,158,11,0.55)]"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon
                points="50 4, 93 27, 93 73, 50 96, 7 73, 7 27"
                fill="rgba(245, 158, 11, 0.08)"
                stroke="#fbbf24"
                strokeWidth="1.6"
              />
              <polygon
                points="50 14, 84 32, 84 68, 50 86, 16 68, 16 32"
                fill="rgba(217, 119, 6, 0.12)"
                stroke="#f59e0b"
                strokeWidth="0.8"
                strokeDasharray="3 3"
              />
              <circle cx="50" cy="50" r="14" fill="rgba(251, 191, 36, 0.2)" />
              <circle cx="50" cy="50" r="6" fill="#f59e0b" />
            </svg>
          </div>
        </div>
      </div>

      {/* The Animated Honey Bee (Enters from bottom-right, flies to center entrance) */}
      <div
        className="absolute z-20 pointer-events-none transition-all duration-150 ease-out will-change-transform"
        style={{
          left: `${currentBeeX}%`,
          top: `${currentBeeY}%`,
          transform: `translate(-50%, -50%) scale(${beeScale}) rotate(${beeRotation}deg)`,
        }}
      >
        <BeeGraphic size={64} glow={true} />
        {/* Subtle glowing trail */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-400/30 blur-sm animate-ping" />
      </div>

      {/* Atmospheric Top Bar Trust Markers (Natural + Technological) */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs uppercase font-mono tracking-widest text-amber-300/80">
            Polygon Amoy · IoT Telemetry Active
          </span>
        </div>

        <button
          onClick={() => loginAsDemo('BEEKEEPER')}
          className="text-xs uppercase font-mono tracking-wider text-amber-200/70 hover:text-amber-300 transition-colors flex items-center gap-1.5 py-1.5 px-3 rounded border border-amber-500/20 hover:border-amber-500/40 bg-black/40 backdrop-blur-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Demo Access</span>
        </button>
      </header>

      {/* Minimal Cinematic Center Introduction */}
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-between py-16 px-6 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: Math.max(0, 1 - approachProgress * 1.8),
        }}
      >
        <div className="mt-8 text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.25em] uppercase text-amber-400/90 mb-3">
            <span>Decentralized Beekeeping & Traceability</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-[0_2px_20px_rgba(245,158,11,0.35)] font-display">
            HONEYCHAIN
          </h1>

          <p className="text-base sm:text-xl text-amber-100/80 font-light max-w-xl mx-auto leading-relaxed text-balance">
            From Hive to Consumer — Every Drop Has a Story.
          </p>
        </div>

        {/* Interactive Gesture Affordance */}
        <div className="pointer-events-auto flex flex-col items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                haptics.buttonClick();
                setApproachProgress(1);
                setTimeout(() => enterHive(), 250);
              }}
              className="group relative px-6 py-3 rounded-lg overflow-hidden border border-amber-500/40 bg-gradient-to-r from-amber-600/30 to-amber-500/20 hover:from-amber-500/40 hover:to-amber-400/30 text-amber-100 font-medium text-sm tracking-wide transition-all duration-200 shadow-[0_4px_25px_rgba(245,158,11,0.25)] hover:shadow-[0_4px_35px_rgba(245,158,11,0.45)] cursor-pointer"
            >
              <div className="flex items-center gap-2 relative z-10">
                <Compass className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                <span>Enter the Hive</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-300/60 font-mono tracking-wide animate-bounce">
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Scroll or swipe up to approach hive entrance</span>
          </div>

          {/* Progress Bar */}
          <div className="w-48 h-1 bg-amber-950/80 rounded-full overflow-hidden border border-amber-900/40">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-150 rounded-full"
              style={{ width: `${Math.max(5, approachProgress * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
