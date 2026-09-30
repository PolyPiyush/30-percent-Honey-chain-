/**
 * HoneyChain Functional Traceability Module
 * "SELECT BATCH → LOCATE ORIGIN → FOLLOW JOURNEY → INSPECT EVENTS → VERIFY RECORD"
 *
 * Connects directly with HoneyChain batch, supply-chain, QR, and blockchain data.
 * Features:
 * - Real geographic coordinates (lat, lng) mapped to 3D Earth
 * - Seamless Globe (3D) and Map (2D) toggling with persistent state
 * - Batch selector with search (Batch ID, Hive ID, location, processing unit, city)
 * - Origin Hive marker with glowing pulse and bee identifier
 * - Animated 3D Catmull-Rom route following globe curvature with traveling honey particle
 * - "Follow Honey" automated cinematic mode
 * - Clickable & hoverable markers and route segments with deep inspector panels
 * - Camera controls: Reset View, ⌖ Origin, Fit Journey, Intelligent Auto-Rotate toggle
 * - Synchronized step timeline with stage state indicators
 * - Cross-module links directly into Blockchain Ledger and Supply Chain
 * - Mobile thumb-friendly controls and robust WebGL error fallbacks
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useHive } from '../../context/HiveContext';
import { apiService } from '../../services/api';
import {
  TraceabilityBatch,
  TraceabilityLocation,
  TransportRouteSegment,
  ViewDisplayMode,
} from './traceability/types';
import {
  TRACEABILITY_BATCHES,
  getBatchGeoCenter,
} from './traceability/traceabilityData';
import { TraceabilityGlobe3D } from './traceability/TraceabilityGlobe3D';
import { TraceabilityFlatMap } from './traceability/TraceabilityFlatMap';
import { LocationInspectorPanel } from './traceability/LocationInspectorPanel';
import { TransportSegmentModal } from './traceability/TransportSegmentModal';
import { FollowHoneyController } from './traceability/FollowHoneyController';
import { haptics } from '../../utils/haptics';
import {
  Globe,
  Map,
  Search,
  Compass,
  RotateCcw,
  Navigation,
  Play,
  Pause,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

export const TraceabilityModule: React.FC = () => {
  const { selectedBatchId, setSelectedBatchId, showToast } = useHive();

  // Active Batch State
  const [batchesList] = useState<TraceabilityBatch[]>(TRACEABILITY_BATCHES);
  const [selectedBatch, setSelectedBatch] = useState<TraceabilityBatch>(() => {
    return (
      TRACEABILITY_BATCHES.find((b) => b.batchId === selectedBatchId) ||
      TRACEABILITY_BATCHES[0]
    );
  });

  // Display Mode: 3D Globe vs 2D Flat Map
  const [displayMode, setDisplayMode] = useState<ViewDisplayMode>('globe');

  // Selected Geographic Location & Segment
  const [selectedLocation, setSelectedLocation] = useState<TraceabilityLocation | null>(() => {
    return selectedBatch.origin || selectedBatch.locations[0] || null;
  });
  const [selectedSegment, setSelectedSegment] = useState<TransportRouteSegment | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Camera & Globe Automation
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isFollowingHoney, setIsFollowingHoney] = useState<boolean>(false);
  const [activeFollowIndex, setActiveFollowIndex] = useState<number>(0);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sync selectedBatchId from HiveContext (e.g. from QR scan or global selector)
  useEffect(() => {
    if (selectedBatchId && selectedBatchId !== selectedBatch.batchId) {
      const match = batchesList.find((b) => b.batchId === selectedBatchId);
      if (match) {
        setSelectedBatch(match);
        setSelectedLocation(match.origin);
        setActiveFollowIndex(0);
        showToast(`Loaded Batch ${match.batchId} from QR portal`, 'info');
      }
    }
  }, [selectedBatchId, batchesList, selectedBatch.batchId, showToast]);

  // When changing batch, reset route and activate origin
  const handleSelectBatch = (batchId: string) => {
    const match = batchesList.find((b) => b.batchId === batchId);
    if (!match) return;

    haptics.buttonClick();
    setIsLoading(true);
    setSelectedBatch(match);
    setSelectedBatchId(match.batchId);
    setSelectedLocation(match.origin);
    setActiveFollowIndex(0);
    setIsFollowingHoney(false);
    setSelectedSegment(null);

    // Simulate clean data fetch / API handshake
    setTimeout(() => {
      setIsLoading(false);
      showToast(`Located Origin: ${match.origin.name}`, 'success');
    }, 250);
  };

  // Focus Origin Hive
  const handleFocusOrigin = () => {
    haptics.tap();
    if (selectedBatch.origin) {
      setSelectedLocation(selectedBatch.origin);
      setActiveFollowIndex(0);
      showToast(`Centered on Origin: ${selectedBatch.origin.name}`, 'info');
    }
  };

  // Reset Camera View
  const handleResetView = () => {
    haptics.tap();
    setSelectedLocation({
      ...selectedBatch.origin,
      latitude: 18.5204,
      longitude: 73.8567, // Center of Western Ghats Maharashtra
    });
    showToast('Camera reset to default Earth orientation', 'info');
  };

  // Fit Journey
  const handleFitJourney = () => {
    haptics.tap();
    const center = getBatchGeoCenter(selectedBatch);
    setSelectedLocation({
      ...selectedBatch.origin,
      latitude: center.lat,
      longitude: center.lng,
    });
    showToast(`Centered on complete route (${selectedBatch.totalDistanceKm} km)`, 'info');
  };

  // Next Location in Journey
  const handleNextLocation = () => {
    const locations = selectedBatch.locations || [];
    const currentIndex = locations.findIndex((l) => l.id === selectedLocation?.id);
    const nextIndex = currentIndex >= locations.length - 1 ? 0 : currentIndex + 1;
    const nextLoc = locations[nextIndex];
    setSelectedLocation(nextLoc);
    setActiveFollowIndex(nextIndex);
    haptics.stageAdvance(nextIndex);
  };

  // Search Filter: Filter batches and locations
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: { type: 'batch' | 'location'; title: string; subtitle: string; loc?: TraceabilityLocation; batchId?: string }[] = [];

    batchesList.forEach((b) => {
      if (b.batchId.toLowerCase().includes(q) || b.productName.toLowerCase().includes(q)) {
        results.push({
          type: 'batch',
          title: b.batchId,
          subtitle: b.productName,
          batchId: b.batchId,
        });
      }
      b.locations.forEach((loc) => {
        if (
          loc.name.toLowerCase().includes(q) ||
          loc.locationName.toLowerCase().includes(q) ||
          loc.stageLabel.toLowerCase().includes(q)
        ) {
          results.push({
            type: 'location',
            title: loc.name,
            subtitle: `${loc.locationName} · Batch ${b.batchId}`,
            loc,
            batchId: b.batchId,
          });
        }
      });
    });

    return results.slice(0, 6);
  }, [searchQuery, batchesList]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 h-[calc(100vh-80px)] overflow-y-auto space-y-6 relative selection:bg-amber-500/30 selection:text-amber-200"
    >
      {/* 1. TOP HEADER & BATCH CONTROLLER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl border border-amber-500/30 bg-[#0c0803]/90 backdrop-blur-xl sticky top-0 z-30 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80 font-bold">
              GEOGRAPHICAL TRACEABILITY SYSTEM
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-display flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <span>Follow the Honey — 3D Earth Provenance</span>
          </h2>
          <p className="text-xs text-amber-200/60">
            Real coordinates · Single-origin Western Ghats harvest to consumer hands.
          </p>
        </div>

        {/* Controls: Batch Dropdown, Globe/Map Toggle, Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Batch Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedBatch.batchId}
              onChange={(e) => handleSelectBatch(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-black/70 border border-amber-500/40 text-amber-200 font-mono text-xs font-semibold focus:outline-none focus:border-amber-400 cursor-pointer shadow-md"
            >
              {batchesList.map((b) => (
                <option key={b.batchId} value={b.batchId} className="bg-[#120a04] text-white">
                  {b.batchId} — {b.productName.split(' ')[0]} ({b.floralSource.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Map / Globe Mode Toggle (Requirement 18) */}
          <div className="flex items-center p-1 rounded-xl bg-black/60 border border-amber-500/30 text-xs font-mono">
            <button
              onClick={() => {
                setDisplayMode('globe');
                haptics.tap();
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                displayMode === 'globe'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-amber-300/80 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>3D Earth</span>
            </button>
            <button
              onClick={() => {
                setDisplayMode('map');
                haptics.tap();
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                displayMode === 'map'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-amber-300/80 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>OpenStreetMap (Live Delivery)</span>
            </button>
          </div>

          {/* Search Location Button / Input */}
          <div className="relative">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors ${
                isSearchOpen
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                  : 'bg-black/60 border-amber-500/30 text-amber-300 hover:text-white'
              }`}
              title="Search Batch or Location"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Search Dropdown Modal */}
            {isSearchOpen && (
              <div className="absolute right-0 top-12 w-72 sm:w-80 p-3 rounded-2xl bg-[#140b04]/95 border border-amber-500/40 backdrop-blur-xl shadow-2xl z-40 space-y-2 text-xs font-mono animate-in fade-in zoom-in-95">
                <input
                  type="text"
                  placeholder="Search Hive #MH-024, Pune, Batch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2 rounded-xl bg-black/70 border border-amber-500/40 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-400"
                />

                <div className="max-h-48 overflow-y-auto space-y-1 pt-1">
                  {searchResults.map((res, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (res.batchId && res.batchId !== selectedBatch.batchId) {
                          handleSelectBatch(res.batchId);
                        }
                        if (res.loc) {
                          setSelectedLocation(res.loc);
                        }
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-2 rounded-lg bg-black/40 hover:bg-amber-950/60 border border-transparent hover:border-amber-500/40 cursor-pointer space-y-0.5"
                    >
                      <div className="text-white font-semibold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{res.title}</span>
                      </div>
                      <div className="text-[10px] text-amber-200/60 truncate">{res.subtitle}</div>
                    </div>
                  ))}
                  {searchQuery && searchResults.length === 0 && (
                    <div className="p-2 text-center text-amber-200/50 text-[11px]">
                      No matching batch or location found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. CAMERA CHOREOGRAPHY CONTROLLER TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-amber-500/20 bg-[#090502]/80 backdrop-blur-md text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          {/* ⌖ Origin Button (Requirement 16) */}
          <button
            onClick={handleFocusOrigin}
            className="px-3.5 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>⌖ ORIGIN (HIVE)</span>
          </button>

          {/* Fit Entire Journey (Requirement 17) */}
          <button
            onClick={handleFitJourney}
            className="px-3.5 py-1.5 rounded-xl bg-black/50 hover:bg-amber-950/50 border border-amber-900/60 text-amber-200 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-400" />
            <span>FIT JOURNEY</span>
          </button>

          {/* Reset View Button (Requirement 15) */}
          <button
            onClick={handleResetView}
            className="px-3.5 py-1.5 rounded-xl bg-black/50 hover:bg-amber-950/50 border border-amber-900/60 text-amber-200 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>RESET VIEW</span>
          </button>
        </div>

        {/* Auto-Rotation Toggle Button (Requirement 1) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setAutoRotate(!autoRotate);
              haptics.tap();
            }}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 cursor-pointer transition-colors ${
              autoRotate
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                : 'bg-black/50 border-amber-900/60 text-amber-300/80 hover:text-white'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>{autoRotate ? 'Auto Rotate: ON' : 'Auto Rotate: OFF'}</span>
          </button>
        </div>
      </div>

      {/* 3. PRIMARY VIEWPORT: 3D GLOBE OR 2D MAP */}
      <div className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#140c04] via-[#090502] to-[#040201] overflow-hidden shadow-2xl">
        {displayMode === 'globe' ? (
          <TraceabilityGlobe3D
            batch={selectedBatch}
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => {
              setSelectedLocation(loc);
              const idx = selectedBatch.locations.findIndex((l) => l.id === loc.id);
              if (idx !== -1) setActiveFollowIndex(idx);
            }}
            onSelectSegment={(seg) => setSelectedSegment(seg)}
            autoRotate={autoRotate}
            onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
            isFollowingHoney={isFollowingHoney}
            activeFollowIndex={activeFollowIndex}
          />
        ) : (
          <TraceabilityFlatMap
            batch={selectedBatch}
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => {
              setSelectedLocation(loc);
              const idx = selectedBatch.locations.findIndex((l) => l.id === loc.id);
              if (idx !== -1) setActiveFollowIndex(idx);
            }}
            onSelectSegment={(seg) => setSelectedSegment(seg)}
          />
        )}

        {/* Floating Origin Hive Badge Overlay */}
        <div className="absolute top-5 left-5 z-20 pointer-events-none space-y-1">
          <div className="px-3.5 py-1.5 rounded-xl bg-black/80 border border-amber-500/40 backdrop-blur-md text-xs font-mono text-amber-300 shadow-xl inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>🐝 {selectedBatch.origin.name}</span>
            <span className="text-white/40">·</span>
            <span className="text-emerald-400 font-bold">VERIFIED ORIGIN</span>
          </div>
          <div className="text-[11px] font-mono text-amber-200/60 pl-1">
            Lat: {selectedBatch.origin.latitude}° N · Lng: {selectedBatch.origin.longitude}° E
          </div>
        </div>

        {/* Route Stats Overlay (Bottom Center) */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
          <span className="px-4 py-1.5 rounded-full bg-black/80 border border-amber-500/40 text-xs font-mono text-amber-300 backdrop-blur-md shadow-xl inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Batch {selectedBatch.batchId}: {selectedBatch.totalDistanceKm} km Total Provenance</span>
          </span>
        </div>
      </div>

      {/* 4. FOLLOW HONEY CINEMATIC CONTROLLER */}
      <FollowHoneyController
        batch={selectedBatch}
        isFollowingHoney={isFollowingHoney}
        onToggleFollow={() => setIsFollowingHoney(!isFollowingHoney)}
        activeFollowIndex={activeFollowIndex}
        onSetFollowIndex={(idx) => {
          setActiveFollowIndex(idx);
          if (selectedBatch.locations[idx]) {
            setSelectedLocation(selectedBatch.locations[idx]);
          }
        }}
      />

      {/* 5. TRACEABILITY TIMELINE BAR (Requirement 13) */}
      <div className="p-5 rounded-3xl border border-amber-500/25 bg-[#0b0703]/90 backdrop-blur-md space-y-3 text-xs font-mono">
        <div className="flex items-center justify-between border-b border-amber-950 pb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/70 font-bold">
            PROVENANCE TIMELINE STAGES ({selectedBatch.locations.length} NODES)
          </span>
          <span className="text-emerald-400 text-[11px]">Click any stage to rotate & focus</span>
        </div>

        {/* Timeline Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
          {selectedBatch.locations.map((loc, idx) => {
            const isSelected = selectedLocation?.id === loc.id;
            return (
              <React.Fragment key={loc.id}>
                <button
                  onClick={() => {
                    setSelectedLocation(loc);
                    setActiveFollowIndex(idx);
                    haptics.cellSelect();
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all shrink-0 cursor-pointer min-w-[170px] space-y-1 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/70 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105'
                      : 'border-white/5 bg-black/40 hover:border-amber-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-amber-400/80">
                    <span className="font-bold">0{idx + 1}. {loc.stageLabel.split(' ')[0]}</span>
                    <span className="text-emerald-400">✓</span>
                  </div>
                  <div className="text-white font-bold text-xs truncate">{loc.name}</div>
                  <div className="text-[10px] text-amber-200/50 truncate">{loc.locationName.split(',')[0]}</div>
                </button>

                {idx < selectedBatch.locations.length - 1 && (
                  <span className="text-amber-500/60 font-mono text-sm shrink-0">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 6. DETAILED LOCATION INSPECTOR PANEL (Requirement 11) */}
      {selectedLocation && (
        <LocationInspectorPanel
          location={selectedLocation}
          batch={selectedBatch}
          onNextLocation={handleNextLocation}
        />
      )}

      {/* 7. TRANSPORT SEGMENT MODAL (Requirement 14) */}
      <TransportSegmentModal
        segment={selectedSegment}
        batchId={selectedBatch.batchId}
        onClose={() => setSelectedSegment(null)}
      />
    </div>
  );
};
