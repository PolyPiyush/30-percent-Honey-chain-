/**
 * HoneyChain Analytics & Yield Intelligence Module
 * Production trends, moisture vs temperature correlations, and supply chain throughput.
 */

import React from 'react';
import { useHive } from '../../context/HiveContext';
import { BarChart3, TrendingUp, Droplets, Thermometer, ShieldCheck } from 'lucide-react';

export const AnalyticsModule: React.FC = () => {
  const { batches, hives } = useHive();

  const monthlyYield = [
    { month: 'Apr', yieldKg: 42, qualityScore: 99.4 },
    { month: 'May', yieldKg: 68, qualityScore: 99.6 },
    { month: 'Jun', yieldKg: 85, qualityScore: 99.2 },
    { month: 'Jul', yieldKg: 94, qualityScore: 99.5 },
    { month: 'Aug', yieldKg: 110, qualityScore: 99.8 },
    { month: 'Sept', yieldKg: 125, qualityScore: 99.9 },
  ];

  const floralYield = [
    { source: 'Mustard Blossom', percentage: 48, color: '#f59e0b' },
    { source: 'Multifloral Wildflower', percentage: 32, color: '#10b981' },
    { source: 'Jamun Forest', percentage: 12, color: '#8b5cf6' },
    { source: 'Acacia Flora', percentage: 8, color: '#38bdf8' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-amber-900/40 bg-[#120a04]/90 backdrop-blur-md">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-display flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span>Yield & Quality Analytics Engine</span>
          </h2>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Macro-level metrics across the Sahyadri collective apiaries and cold chain transit.
          </p>
        </div>

        <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/40 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>FSSAI & Agmark Standard Compliance: 100%</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Production Trends */}
        <div className="p-6 rounded-2xl border border-amber-900/40 bg-[#120a04]/90 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-amber-950 pb-3">
            <div>
              <h3 className="text-base font-semibold text-white font-display">
                Seasonal Yield Trajectory (kg)
              </h3>
              <p className="text-xs text-amber-200/50">
                Monthly verified honey extracted and registered on-chain.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400">+22.4% vs 2025</span>
          </div>

          <div className="h-60 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {monthlyYield.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.yieldKg}kg
                </span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-amber-600 to-amber-400 group-hover:from-amber-500 group-hover:to-amber-300 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  style={{ height: `${(item.yieldKg / 140) * 100}%` }}
                />
                <span className="text-xs font-mono text-amber-400/80 mt-1">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Floral Source Distribution */}
        <div className="p-6 rounded-2xl border border-amber-900/40 bg-[#120a04]/90 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-amber-950 pb-3">
            <div>
              <h3 className="text-base font-semibold text-white font-display">
                Floral Origin Breakdown
              </h3>
              <p className="text-xs text-amber-200/50">
                Pollen melissopalynological analysis distribution.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400">4 Monitored Flora</span>
          </div>

          <div className="space-y-4 pt-2">
            {floralYield.map((f) => (
              <div key={f.source} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white">{f.source}</span>
                  <span className="text-amber-300 font-semibold">{f.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-amber-950">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${f.percentage}%`,
                      backgroundColor: f.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
