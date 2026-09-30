/**
 * Types & Data Contracts for "The Digital Nervous System"
 * HoneyChain IoT -> Gateway -> Backend API -> Oracle -> Smart Contract -> Blockchain Architecture
 */

export type StoryStage =
  | 'hive'           // 0 - 15%: Digital Hive Twin
  | 'sensors'        // 15 - 30%: Attached Sensor Nodes
  | 'convergence'    // 30 - 45%: Signals Converge to Gateway
  | 'gateway'        // 45 - 55%: IoT Gateway Aggregation
  | 'api'            // 55 - 65%: Backend API Highway Transformation
  | 'oracle'         // 65 - 80%: Oracle Verification Gate (Hero)
  | 'smart_contract' // 80 - 90%: Smart Contract Logic Validation & Path Split
  | 'blockchain'     // 90 - 100%: Blockchain Block Sealed & Immutable Memory
  | 'overview';      // Zoom-out Macro Ecosystem Overview

export type InteractiveTarget =
  | 'hive'
  | 'sensor_temp'
  | 'sensor_humidity'
  | 'sensor_weight'
  | 'sensor_activity'
  | 'sensor_env'
  | 'gateway'
  | 'api'
  | 'oracle'
  | 'smart_contract'
  | 'blockchain'
  | 'ai_node';

export interface LiveTelemetry {
  hiveId: string;
  apiary: string;
  temp: number;
  humidity: number;
  weight: number;
  activity: string;
  activityCount: number;
  environment: number;
  honeyProductionKg: number;
  batteryPercent: number;
  timestamp: string;
  isOutlier: boolean;
  outlierType?: 'temperature' | 'weight';
}

export type PacketType = 'raw_telemetry' | 'harvest_event';

export type VerificationState =
  | 'idle'
  | 'scanning'
  | 'verified'
  | 'outlier_rejected';

export interface OracleRuleCheck {
  id: string;
  label: string;
  status: 'pending' | 'checking' | 'passed' | 'failed';
  expectedRange: string;
  actualValue: string;
}

export interface CapsulePayload {
  type: PacketType;
  hiveId: string;
  temp: string;
  humidity: string;
  weight: string;
  timestamp: string;
  eventName?: string;
  batchId?: string;
  txHash?: string;
  signature?: string;
  verified: boolean;
}

export interface InspectorData {
  target: InteractiveTarget;
  title: string;
  subtitle: string;
  world: 'PHYSICAL WORLD' | 'DATA WORLD' | 'TRUST WORLD' | 'LOGIC WORLD' | 'IMMUTABLE WORLD' | 'INTELLIGENCE';
  details: Record<string, string | number | boolean>;
  badge?: string;
  codeSnippet?: string;
}
