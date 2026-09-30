/**
 * HoneyChain Frontend API Service
 * Consumes /api/v1 REST endpoints with resilient fallbacks and typed contracts
 */

import {
  ApiResponse,
  Apiary,
  Hive,
  SensorReading,
  AIAnalysis,
  Alert,
  Harvest,
  HoneyBatch,
  ProcessingRecord,
  QualityTest,
  SupplyChainEvent,
  BlockchainBlock,
  BlockchainTransaction,
  User,
  UserRole,
} from '../types';

const BASE_URL = '/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json: ApiResponse<T> = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || json.message || `Request failed with status ${res.status}`);
    }
    return json.data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const apiService = {
  // Auth
  async login(email: string, role: UserRole, password?: string): Promise<{ user: User; token: string }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, role, password }),
    });
  },

  // Apiaries & Hives
  async getApiaries(): Promise<Apiary[]> {
    return request('/apiaries');
  },

  async getHives(): Promise<Hive[]> {
    return request('/hives');
  },

  async getHive(id: string): Promise<Hive> {
    return request(`/hives/${id}`);
  },

  // IoT Sensor Ingestion & Telemetry
  async getHiveReadings(hiveId: string): Promise<SensorReading[]> {
    return request(`/hives/${hiveId}/readings`);
  },

  async ingestSensorReading(reading: {
    hiveId: string;
    temperature: number;
    humidity: number;
    weight: number;
    batteryLevel?: number;
  }): Promise<SensorReading> {
    return request('/iot/readings', {
      method: 'POST',
      body: JSON.stringify(reading),
    });
  },

  // AI Colony Health Analysis
  async getAIInsights(hiveId: string): Promise<AIAnalysis> {
    return request(`/hives/${hiveId}/insights`);
  },

  async triggerAIAnalysis(hiveId: string): Promise<AIAnalysis> {
    return request(`/ai/hives/${hiveId}/analyze`, {
      method: 'POST',
    });
  },

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    return request('/alerts');
  },

  async markAlertRead(id: string): Promise<Alert> {
    return request(`/alerts/${id}/read`, {
      method: 'PATCH',
    });
  },

  // Harvests & Batches
  async getHarvests(): Promise<Harvest[]> {
    return request('/harvests');
  },

  async createHarvest(data: {
    apiaryId: string;
    hiveId: string;
    quantityKg: number;
    floralSource: string;
    notes?: string;
  }): Promise<Harvest> {
    return request('/harvests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getBatches(): Promise<HoneyBatch[]> {
    return request('/batches');
  },

  async getBatch(id: string): Promise<HoneyBatch> {
    return request(`/batches/${id}`);
  },

  async createBatch(data: {
    harvestId: string;
    productName: string;
    quantityKg: number;
  }): Promise<HoneyBatch> {
    return request('/batches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getBatchTimeline(batchId: string): Promise<SupplyChainEvent[]> {
    return request(`/batches/${batchId}/timeline`);
  },

  async recordProcessing(
    batchId: string,
    data: {
      processorName: string;
      facility: string;
      method: string;
      maxTemperatureC: number;
      filtrationPoresMicron: number;
      notes?: string;
    }
  ): Promise<ProcessingRecord> {
    return request(`/batches/${batchId}/processing`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async recordQualityTest(
    batchId: string,
    data: {
      laboratory: string;
      moisturePercent: number;
      hmfMgKg: number;
      purityPercent: number;
      pollenAnalysis: string;
      inspectorName: string;
    }
  ): Promise<QualityTest> {
    return request(`/batches/${batchId}/quality-tests`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async transferBatch(
    batchId: string,
    data: {
      fromParticipant: string;
      toParticipant: string;
      location: string;
      quantityKg: number;
      notes?: string;
    }
  ): Promise<{ batch: HoneyBatch; event: SupplyChainEvent }> {
    return request(`/batches/${batchId}/transfers`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Public Consumer Verification
  async verifyBatch(batchId: string): Promise<any> {
    return request(`/verify/${encodeURIComponent(batchId)}`);
  },

  // Blockchain Ledger
  async getBlocks(): Promise<BlockchainBlock[]> {
    return request('/blockchain/blocks');
  },

  async getTransactions(): Promise<BlockchainTransaction[]> {
    return request('/blockchain/transactions');
  },

  // Geographic Traceability & Honey Batches API
  async getHoneyBatches(): Promise<any> {
    return request('/honey-batches');
  },

  async getHoneyBatch(id: string): Promise<any> {
    return request(`/honey-batches/${encodeURIComponent(id)}`);
  },

  async getHoneyBatchTraceability(id: string): Promise<any> {
    return request(`/honey-batches/${encodeURIComponent(id)}/traceability`);
  },

  async getHoneyBatchLocations(id: string): Promise<any> {
    return request(`/honey-batches/${encodeURIComponent(id)}/locations`);
  },

  async getHoneyBatchEvents(id: string): Promise<any> {
    return request(`/honey-batches/${encodeURIComponent(id)}/events`);
  },

  // Dashboards & Oracle
  async getBeekeeperDashboard(): Promise<any> {
    return request('/dashboard/beekeeper');
  },

  async getSupplyChainDashboard(): Promise<any> {
    return request('/dashboard/supply-chain');
  },

  async getOracleStatus(): Promise<any> {
    return request('/oracle/status');
  },

  async search(query: string): Promise<any> {
    return request(`/search?q=${encodeURIComponent(query)}`);
  },
};
