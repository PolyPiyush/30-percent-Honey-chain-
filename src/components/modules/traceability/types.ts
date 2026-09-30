/**
 * HoneyChain Traceability Types & Geographical Data Contracts
 * Supports real latitude/longitude coordinate systems, batch routes,
 * marker status states, and transport segments.
 */

export type LocationType =
  | 'hive'
  | 'collection'
  | 'extraction'
  | 'processing'
  | 'quality'
  | 'packaging'
  | 'distribution'
  | 'retail'
  | 'consumer';

export type MarkerStatus = 'completed' | 'current' | 'upcoming' | 'warning' | 'failed';

export interface TraceabilityLocation {
  id: string;
  type: LocationType;
  name: string;
  stageLabel: string;
  stageNumber: number;
  latitude: number;
  longitude: number;
  locationName: string;
  region: string;
  timestamp: string;
  actor: string;
  role: string;
  status: MarkerStatus;
  blockchainTx?: string;
  blockNumber?: number;
  temperatureC?: number;
  moisturePercent?: number;
  quantityKg?: number;
  metrics: { label: string; value: string }[];
  details: string;
}

export interface TransportRouteSegment {
  id: string;
  fromLocationId: string;
  toLocationId: string;
  fromName: string;
  toName: string;
  distanceKm: number;
  transitMethod: string;
  vehicleId?: string;
  departureTime: string;
  arrivalTime: string;
  avgTemperatureC?: number;
  status: 'completed' | 'in_transit' | 'scheduled';
  txHash?: string;
}

export interface TraceabilityBatch {
  id: string;
  batchId: string; // e.g. "HC-MH-2026-00124"
  productName: string;
  floralSource: string;
  quantityKg: number;
  harvestDate: string;
  beekeeperName: string;
  hiveId: string;
  origin: TraceabilityLocation;
  locations: TraceabilityLocation[];
  segments: TransportRouteSegment[];
  currentStageIndex: number;
  totalDistanceKm: number;
  blockchainContract: string;
  isOrganicCertified: boolean;
  qrCodeUrl?: string;
}

export type ViewDisplayMode = 'globe' | 'map';
