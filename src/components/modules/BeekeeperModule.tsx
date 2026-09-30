/**
 * HoneyChain Beekeeper Management Console
 * Manage Apiaries, log fresh honey harvests, mint new blockchain batches, and inspect colony alerts
 */

import React, { useState } from 'react';
import { useHive } from '../../context/HiveContext';
import { apiService } from '../../services/api';
import {
  User,
  Plus,
  Flower2,
  Calendar,
  Layers,
  Scale,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export const BeekeeperModule: React.FC = () => {
  const { hives, showToast, refreshData, alerts, markAlertRead } = useHive();
  const [isSubmittingHarvest, setIsSubmittingHarvest] = useState(false);
  const [harvestHiveId, setHarvestHiveId] = useState(hives[0]?.id || 'hive-mh-024');
  const [harvestQty, setHarvestQty] = useState('35');
  const [floralSource, setFloralSource] = useState('Mustard Blossom & Wild Flora');
  const [harvestNotes, setHarvestNotes] = useState('Sealed combs harvested at 92% maturity.');

  const handleRecordHarvest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingHarvest(true);

    try {
      const hive = hives.find((h) => h.id === harvestHiveId) || hives[0];
      const newHarvest = await apiService.createHarvest({
        apiaryId: hive?.apiaryId || 'apiary-01',
        hiveId: hive?.id || 'hive-mh-024',
        quantityKg: parseFloat(harvestQty),
        floralSource,
        notes: harvestNotes,
      });

      // Automatically offer to mint batch
      await apiService.createBatch({
        harvestId: newHarvest.id,
        productName: `Raw ${floralSource} Honey`,
        quantityKg: parseFloat(harvestQty),
      });

      await refreshData();
      showToast(`Harvest of ${harvestQty}kg logged and minted to blockchain!`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Harvest recording failed';
      showToast(msg, 'warning');
    } finally {
      setIsSubmittingHarvest(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-amber-900/40 bg-[#120a04]/90 backdrop-blur-md">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-display flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <span>Beekeeper Operations & Harvest Console</span>
          </h2>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Operator Rajesh Patil · Sahyadri Organic Bee Collective (NPOP & FSSAI Certified)
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-amber-300">
          <span>Active Colonies: <strong>{hives.length} Hives</strong></span>
          <span>·</span>
          <span>Region: Satara & Western Ghats</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Log New Harvest Form */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-amber-900/40 bg-[#120a04]/90 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-amber-950 pb-3">
            <div>
              <h3 className="text-base font-semibold text-white font-display">
                Record New Honey Harvest
              </h3>
              <p className="text-xs text-amber-200/60 mt-0.5">
                Logs physical harvest weight and auto-mints an immutable HoneyChain batch token.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Direct Polygon Amoy Mint
            </span>
          </div>

          <form onSubmit={handleRecordHarvest} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-amber-300/80 mb-1.5">
                  Source Hive
                </label>
                <select
                  value={harvestHiveId}
                  onChange={(e) => setHarvestHiveId(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-amber-900/60 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                >
                  {hives.map((h) => (
                    <option key={h.id} value={h.id} className="bg-slate-900 text-white">
                      {h.hiveNumber} ({h.apiaryName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-amber-300/80 mb-1.5">
                  Harvest Quantity (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={harvestQty}
                    onChange={(e) => setHarvestQty(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-black/60 border border-amber-900/60 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                  <Scale className="w-4 h-4 text-amber-500/60 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-amber-300/80 mb-1.5">
                Floral Source Spectrum
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={floralSource}
                  onChange={(e) => setFloralSource(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-black/60 border border-amber-900/60 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Wildflower Mustard & Acacia"
                />
                <Flower2 className="w-4 h-4 text-amber-500/60 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-amber-300/80 mb-1.5">
                Beekeeper Harvest Notes & Frame Condition
              </label>
              <textarea
                value={harvestNotes}
                onChange={(e) => setHarvestNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-black/60 border border-amber-900/60 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingHarvest}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmittingHarvest ? 'Creating Batch on Blockchain...' : 'Record Harvest & Mint Batch'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Apiary Alerts & Health Checklist */}
        <div className="p-6 rounded-2xl border border-amber-900/40 bg-[#120a04]/90 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-amber-950 pb-3">
            <h3 className="text-base font-semibold text-white font-display">
              Active Apiary Alerts
            </h3>
            <span className="text-xs font-mono text-amber-400">
              {alerts.length} Notified
            </span>
          </div>

          <div className="space-y-3">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border text-xs font-mono space-y-1.5 ${
                    alert.read
                      ? 'bg-black/20 border-amber-950 opacity-60'
                      : 'bg-amber-950/30 border-amber-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      {alert.hiveNumber}
                    </span>
                    {!alert.read && (
                      <button
                        onClick={() => markAlertRead(alert.id)}
                        className="text-[10px] text-amber-400 hover:text-amber-200 underline cursor-pointer"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                  <p className="text-amber-100/70 font-sans text-xs">{alert.message}</p>
                  <div className="text-[10px] text-amber-400/50 pt-1">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-amber-400/60 font-mono">
                All colonies nominal. No active sensor warnings.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
