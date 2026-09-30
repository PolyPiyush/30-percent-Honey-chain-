/**
 * HoneyChain Smart Hive IoT Monitoring Module
 * Digital hive representation with real-time animated IoT gauges, time-series charts,
 * acoustic telemetry, and subtle anomaly warning animations.
 */

import React, { useState } from 'react';
import { useHive } from '../../context/HiveContext';
import { apiService } from '../../services/api';
import { Hive } from '../../types';
import { haptics } from '../../utils/haptics';
import { DigitalHiveCanvas } from './oracle/DigitalHive';
import {
  Thermometer,
  Droplets,
  Scale,
  Activity,
  Radio,
  Battery,
  AlertTriangle,
  Send,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const HiveMonitoringModule: React.FC = () => {
  const { hives, activeHiveId, setActiveHiveId, showToast, refreshData } = useHive();
  const [isSimulatingIngestion, setIsSimulatingIngestion] = useState(false);
  const [manualTemp, setManualTemp] = useState('34.2');
  const [manualWeight, setManualWeight] = useState('42.7');
  const [manualHumidity, setManualHumidity] = useState('68.0');

  const currentHive = hives.find((h) => h.id === activeHiveId) || hives[0];
  const [show3DHive, setShow3DHive] = useState(true);

  const handleSendReading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentHive) return;

    haptics.buttonClick();
    setIsSimulatingIngestion(true);
    try {
      await apiService.ingestSensorReading({
        hiveId: currentHive.id,
        temperature: parseFloat(manualTemp),
        humidity: parseFloat(manualHumidity),
        weight: parseFloat(manualWeight),
      });
      await refreshData();
      haptics.pulse();
      showToast(`Sensor packet ingested for ${currentHive.hiveNumber}`, 'success');
    } catch (err: unknown) {
      haptics.warning();
      const msg = err instanceof Error ? err.message : 'Ingestion rejected';
      showToast(msg, 'warning');
    } finally {
      setIsSimulatingIngestion(false);
    }
  };

  const handleSimulateAnomaly = async () => {
    if (!currentHive) return;
    haptics.warning();
    try {
      await apiService.ingestSensorReading({
        hiveId: currentHive.id,
        temperature: 36.8, // Slightly elevated, triggers subtle warning
        humidity: 74.0,
        weight: currentHive.currentWeight,
      });
      await refreshData();
      showToast(`Simulated thermal drift anomaly in ${currentHive.hiveNumber}`, 'warning');
    } catch (e) {
      console.error(e);
    }
  };

  // Mock 24-hour time series points for temperature & weight chart
  const timePoints = [
    { time: '00:00', temp: 33.9, weight: 42.1 },
    { time: '04:00', temp: 34.0, weight: 42.2 },
    { time: '08:00', temp: 34.2, weight: 42.4 },
    { time: '12:00', temp: 34.5, weight: 42.6 },
    { time: '16:00', temp: 34.3, weight: 42.8 },
    { time: '20:00', temp: (currentHive?.currentTemp || 34.2), weight: (currentHive?.currentWeight || 42.7) },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Header & Hive Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-amber-900/40 bg-[#120a04]/90 backdrop-blur-md">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-display flex items-center gap-2">
            <span>Digital Smart Hive Monitoring</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/40 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              REST & MQTT Live Feeds
            </span>
          </h2>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Internal micro-climate, acoustic queen frequency, and hive weight dynamics.
          </p>
        </div>

        {/* Hive Selector Tabs & 3D Toggle */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => {
              haptics.tap();
              setShow3DHive(!show3DHive);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer border whitespace-nowrap ${
              show3DHive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-black/40 text-amber-200/60 border-amber-950 hover:bg-black/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{show3DHive ? '3D Twin: ON' : '3D Twin: OFF'}</span>
          </button>

          {hives.map((h) => {
            const isSelected = h.id === activeHiveId;
            const isWarning = h.healthStatus === 'WARNING';
            return (
              <button
                key={h.id}
                onClick={() => {
                  haptics.tap();
                  setActiveHiveId(h.id);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer border whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-semibold border-amber-400 shadow-sm'
                    : isWarning
                    ? 'bg-amber-950/40 text-amber-300 border-amber-700/60 hover:bg-amber-900/40'
                    : 'bg-black/40 text-amber-200/70 border-amber-950 hover:bg-black/60'
                }`}
              >
                <span>{h.hiveNumber}</span>
                {isWarning && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {currentHive && (
        <>
          {/* 3D Digital Hive Twin (React Three Fiber) */}
          {show3DHive && (
            <div className="relative rounded-2xl border border-amber-900/40 bg-[#0e0804] overflow-hidden shadow-2xl">
              <div className="p-3 bg-black/60 border-b border-amber-950/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                    3D Digital Twin — {currentHive.hiveNumber} (React Three Fiber)
                  </span>
                </div>
                <span className="text-[10px] text-amber-400/70 hidden sm:inline">
                  Center-Left Stylized Hive · Organic Cell Pulsing · Orbiting Worker Bees
                </span>
              </div>
              <DigitalHiveCanvas
                className="w-full h-80"
                position={[-2.8, 0, 0]}
                scale={0.95}
                telemetry={{
                  hiveId: currentHive.hiveNumber,
                  temp: currentHive.currentTemp,
                  humidity: currentHive.currentHumidity,
                  weight: currentHive.currentWeight,
                  activityCount: currentHive.currentTemp > 36 ? 420 : 218,
                  environment: 28.2,
                  honeyProductionKg: Math.max(0, currentHive.currentWeight - 28),
                }}
                isOutlier={currentHive.healthStatus === 'WARNING'}
              />
            </div>
          )}

          {/* Subtle Anomaly Notification Banner if Warning */}
          {currentHive.healthStatus === 'WARNING' && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-4 flex items-center justify-between text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                <span>
                  <strong>Temperature / Acoustic Anomaly Detected:</strong> Internal reading is{' '}
                  {currentHive.currentTemp}°C ({currentHive.activityRate}).
                </span>
              </div>
              <span className="font-mono text-amber-300/80">Check swarm cells</span>
            </div>
          )}

          {/* 6 Key IoT Metrics Gauge Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* 1. Temperature */}
            <div className="p-4 rounded-xl border border-amber-900/40 bg-[#140b04]/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-400/80 font-mono">
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  Brood Temp
                </span>
                <span className="text-[10px] text-amber-400/50">34-35°C</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono-numbers">
                {currentHive.currentTemp.toFixed(1)}
                <span className="text-xs text-amber-400/60 ml-1 font-mono">°C</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">
                Optimal brood regulation
              </div>
            </div>

            {/* 2. Humidity */}
            <div className="p-4 rounded-xl border border-amber-900/40 bg-[#140b04]/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-400/80 font-mono">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  Humidity
                </span>
                <span className="text-[10px] text-amber-400/50">60-70%</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono-numbers">
                {currentHive.currentHumidity.toFixed(1)}
                <span className="text-xs text-amber-400/60 ml-1 font-mono">%</span>
              </div>
              <div className="text-[11px] text-sky-400 font-mono">
                Healthy comb moisture
              </div>
            </div>

            {/* 3. Weight */}
            <div className="p-4 rounded-xl border border-amber-900/40 bg-[#140b04]/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-400/80 font-mono">
                <span className="flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  Hive Weight
                </span>
                <span className="text-[10px] text-amber-400/50">Tare 22kg</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono-numbers">
                {currentHive.currentWeight.toFixed(1)}
                <span className="text-xs text-amber-400/60 ml-1 font-mono">kg</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+12.4% Surplus Nectar</span>
              </div>
            </div>

            {/* 4. Bee Activity */}
            <div className="p-4 rounded-xl border border-amber-900/40 bg-[#140b04]/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-400/80 font-mono">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Activity
                </span>
                <span className="text-[10px] text-amber-400/50">Opto-gate</span>
              </div>
              <div className="text-lg font-bold text-white truncate font-display">
                Optimal
              </div>
              <div className="text-[11px] text-amber-300/80 font-mono truncate">
                214 bees / min
              </div>
            </div>

            {/* 5. Acoustic Spectrum */}
            <div className="p-4 rounded-xl border border-amber-900/40 bg-[#140b04]/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-400/80 font-mono">
                <span className="flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-purple-400" />
                  Acoustic
                </span>
                <span className="text-[10px] text-amber-400/50">MEMS Mic</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono-numbers">
                {currentHive.acousticFrequency}
                <span className="text-xs text-amber-400/60 ml-1 font-mono">Hz</span>
              </div>
              <div className="text-[11px] text-purple-400 font-mono">
                Harmonic queen hum
              </div>
            </div>

            {/* 6. Battery & IoT Node */}
            <div className="p-4 rounded-xl border border-amber-900/40 bg-[#140b04]/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-400/80 font-mono">
                <span className="flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                  IoT Battery
                </span>
                <span className="text-[10px] text-amber-400/50">Solar Aux</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono-numbers">
                {currentHive.batteryLevel}
                <span className="text-xs text-amber-400/60 ml-1 font-mono">%</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">
                Nominal 3.7V LiPo
              </div>
            </div>
          </div>

          {/* Real-time Time Series Telemetry Visualizer */}
          <div className="p-6 rounded-2xl border border-amber-900/40 bg-[#120a04]/90 backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-300 font-mono">
                  24-Hour Micro-Climate & Colony Mass Curve
                </h3>
                <p className="text-xs text-amber-200/50">
                  Continuous sensor readings sampled every 15 minutes by edge IoT microcontrollers.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-0.5 bg-amber-400" />
                  Brood Temp (°C)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-0.5 bg-emerald-400" />
                  Hive Weight (kg)
                </span>
              </div>
            </div>

            {/* SVG Line Chart */}
            <div className="relative h-56 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#451a03" strokeDasharray="3 3" strokeWidth="0.8" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="#451a03" strokeDasharray="3 3" strokeWidth="0.8" />
                <line x1="0" y1="160" x2="600" y2="160" stroke="#451a03" strokeDasharray="3 3" strokeWidth="0.8" />

                {/* Temperature Curve (Yellow/Amber) */}
                <path
                  d="M 0 110 Q 120 100 240 85 T 480 75 L 600 70"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.4"
                />

                {/* Weight Curve (Emerald) */}
                <path
                  d="M 0 150 Q 120 145 240 130 T 480 110 L 600 95"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.4"
                />

                {/* Data points */}
                <circle cx="0" cy="110" r="3.5" fill="#f59e0b" />
                <circle cx="240" cy="85" r="3.5" fill="#f59e0b" />
                <circle cx="480" cy="75" r="3.5" fill="#f59e0b" />
                <circle cx="600" cy="70" r="4.5" fill="#f59e0b" />

                <circle cx="0" cy="150" r="3.5" fill="#10b981" />
                <circle cx="240" cy="130" r="3.5" fill="#10b981" />
                <circle cx="480" cy="110" r="3.5" fill="#10b981" />
                <circle cx="600" cy="95" r="4.5" fill="#10b981" />
              </svg>

              {/* X-axis labels */}
              <div className="flex justify-between text-[11px] font-mono text-amber-400/60 pt-2 border-t border-amber-950">
                {timePoints.map((tp, i) => (
                  <span key={i}>{tp.time}</span>
                ))}
              </div>
            </div>
          </div>

          {/* IoT Ingestion & Anomaly Simulation Testing Box */}
          <div className="p-6 rounded-2xl border border-amber-900/40 bg-[#120a04]/90 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-300 font-mono">
                  IoT Sensor Telemetry Ingestion Simulator
                </h4>
                <p className="text-xs text-amber-200/50">
                  Transmits validated JSON payload directly to <code className="text-amber-400">/api/v1/iot/readings</code>.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSimulateAnomaly}
                className="px-3 py-1.5 rounded-lg border border-amber-600/40 bg-amber-950/30 hover:bg-amber-900/40 text-xs font-mono text-amber-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Anomaly (36.8°C)</span>
              </button>
            </div>

            <form onSubmit={handleSendReading} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-amber-300/70 mb-1">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={manualTemp}
                  onChange={(e) => setManualTemp(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-amber-900/60 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-amber-300/70 mb-1">
                  Humidity (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={manualHumidity}
                  onChange={(e) => setManualHumidity(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-amber-900/60 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-amber-300/70 mb-1">
                  Hive Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={manualWeight}
                  onChange={(e) => setManualWeight(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-amber-900/60 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isSimulatingIngestion}
                  className="w-full py-2 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Reading</span>
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
