/**
 * HoneyChain — Inspector Panel for "The Digital Nervous System"
 * Deep architectural drawer displaying hardware specs, cryptographic signatures,
 * and live contract logic when inspecting any node in the 3D world.
 */

import React from 'react';
import { InteractiveTarget, LiveTelemetry } from './types';
import { DigitalHiveCanvas } from './DigitalHive';
import {
  X,
  Cpu,
  Radio,
  Server,
  ShieldCheck,
  FileCode,
  Link2,
  Sparkles,
  Thermometer,
  Droplets,
  Scale,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { haptics } from '../../../utils/haptics';

interface DataInspectorDrawerProps {
  target: InteractiveTarget | null;
  onClose: () => void;
  telemetry: LiveTelemetry;
  activeBlockNumber: number;
}

export const DataInspectorDrawer: React.FC<DataInspectorDrawerProps> = ({
  target,
  onClose,
  telemetry,
  activeBlockNumber,
}) => {
  if (!target) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    haptics.buttonClick();
  };

  const renderContent = () => {
    switch (target) {
      case 'hive':
        return {
          title: `Digital Twin — ${telemetry.hiveId}`,
          world: 'PHYSICAL WORLD',
          icon: Sparkles,
          accent: 'text-amber-400',
          border: 'border-amber-500/40',
          bg: 'bg-amber-950/20',
          badge: 'Active Digital Twin',
          fields: [
            { label: 'Apiary Origin', val: `${telemetry.apiary}, Maharashtra` },
            { label: 'Colony Queen Year', val: '2024 (Italian Ligustica Strain)' },
            { label: 'Monitored Parameters', val: 'Temp, Humidity, Weight, Acoustics, Activity, Ambient' },
            { label: 'Hardware Edge Gateway', val: 'HoneyChain-Gateway-ESP32 v2.4' },
            { label: 'Current Battery Level', val: `${telemetry.batteryPercent}% (Solar Micro-Harvesting)` },
            { label: 'Honey Super Weight', val: `${telemetry.weight.toFixed(1)} kg (${telemetry.honeyProductionKg.toFixed(1)} kg Extractable)` },
          ],
          codeTitle: 'Digital Twin State Sync',
          code: JSON.stringify(
            {
              hiveId: telemetry.hiveId,
              status: 'NOMINAL',
              telemetry: {
                temp: telemetry.temp,
                humidity: telemetry.humidity,
                weight: telemetry.weight,
                activity: telemetry.activity,
              },
              firmware: 'HC-FW-2026.04',
            },
            null,
            2
          ),
        };

      case 'sensor_temp':
        return {
          title: 'Brood Thermistor Probe (DS18B20)',
          world: 'PHYSICAL WORLD',
          icon: Thermometer,
          accent: 'text-orange-400',
          border: 'border-orange-500/40',
          bg: 'bg-orange-950/20',
          badge: telemetry.isOutlier ? '⚠ Outlier Triggered' : 'Calibrated ±0.1°C',
          fields: [
            { label: 'Current Brood Temp', val: `${telemetry.temp.toFixed(1)}°C` },
            { label: 'Optimal Brood Range', val: '33.5°C — 35.5°C' },
            { label: 'Sensor Model', val: 'Maxim Integrated DS18B20 Waterproof Probe' },
            { label: 'Resolution', val: '12-bit (0.0625°C precision)' },
            { label: 'Sampling Rate', val: '1 reading every 15 seconds' },
            { label: 'Oracle Tolerance Range', val: '32.0°C to 38.0°C' },
          ],
          codeTitle: 'Raw ADC Sensor Reading',
          code: `[1-Wire DS18B20]\nROM: 28 FF 4B 62 81 16 03 9C\nScratchpad: 68 01 4B 46 7F FF 08 10 3B\nCRC: 0x3B (VALID)\nConverted: ${telemetry.temp.toFixed(2)} °C`,
        };

      case 'sensor_humidity':
        return {
          title: 'Chamber Hygrometer Sensor (SHT40)',
          world: 'PHYSICAL WORLD',
          icon: Droplets,
          accent: 'text-cyan-400',
          border: 'border-cyan-500/40',
          bg: 'bg-cyan-950/20',
          badge: 'Operating Nominal',
          fields: [
            { label: 'Relative Humidity', val: `${telemetry.humidity.toFixed(1)}% RH` },
            { label: 'Target Chamber Range', val: '60% — 70% RH' },
            { label: 'Hardware Model', val: 'Sensirion SHT40 4th Gen Precision Sensor' },
            { label: 'Accuracy', val: '±1.5% RH' },
            { label: 'Condensation Prevention', val: 'Built-in Micro Heater Active' },
            { label: 'FSSAI Moisture Correlation', val: 'Est. 18.2% finished honey moisture' },
          ],
          codeTitle: 'I2C Telemetry Bus',
          code: `[I2C Address 0x44]\nCommand: 0xFD (High Precision Measure)\nPayload: 0x5E 0xA2 (RH = ${telemetry.humidity.toFixed(1)}%)\nStatus: Healthy`,
        };

      case 'sensor_weight':
        return {
          title: 'Industrial Scale Platform (HX711 + 4 Load Cells)',
          world: 'PHYSICAL WORLD',
          icon: Scale,
          accent: 'text-emerald-400',
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-950/20',
          badge: 'Tare Calibrated',
          fields: [
            { label: 'Total Hive Mass', val: `${telemetry.weight.toFixed(1)} kg` },
            { label: 'Harvest Target', val: '45.0 kg' },
            { label: 'Hardware Interface', val: 'Avia Semiconductor HX711 24-bit ADC' },
            { label: 'Load Cell Array', val: '4x 50kg Wheatstone bridge strain gauges' },
            { label: 'Daily Nectar Gain', val: '+0.85 kg (Flow Season Active)' },
            { label: 'Harvest Status', val: telemetry.weight >= 45.0 ? '✓ READY TO HARVEST' : 'Accumulating Nectar' },
          ],
          codeTitle: 'Load Cell Differential Reading',
          code: `[HX711 24-Bit ADC]\nRaw Value: 0x007A2B14\nOffset: -12800\nGain: 128\nCalculated Weight: ${telemetry.weight.toFixed(2)} kg`,
        };

      case 'sensor_activity':
        return {
          title: 'Optical Bee-Activity Scanner Gate',
          world: 'PHYSICAL WORLD',
          icon: Activity,
          accent: 'text-amber-300',
          border: 'border-amber-400/40',
          bg: 'bg-amber-950/20',
          badge: 'Entrance Gate 1',
          fields: [
            { label: 'Foraging Rate', val: `${telemetry.activityCount} bees / min (${telemetry.activity})` },
            { label: 'Traffic Direction', val: '64% Inbound with Pollen / 36% Outbound' },
            { label: 'Hardware Mechanism', val: 'Dual IR Photogate Array (Directional)' },
            { label: 'Acoustic Correlation', val: '185 Hz Brood Hum (Nominal Queen Presence)' },
            { label: 'Swarm Prevention Alert', val: 'Nominal (No departure surge detected)' },
          ],
          codeTitle: 'Optoelectronic Traffic Vector',
          code: `[IR Gate Interrupt 0x02]\nInbound Ticks: 140\nOutbound Ticks: 78\nDelta: +62 forager return\nClassification: Optimal Foraging Surge`,
        };

      case 'sensor_env':
        return {
          title: 'Ambient Apiary Weather Probe (BME280)',
          world: 'PHYSICAL WORLD',
          icon: Sparkles,
          accent: 'text-lime-400',
          border: 'border-lime-500/40',
          bg: 'bg-lime-950/20',
          badge: 'External Sensor',
          fields: [
            { label: 'External Temp', val: `${telemetry.environment.toFixed(1)}°C` },
            { label: 'Barometric Pressure', val: '1013.2 hPa' },
            { label: 'Solar Irradiance', val: '840 W/m² (Sunny)' },
            { label: 'Flora Pollen Factor', val: 'High (Acacia & Jamun Blooming)' },
          ],
          codeTitle: 'Microclimate Ingestion',
          code: `[BME280 Ambient]\nTemp: ${telemetry.environment.toFixed(1)}°C\nPressure: 1013.25 hPa\nAltitude: 580m MSL`,
        };

      case 'gateway':
        return {
          title: 'IoT Edge Gateway — Aggregation Hub',
          world: 'DATA WORLD',
          icon: Radio,
          accent: 'text-cyan-400',
          border: 'border-cyan-500/40',
          bg: 'bg-cyan-950/20',
          badge: 'Data Collected ✓',
          fields: [
            { label: 'Gateway Model', val: 'ESP32-S3 LoRaWAN + MQTT Edge Gateway' },
            { label: 'Attached Sensors', val: '5 Nodes (Temp, Hum, Weight, Activity, Env)' },
            { label: 'Connected Protocol', val: 'MQTT / TLS 1.3 over Cellular LTE-M' },
            { label: 'Aggregation Strategy', val: '5-Sensor Rolling Vector Assembly' },
            { label: 'Edge Buffer Size', val: '512 KB Flash Queue (Zero packet loss)' },
            { label: 'Capsule Generation', val: 'Hexagonal Data Capsule every 30s' },
          ],
          codeTitle: 'Aggregated Data Capsule Payload',
          code: JSON.stringify(
            {
              capsuleId: 'CAP-2026-0819',
              hiveId: telemetry.hiveId,
              tempC: telemetry.temp,
              humidityPercent: telemetry.humidity,
              weightKg: telemetry.weight,
              activityRate: telemetry.activity,
              timestamp: telemetry.timestamp,
              digest: '0x3c9f28a...11ef',
            },
            null,
            2
          ),
        };

      case 'api':
        return {
          title: 'Backend API Gateway & Highway',
          world: 'DATA WORLD',
          icon: Server,
          accent: 'text-sky-400',
          border: 'border-sky-500/40',
          bg: 'bg-sky-950/20',
          badge: 'REST / GraphQL Sync',
          fields: [
            { label: 'REST Ingestion Endpoint', val: 'POST /api/v1/iot/readings' },
            { label: 'Transformation Flow', val: 'Sensor Data → Structured JSON → API Payload' },
            { label: 'Payload Integrity', val: 'HMAC-SHA256 authenticated header' },
            { label: 'Latency', val: '18 ms round-trip to cloud ingest' },
            { label: 'Forwarding Target', val: 'Decentralized Oracle Verification Network' },
          ],
          codeTitle: 'Express / Fastify Ingestion Schema',
          code: `POST /api/v1/iot/readings HTTP/1.1\nHost: api.honeychain.io\nAuthorization: Bearer hc_live_token_719b\nContent-Type: application/json\n\n{\n  "hiveId": "${telemetry.hiveId}",\n  "temperature": ${telemetry.temp},\n  "humidity": ${telemetry.humidity},\n  "weight": ${telemetry.weight},\n  "timestamp": "${telemetry.timestamp}"\n}`,
        };

      case 'oracle':
        return {
          title: 'Oracle Verification Gate (Hero Engine)',
          world: 'TRUST WORLD',
          icon: ShieldCheck,
          accent: 'text-cyan-300',
          border: 'border-cyan-500/50',
          bg: 'bg-cyan-950/20',
          badge: telemetry.isOutlier ? '⚠ Outlier Detected — Review' : 'Verified Cryptographic Gate',
          fields: [
            { label: 'Oracle Network', val: 'HoneyChain Decentralized Oracle Network (DON)' },
            { label: 'Verification Standard', val: 'Chainlink Any-API + Custom secp256k1 Validator' },
            { label: 'Rules Evaluated', val: '1. Identity 2. Timestamp 3. Sig 4. Integrity 5. Range' },
            { label: 'Cryptographic Signature', val: '0x81b49c71a39f02e48271bb89381cde291f...amoy' },
            { label: 'Current Gate Status', val: telemetry.isOutlier ? 'HALTED (Data Exceeds Tolerances)' : 'PASS (Capsule Sealed)' },
          ],
          codeTitle: 'Oracle Verification Logic Check',
          code: `function verifyPayload(TelemetryPayload memory p) external view returns (bool) {\n  require(p.timestamp <= block.timestamp + 60, "Future timestamp");\n  require(p.temp >= 32.0 && p.temp <= 38.0, "Brood Temp Out of Bounds");\n  require(verifySignature(p.hash, p.signature), "Invalid Hive Key");\n  return true; // VERIFIED ✓\n}`,
        };

      case 'smart_contract':
        return {
          title: 'Smart Contract Decision Engine',
          world: 'LOGIC WORLD',
          icon: FileCode,
          accent: 'text-indigo-400',
          border: 'border-indigo-500/40',
          bg: 'bg-indigo-950/20',
          badge: 'HoneyChainTraceability.sol',
          fields: [
            { label: 'Target Network', val: 'Polygon Amoy Testnet (Chain ID 80002)' },
            { label: 'Contract Address', val: '0x91F5a3089622CeA861054b1f6D06113A3C98221b' },
            { label: 'Executing Method', val: 'recordVerifiedHarvest(batchId, telemetryHash, proof)' },
            { label: 'Gas Consumption', val: '42,190 Gwei (Ultra-low cost L2)' },
            { label: 'State Transition', val: 'CONDITIONS VERIFIED ✓ → EVENT ACCEPTED ✓' },
          ],
          codeTitle: 'Smart Contract Method',
          code: `event HarvestEventRecorded(\n  string indexed batchId,\n  uint256 weightKg,\n  uint256 blockTimestamp,\n  bytes32 merkleRoot\n);\n\n// Verified conditions emit state event onto immutable blockchain`,
        };

      case 'blockchain':
        return {
          title: `Blockchain Ledger — Block #${activeBlockNumber}`,
          world: 'IMMUTABLE WORLD',
          icon: Link2,
          accent: 'text-sky-300',
          border: 'border-sky-500/40',
          bg: 'bg-sky-950/20',
          badge: 'Immutable Record Sealed ✓',
          fields: [
            { label: 'Block Height', val: `#${activeBlockNumber}` },
            { label: 'Transaction Hash', val: '0x7f2ab8912e753c...9b41a87e' },
            { label: 'Batch Anchor', val: 'HC-2026-MH-00124 (Certified Pure)' },
            { label: 'Merkle Root', val: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3' },
            { label: 'Consensus Validator', val: 'Polygon Amoy PoS Node #48' },
            { label: 'Immutability Guarantee', val: '100% Cryptographically Finalized' },
          ],
          codeTitle: 'Block Header & Receipt',
          code: `{\n  "blockNumber": ${activeBlockNumber},\n  "timestamp": "${new Date().toISOString()}",\n  "event": "HARVEST_RECORDED",\n  "merkleRoot": "0xd4e56740...b8fa3",\n  "status": "CONFIRMED"\n}`,
        };

      case 'ai_node':
        return {
          title: 'HIVE AI — Colony Intelligence Engine',
          world: 'INTELLIGENCE',
          icon: Cpu,
          accent: 'text-emerald-400',
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-950/20',
          badge: 'Path A: Application Layer',
          fields: [
            { label: 'Colony Health Index', val: '98% Optimal Vitality' },
            { label: 'Disease / Pathogen Risk', val: 'Low (0.02 probability)' },
            { label: 'Swarming Probability', val: 'Low (Brood acoustic signature calm)' },
            { label: 'Production Forecast', val: '+14% Expected Yield next cycle' },
            { label: 'Architectural Role', val: 'Consumes Verified Sensor Data directly without cluttering on-chain state!' },
          ],
          codeTitle: 'AI Health Inference',
          code: `{\n  "model": "HoneyChain-ColonyVitality-v3",\n  "healthScore": 0.98,\n  "anomaliesDetected": 0,\n  "queenVitality": "Excellent",\n  "recommendation": "Maintain standard 14-day apiary inspection schedule"\n}`,
        };

      default:
        return null;
    }
  };

  const content = renderContent();
  if (!content) return null;

  const Icon = content.icon;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#0a0603]/95 backdrop-blur-xl border-l border-amber-950/80 shadow-2xl flex flex-col font-mono text-xs animate-in slide-in-from-right duration-300">
      {/* Top Header */}
      <div className={`p-5 border-b border-amber-900/30 flex items-start justify-between gap-3 ${content.bg}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${content.border} bg-black/50 text-white shadow-lg`}>
            <Icon className={`w-5 h-5 ${content.accent}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider">
                {content.world}
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-black/60 border border-amber-500/30 text-amber-200">
                {content.badge}
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-display mt-0.5">
              {content.title}
            </h3>
          </div>
        </div>

        <button
          onClick={() => {
            haptics.buttonClick();
            onClose();
          }}
          className="p-1.5 rounded-lg text-amber-300/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* 3D Digital Hive View for Hive Twin */}
        {target === 'hive' && (
          <div className="space-y-1.5">
            <span className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider block">
              3D Interactive Hive Twin (React Three Fiber)
            </span>
            <DigitalHiveCanvas
              className="w-full h-52 rounded-xl border border-amber-500/30"
              position={[0, -0.2, 0]}
              scale={0.88}
              telemetry={telemetry}
            />
          </div>
        )}

        {/* Specification Key-Value Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {content.fields.map((f, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-black/40 border border-amber-950/60 flex flex-col justify-between">
              <span className="text-[10px] text-amber-400/60 uppercase">{f.label}</span>
              <span className="text-white font-semibold text-xs mt-1 break-words">{f.val}</span>
            </div>
          ))}
        </div>

        {/* Live Code / Telemetry Inspector */}
        <div className="rounded-xl border border-amber-950/80 bg-black/70 overflow-hidden shadow-inner">
          <div className="px-4 py-2 bg-amber-950/30 border-b border-amber-950 flex items-center justify-between text-[11px] text-amber-300">
            <span className="font-bold flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              {content.codeTitle}
            </span>
            <button
              onClick={() => copyToClipboard(content.code)}
              className="flex items-center gap-1 text-[10px] text-amber-400/70 hover:text-amber-200 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
          </div>
          <pre className="p-4 text-[10px] text-amber-200/90 font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap max-h-56">
            {content.code}
          </pre>
        </div>

        {/* Architectural Insight Note */}
        <div className="p-3.5 rounded-xl border border-amber-900/30 bg-amber-950/15 text-amber-200/70 text-[11px] leading-relaxed flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 font-bold block mb-0.5">Architectural Principle:</strong>
            Raw high-frequency telemetry stays off-chain for zero bloat, while the Oracle cryptographically seals critical events into immutable blockchain state.
          </div>
        </div>
      </div>

      {/* Footer Close Action */}
      <div className="p-4 border-t border-amber-950/80 bg-black/40 flex justify-end">
        <button
          onClick={() => {
            haptics.buttonClick();
            onClose();
          }}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-all shadow-md"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};
