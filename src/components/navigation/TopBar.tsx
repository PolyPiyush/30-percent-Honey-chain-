/**
 * HoneyChain Top Navigation Bar
 * Follows strict 3-zone contract from Frontend Design Constitution:
 * [Brand wordmark] — [Clean navigation links] — [Primary action & Exit Hive]
 */

import React, { useState } from 'react';
import { useHive, HiveModule } from '../../context/HiveContext';
import { BeeGraphic } from '../common/BeeGraphic';
import { haptics, isVibrationSupported, getHapticsEnabled, setHapticsEnabled } from '../../utils/haptics';
import { ArrowLeft, BookOpen, Bell, Activity, Sparkles, Smartphone, Vibrate } from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    activeModule,
    zoomIntoModule,
    viewMode,
    exitToDashboard,
    exitToOutside,
    currentUser,
    selectedRole,
    setApiDocsOpen,
    unreadAlertsCount,
    toggleLiveSimulation,
    isLiveSimulationActive,
    isLiveDemoRunning,
    toggleLiveDemo,
    showToast,
  } = useHive();

  const [hapticState, setHapticState] = useState(getHapticsEnabled());

  const handleToggleHaptics = () => {
    const nextState = !hapticState;
    setHapticsEnabled(nextState);
    setHapticState(nextState);
    if (nextState) {
      haptics.buttonClick();
      showToast('Tactile Haptic Feedback Enabled (Vibration API)', 'success');
    } else {
      showToast('Tactile Haptic Feedback Muted', 'info');
    }
  };

  const navLinks: { id: HiveModule; label: string }[] = [
    { id: 'traceability', label: '3D Globe' },
    { id: 'monitoring', label: 'Hive IoT' },
    { id: 'blockchain', label: '3D Block' },
    { id: 'ai_intelligence', label: 'AI Bee' },
    { id: 'supply_chain', label: 'Living Chain' },
    { id: 'oracle_pipeline', label: 'Data River' },
    { id: 'qr_consumer', label: 'QR Portal' },
    { id: 'system_overview', label: 'Whole Hive' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d0703]/90 backdrop-blur-md border-b border-amber-950/60 px-4 md:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={exitToDashboard}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            title="Return to Honeycomb Grid"
          >
            <BeeGraphic size={28} glow={false} />
            <span className="text-lg font-bold tracking-tight text-white font-display group-hover:text-amber-400 transition-colors">
              HONEYCHAIN
            </span>
          </button>

          {viewMode === 'module' && (
            <button
              onClick={exitToDashboard}
              className="hidden sm:flex items-center gap-1 text-xs font-mono text-amber-300/80 hover:text-amber-200 transition-colors pl-2 border-l border-amber-900/60 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Hive Grid</span>
            </button>
          )}
        </div>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-amber-200/70">
          {navLinks.map((link) => {
            const isActive = viewMode === 'module' && activeModule === link.id;
            return (
              <button
                key={link.id}
                onClick={() => zoomIntoModule(link.id)}
                className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive ? 'text-amber-300 font-semibold' : 'hover:text-amber-100'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Live Demo Toggle */}
          <button
            onClick={toggleLiveDemo}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all cursor-pointer border ${
              isLiveDemoRunning
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-amber-950/40 text-amber-300 border-amber-800 hover:bg-amber-900/60'
            }`}
            title="Automated SIH Live Demo across all 9 stages"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isLiveDemoRunning ? 'animate-spin text-slate-950' : 'text-amber-400'}`} />
            <span>{isLiveDemoRunning ? 'Demo Running' : 'Live Demo'}</span>
          </button>

          {/* Live Sensor Stream indicator toggle */}
          <button
            onClick={toggleLiveSimulation}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer border ${
              isLiveSimulationActive
                ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                : 'bg-black/30 text-amber-400/40 border-amber-950'
            }`}
            title="Toggle Live IoT Simulation"
          >
            <Activity className={`w-3.5 h-3.5 ${isLiveSimulationActive ? 'text-emerald-400 animate-pulse' : 'text-amber-500/40'}`} />
            <span>{isLiveSimulationActive ? 'IoT Live' : 'IoT Paused'}</span>
          </button>

          {/* Tactile Haptic Vibration Toggle / Test Button */}
          <button
            onClick={handleToggleHaptics}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer border ${
              hapticState
                ? 'bg-amber-950/40 text-amber-300 border-amber-800/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'bg-black/30 text-amber-500/40 border-amber-950'
            }`}
            title={`Vibration API: ${hapticState ? 'Active' : 'Muted'} (Click to toggle/test)`}
          >
            <Smartphone className={`w-3.5 h-3.5 ${hapticState ? 'text-amber-400' : 'text-amber-500/40'}`} />
            <span className="hidden sm:inline">{hapticState ? 'Haptics ON' : 'Haptics OFF'}</span>
          </button>

          {/* API Specs button */}
          <button
            onClick={() => {
              haptics.buttonClick();
              setApiDocsOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-amber-200/90 bg-amber-950/30 hover:bg-amber-950/60 rounded border border-amber-900/50 hover:border-amber-700/60 transition-colors cursor-pointer"
            title="Inspect REST API & Architecture Documentation"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">REST Docs</span>
          </button>

          {/* User Role & Exit Hive */}
          <button
            onClick={exitToOutside}
            className="px-3 py-1.5 text-xs font-medium text-slate-950 bg-amber-500 hover:bg-amber-400 rounded transition-colors whitespace-nowrap cursor-pointer shadow-sm"
            title="Return to Outside World"
          >
            <span>Exit Hive</span>
          </button>
        </div>
      </div>
    </header>
  );
};
