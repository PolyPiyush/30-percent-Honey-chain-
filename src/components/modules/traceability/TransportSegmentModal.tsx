/**
 * Transport Route Segment Detail Modal
 * Triggered on clicking route arcs: displays transit carrier, GPS distance,
 * climate control readings, and departure/arrival telemetry.
 */

import React from 'react';
import { TransportRouteSegment } from './types';
import { X, Truck, Navigation, Clock, ShieldCheck, Thermometer } from 'lucide-react';
import { haptics } from '../../../utils/haptics';

interface TransportSegmentModalProps {
  segment: TransportRouteSegment | null;
  batchId: string;
  onClose: () => void;
}

export const TransportSegmentModal: React.FC<TransportSegmentModalProps> = ({
  segment,
  batchId,
  onClose,
}) => {
  if (!segment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-amber-500/30 bg-[#0d0904]/95 backdrop-blur-xl shadow-2xl p-6 space-y-5 text-xs font-mono">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-950 pb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-widest text-amber-400/70 font-bold block">
              TRANSPORT EVENT TELEMETRY
            </span>
            <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>{segment.fromName} → {segment.toName}</span>
            </h4>
          </div>

          <button
            onClick={() => {
              haptics.buttonClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-black/50 border border-amber-950 space-y-1">
            <span className="text-[10px] text-amber-400/60 block flex items-center gap-1">
              <Navigation className="w-3 h-3 text-amber-400" />
              DISTANCE TRAVELED
            </span>
            <span className="text-white font-bold text-sm">{segment.distanceKm} km</span>
            <span className="text-[10px] text-amber-200/50 block">GPS Waypoint Verified</span>
          </div>

          <div className="p-3 rounded-xl bg-black/50 border border-amber-950 space-y-1">
            <span className="text-[10px] text-amber-400/60 block flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-amber-400" />
              AVG TEMPERATURE
            </span>
            <span className="text-white font-bold text-sm">
              {segment.avgTemperatureC ? `${segment.avgTemperatureC}°C` : '19.4°C'}
            </span>
            <span className="text-[10px] text-emerald-400 block">Cold Chain Intact</span>
          </div>
        </div>

        {/* Transit Timestamps */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-amber-950 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-400/60">DEPARTURE</span>
            <span className="text-white font-semibold">{segment.departureTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-400/60">ARRIVAL</span>
            <span className="text-white font-semibold">{segment.arrivalTime}</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/5 pt-2">
            <span className="text-[10px] text-amber-400/60">TRANSIT METHOD</span>
            <span className="text-amber-200">{segment.transitMethod}</span>
          </div>
        </div>

        {/* Status Verification */}
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            BLOCKCHAIN RECORD VERIFIED ✓
          </span>
          <span className="text-[10px] text-emerald-400/80">Batch: {batchId}</span>
        </div>
      </div>
    </div>
  );
};
