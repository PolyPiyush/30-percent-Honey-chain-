/**
 * HoneyChain Types & Data Contracts
 * Hybrid IoT + AI + Blockchain + QR-code Honey Traceability System
 */

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'BEEKEEPER'
  | 'PROCESSOR'
  | 'DISTRIBUTOR'
  | 'RETAILER'
  | 'INSPECTOR'
  | 'CONSUMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  walletAddress?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Apiary {
  id: string;
  name: string;
  location: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  floralSources: string[];
  hiveCount: number;
  beekeeperId: string;
  beekeeperName: string;
  certifications: string[];
  establishedDate: string;
}

export type HiveHealthStatus = 'NOMINAL' | 'WARNING' | 'CRITICAL';

export interface Hive {
  id: string;
  apiaryId: string;
  apiaryName: string;
  hiveNumber: string;
  queenYear: number;
  colonyStrength: 'High' | 'Normal' | 'Weak';
  healthStatus: HiveHealthStatus;
  currentTemp: number;
  currentHumidity: number;
  currentWeight: number;
  batteryLevel: number;
  acousticFrequency: number;
  activityRate: string;
  lastInspected: string;
}

export interface SensorReading {
  id: string;
  hiveId: string;
  sensorId: string;
  temperature: number;
  humidity: number;
  weight: number;
  acousticsDb?: number;
  frequencyHz?: number;
  batteryLevel: number;
  timestamp: string;
}

export interface AIAnalysis {
  id: string;
  hiveId: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  confidence: number;
  colonyHealth: string;
  diseaseRisk: 'Low' | 'Moderate' | 'High';
  swarmingRisk: 'Low' | 'Moderate' | 'High';
  productionForecast: string;
  anomalies: string[];
  recommendations: string[];
  sensorCorrelations: {
    tempTrend: string;
    weightDelta: string;
    soundProfile: string;
  };
  generatedAt: string;
}

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface Alert {
  id: string;
  hiveId: string;
  hiveNumber: string;
  type:
    | 'HIGH_TEMPERATURE'
    | 'LOW_HIVE_WEIGHT'
    | 'ABNORMAL_HUMIDITY'
    | 'LOW_BATTERY'
    | 'POSSIBLE_ANOMALY'
    | 'UNUSUAL_PRODUCTIVITY_PATTERN';
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Harvest {
  id: string;
  harvestNumber: string;
  apiaryId: string;
  apiaryName: string;
  hiveId: string;
  hiveNumber: string;
  beekeeperId: string;
  beekeeperName: string;
  harvestDate: string;
  quantityKg: number;
  floralSource: string;
  moisturePercent: number;
  location: string;
  notes?: string;
}

export type BatchStatus =
  | 'CREATED'
  | 'HARVESTED'
  | 'PROCESSING'
  | 'QUALITY_CHECK'
  | 'CERTIFIED'
  | 'PACKAGED'
  | 'IN_TRANSIT'
  | 'DISTRIBUTED'
  | 'RETAIL'
  | 'SOLD';

export interface HoneyBatch {
  id: string;
  batchId: string; // e.g. "HC-2026-MH-00124"
  harvestId: string;
  productName: string;
  quantityKg: number;
  remainingKg: number;
  status: BatchStatus;
  beekeeperId: string;
  beekeeperName: string;
  origin: string;
  region: string;
  floralSource: string;
  harvestDate: string;
  processingFacility?: string;
  processingDate?: string;
  labCertificateCid?: string;
  ipfsCid: string;
  qrCodeUrl: string;
  blockchainTxHash: string;
  blockNumber: number;
  verifiedOnChain: boolean;
  contractAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessingRecord {
  id: string;
  batchId: string;
  processorName: string;
  facility: string;
  processingDate: string;
  method: string;
  maxTemperatureC: number;
  filtrationPoresMicron: number;
  notes: string;
  txHash?: string;
}

export interface QualityTest {
  id: string;
  batchId: string;
  laboratory: string;
  testDate: string;
  moisturePercent: number; // Max 20% by FSSAI standard
  hmfMgKg: number; // Hydroxymethylfurfural (Max 40 mg/kg)
  purityPercent: number;
  sugarProfile: {
    fructosePercent: number;
    glucosePercent: number;
    sucrosePercent: number;
  };
  pollenAnalysis: string;
  antibioticResidue: 'Nil / Below LOQ' | 'Detected';
  passed: boolean;
  labCertIpfsCid: string;
  inspectorName: string;
  txHash?: string;
}

export interface SupplyChainEvent {
  id: string;
  batchId: string;
  stage: string;
  fromParticipant: string;
  toParticipant: string;
  location: string;
  timestamp: string;
  quantityKg: number;
  status: string;
  txHash: string;
  notes: string;
  verified: boolean;
}

export interface BlockchainBlock {
  blockNumber: number;
  timestamp: string;
  hash: string;
  prevHash: string;
  transactionsCount: number;
  validator: string;
  gasUsed: string;
  merkleRoot: string;
  isImmutable: boolean;
}

export interface BlockchainTransaction {
  txHash: string;
  blockNumber: number;
  batchId: string;
  event: string;
  from: string;
  to: string;
  timestamp: string;
  status: 'CONFIRMED' | 'PENDING' | 'FAILED';
  contractAddress: string;
  gasUsed: number;
  dataPayload?: Record<string, unknown>;
}

export interface OraclePacket {
  id: string;
  layer: 'IoT Sensors' | 'Backend API' | 'Oracle Verification' | 'Smart Contract' | 'Blockchain Ledger' | 'HoneyChain App';
  title: string;
  payload: string;
  timestamp: string;
  status: 'VERIFIED' | 'PROPAGATING' | 'COMMITTED';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
  requestId: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
