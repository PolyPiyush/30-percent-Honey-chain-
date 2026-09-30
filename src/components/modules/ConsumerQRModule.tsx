/**
 * HoneyChain Consumer QR Experience — "THE HONEY PORTAL"
 * Physical-looking holographic QR Portal.
 * Triggering scan generates a golden ripple through the honeycomb,
 * reversing the journey backward: Consumer → Package → Batch → Processing → Hive → Origin.
 * Displays "VERIFIED HONEY — Authenticity Confirmed ✓".
 */

import React, { useState } from 'react';
import { useHive } from '../../context/HiveContext';
import { haptics, isVibrationSupported } from '../../utils/haptics';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Scan,
  Sparkles,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  RotateCcw,
  Smartphone,
  Radio,
} from 'lucide-react';

export const ConsumerQRModule: React.FC = () => {
  const { selectedBatchId, setSelectedBatchId, zoomIntoModule, batches, showToast } = useHive();
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(true);
  const [activeReverseStep, setActiveReverseStep] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentBatch = batches.find((b) => b.batchId === selectedBatchId) || batches[0];

  // The 6 reverse journey stages from Consumer back to Origin (Section 9 Requirement)
  const reverseJourney = [
    {
      step: 1,
      title: 'Consumer Scan',
      location: 'Mobile Device Intake Point',
      date: 'Live Interaction',
      detail: 'NFC/QR smart label decoded; cryptographic payload submitted for verification.',
      icon: '📱',
    },
    {
      step: 2,
      title: 'Packaging & Seal',
      location: 'Pristine Packaging Unit, Pune',
      date: '19 Sept 2026',
      detail: 'UV-shielded hexagonal jar sealed with tamper-proof micro-tag.',
      icon: '📦',
    },
    {
      step: 3,
      title: 'Batch Token #182906',
      location: 'Polygon Amoy Blockchain',
      date: '17 Sept 2026',
      detail: 'State transition certified; Merkle proof committed to block #182906.',
      icon: '🔗',
    },
    {
      step: 4,
      title: 'Cold Processing',
      location: 'Western Ghats Agro Park',
      date: '15 Sept 2026',
      detail: 'Cold extracted at 36.5°C; pollen analysis confirms 99.85% purity.',
      icon: '🏭',
    },
    {
      step: 5,
      title: 'Hive #MH-024',
      location: 'Sahyadri Organic Bee Sanctuary',
      date: '12 Sept 2026',
      detail: 'Super frames harvested at 90% sealed comb maturity by Rajesh Patil.',
      icon: '🐝',
    },
    {
      step: 6,
      title: 'Floral Origin',
      location: 'Mahabaleshwar Foothills, Maharashtra',
      date: 'Spring Bloom',
      detail: 'Wild mustard, Jamun blossom and bio-reserve floral foraging.',
      icon: '🌼',
    },
  ];

  const handleTriggerScan = () => {
    haptics.buttonClick();
    // Fire the expanding golden ripple vibration through the honeycomb structure
    haptics.verificationRipple();
    setIsScanning(true);
    setScanComplete(false);
    setActiveReverseStep(0);

    // Step-by-step reverse pathway animation with rhythmic tactile pulses
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step >= reverseJourney.length) {
        clearInterval(interval);
        setIsScanning(false);
        setScanComplete(true);
        // Multi-pulse confirmation on successful full origin provenance verification
        haptics.success();
        showToast('Reverse Honey Provenance Verified Back to Hive Origin!', 'success');
      } else {
        setActiveReverseStep(step);
        // Tactile step pulse as each stage of the reverse journey is unlocked
        haptics.stageAdvance(step);
      }
    }, 600);
  };

  const handleCopyLink = () => {
    haptics.tap();
    navigator.clipboard.writeText(`https://honeychain.network/verify/${currentBatch.batchId}`);
    setCopiedLink(true);
    showToast('Public verification link copied', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 h-[calc(100vh-80px)] overflow-y-auto space-y-6 relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-amber-900/50 bg-[#120a04]/90 backdrop-blur-md sticky top-0 z-30 shadow-lg">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-display flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            <span>THE HONEY PORTAL — Holographic QR Gateway</span>
          </h2>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Scanning creates a golden ripple reversing the journey from consumer back to the flower origin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              haptics.verificationRipple();
              showToast('Tactile vibration ripple triggered on device', 'info');
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/40 text-xs font-mono text-amber-300 transition-colors cursor-pointer"
            title="Trigger tactile vibration ripple via Vibration API"
          >
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Tactile Ripple</span>
          </button>

          <button
            onClick={handleTriggerScan}
            disabled={isScanning}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs font-mono rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Scan className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Unrolling Reverse Journey...' : 'Scan Smart QR Portal'}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-3 py-2 rounded-lg border border-amber-900/60 bg-black/40 text-xs font-mono text-amber-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>Share Link</span>
          </button>
        </div>
      </div>

      {/* Holographic QR Portal Stage (Section 9 Requirement) */}
      <div className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#180e05] via-[#0d0702] to-[#050201] overflow-hidden p-8 shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
        {/* Holographic QR Pattern Box with Ripple Waves */}
        <div className="relative w-56 h-56 rounded-2xl bg-black/80 border-2 border-amber-500/60 p-4 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)]">
          {/* Animated Golden Ripple Rings */}
          {isScanning && (
            <div className="absolute inset-0 rounded-2xl border-2 border-amber-400 animate-ping opacity-75" />
          )}

          {/* QR Code Matrix SVG */}
          <div className="relative w-full h-full p-2 bg-white rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950" fill="currentColor">
              {/* Corner Position Targets */}
              <rect x="5" y="5" width="25" height="25" fill="#000" />
              <rect x="9" y="9" width="17" height="17" fill="#fff" />
              <rect x="13" y="13" width="9" height="9" fill="#000" />

              <rect x="70" y="5" width="25" height="25" fill="#000" />
              <rect x="74" y="9" width="17" height="17" fill="#fff" />
              <rect x="78" y="13" width="9" height="9" fill="#000" />

              <rect x="5" y="70" width="25" height="25" fill="#000" />
              <rect x="9" y="74" width="17" height="17" fill="#fff" />
              <rect x="13" y="78" width="9" height="9" fill="#000" />

              {/* Data Matrix Bits */}
              <rect x="36" y="8" width="6" height="6" />
              <rect x="46" y="8" width="6" height="6" />
              <rect x="56" y="8" width="6" height="6" />
              <rect x="36" y="20" width="6" height="6" />
              <rect x="46" y="28" width="6" height="6" />
              <rect x="10" y="40" width="6" height="6" />
              <rect x="24" y="44" width="6" height="6" />
              <rect x="36" y="44" width="18" height="18" fill="#d97706" />
              <rect x="65" y="40" width="6" height="6" />
              <rect x="80" y="45" width="8" height="8" />
              <rect x="40" y="72" width="6" height="6" />
              <rect x="50" y="72" width="8" height="8" />
              <rect x="68" y="72" width="6" height="6" />
              <rect x="80" y="76" width="6" height="6" />
            </svg>

            {/* Glowing Scan Ray */}
            <div className={`absolute left-0 right-0 h-1 bg-amber-500 shadow-[0_0_15px_#f59e0b] ${isScanning ? 'animate-[bounce_1s_infinite]' : 'top-1/2'}`} />
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>VERIFIED HONEY · Authenticity Confirmed ✓</span>
          </div>

          <h3 className="text-2xl font-bold text-white font-display">
            {currentBatch.productName}
          </h3>
          <p className="text-xs font-mono text-amber-300/80">
            Batch ID: {currentBatch.batchId} · Origin: {currentBatch.origin}
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                setSelectedBatchId(currentBatch.batchId);
                zoomIntoModule('traceability');
                haptics.buttonClick();
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono inline-flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>EXPLORE JOURNEY ON 3D GLOBE</span>
            </button>
          </div>
        </div>
      </div>

      {/* The Reverse Pathway: Consumer → Package → Batch → Processing → Hive → Origin (Section 9 Requirement) */}
      <div className="p-6 rounded-2xl border border-amber-900/40 bg-[#120a04]/90 backdrop-blur-md space-y-4 text-xs font-mono">
        <div className="flex items-center justify-between border-b border-amber-950 pb-3">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-semibold text-white font-display">
              Reverse Provenance Pathway (Consumer Back to Comb)
            </h4>
          </div>
          <span className="text-emerald-400">Step {activeReverseStep + 1} of 6 Decoded</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {reverseJourney.map((rj, idx) => {
            const isHighlight = idx <= activeReverseStep;
            return (
              <div
                key={rj.step}
                onClick={() => {
                  setActiveReverseStep(idx);
                  haptics.tap();
                }}
                className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isHighlight
                    ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'border-amber-950/60 bg-black/40 opacity-50 hover:opacity-80'
                }`}
              >
                <div>
                  <div className="text-xl mb-2">{rj.icon}</div>
                  <div className="text-[10px] text-amber-400 font-bold mb-0.5">STAGE 0{rj.step}</div>
                  <h5 className="text-white font-semibold text-xs font-display">{rj.title}</h5>
                  <div className="text-[11px] text-amber-300/80 mt-1">{rj.location}</div>
                </div>

                <p className="text-[10px] text-amber-200/60 mt-3 pt-2 border-t border-amber-950 font-sans leading-tight">
                  {rj.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
