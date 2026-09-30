/**
 * HoneyChain In-Memory Database Layer & State Machine
 * Scalable architecture with validation, idempotency, and audit logging
 */

import {
  User,
  Apiary,
  Hive,
  SensorReading,
  Harvest,
  HoneyBatch,
  BatchStatus,
  ProcessingRecord,
  QualityTest,
  SupplyChainEvent,
  BlockchainBlock,
  BlockchainTransaction,
  Alert,
  AIAnalysis,
  UserRole,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_APIARIES,
  INITIAL_HIVES,
  INITIAL_READINGS,
  INITIAL_HARVESTS,
  INITIAL_BATCHES,
  INITIAL_PROCESSING_RECORDS,
  INITIAL_QUALITY_TESTS,
  INITIAL_SUPPLY_CHAIN_EVENTS,
  INITIAL_BLOCKS,
  INITIAL_TRANSACTIONS,
  INITIAL_ALERTS,
  INITIAL_AI_INSIGHTS,
} from './mockData';

export interface AuditRecord {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actor: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

class HoneyChainDatabase {
  private users: User[] = [...INITIAL_USERS];
  private apiaries: Apiary[] = [...INITIAL_APIARIES];
  private hives: Hive[] = [...INITIAL_HIVES];
  private readings: SensorReading[] = [...INITIAL_READINGS];
  private harvests: Harvest[] = [...INITIAL_HARVESTS];
  private batches: HoneyBatch[] = [...INITIAL_BATCHES];
  private processingRecords: ProcessingRecord[] = [...INITIAL_PROCESSING_RECORDS];
  private qualityTests: QualityTest[] = [...INITIAL_QUALITY_TESTS];
  private supplyChainEvents: SupplyChainEvent[] = [...INITIAL_SUPPLY_CHAIN_EVENTS];
  private blocks: BlockchainBlock[] = [...INITIAL_BLOCKS];
  private transactions: BlockchainTransaction[] = [...INITIAL_TRANSACTIONS];
  private alerts: Alert[] = [...INITIAL_ALERTS];
  private aiInsights: Record<string, AIAnalysis> = { ...INITIAL_AI_INSIGHTS };
  private auditLogs: AuditRecord[] = [];
  private idempotencyKeys: Set<string> = new Set();

  private allowedTransitions: Record<BatchStatus, BatchStatus[]> = {
    CREATED: ['HARVESTED'],
    HARVESTED: ['PROCESSING'],
    PROCESSING: ['QUALITY_CHECK'],
    QUALITY_CHECK: ['CERTIFIED'],
    CERTIFIED: ['PACKAGED'],
    PACKAGED: ['IN_TRANSIT'],
    IN_TRANSIT: ['DISTRIBUTED'],
    DISTRIBUTED: ['RETAIL'],
    RETAIL: ['SOLD'],
    SOLD: [],
  };

  constructor() {
    this.recordAudit('SYSTEM_BOOTSTRAP', 'DATABASE', 'root', 'SYSTEM', { status: 'INITIALIZED' });
  }

  // --- Audit Log ---
  public recordAudit(action: string, entityType: string, entityId: string, actor: string, details?: Record<string, unknown>) {
    const record: AuditRecord = {
      id: `adt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      action,
      entityType,
      entityId,
      actor,
      timestamp: new Date().toISOString(),
      details,
    };
    this.auditLogs.unshift(record);
    if (this.auditLogs.length > 500) this.auditLogs.pop();
    return record;
  }

  public getAuditLogs() {
    return this.auditLogs;
  }

  // --- Idempotency ---
  public checkAndRegisterIdempotencyKey(key?: string): boolean {
    if (!key) return true;
    if (this.idempotencyKeys.has(key)) {
      return false;
    }
    this.idempotencyKeys.add(key);
    return true;
  }

  // --- Users & Auth ---
  public getUsers() {
    return this.users;
  }

  public getUserById(id: string) {
    return this.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(userData: { name: string; email: string; role: UserRole; organization?: string }) {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      organization: userData.organization || 'Independent HoneyChain Participant',
      walletAddress: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    this.recordAudit('USER_CREATED', 'USER', newUser.id, newUser.email);
    return newUser;
  }

  // --- Apiaries & Hives ---
  public getApiaries() {
    return this.apiaries;
  }

  public getApiaryById(id: string) {
    return this.apiaries.find((a) => a.id === id);
  }

  public getHives() {
    return this.hives;
  }

  public getHiveById(id: string) {
    return this.hives.find((h) => h.id === id);
  }

  public updateHive(id: string, updates: Partial<Hive>) {
    const hive = this.getHiveById(id);
    if (!hive) return null;
    Object.assign(hive, updates);
    this.recordAudit('HIVE_UPDATED', 'HIVE', id, 'SYSTEM', updates);
    return hive;
  }

  // --- IoT Readings & Validation ---
  public addSensorReading(reading: {
    hiveId: string;
    sensorId?: string;
    temperature: number;
    humidity: number;
    weight: number;
    batteryLevel?: number;
    timestamp?: string;
  }) {
    // Validation: Reject impossible physical sensor values
    if (reading.temperature < -20 || reading.temperature > 65) {
      throw new Error('Sensor temperature outside physical biological bounds (-20°C to +65°C)');
    }
    if (reading.humidity < 0 || reading.humidity > 100) {
      throw new Error('Humidity must be between 0% and 100%');
    }
    if (reading.weight < 0 || reading.weight > 300) {
      throw new Error('Hive weight must be non-negative and under 300kg');
    }

    const hive = this.getHiveById(reading.hiveId);
    if (!hive) {
      throw new Error(`Hive not found with ID ${reading.hiveId}`);
    }

    const newReading: SensorReading = {
      id: `rd-${Date.now()}`,
      hiveId: reading.hiveId,
      sensorId: reading.sensorId || `sens-${reading.hiveId}`,
      temperature: Number(reading.temperature.toFixed(2)),
      humidity: Number(reading.humidity.toFixed(1)),
      weight: Number(reading.weight.toFixed(2)),
      batteryLevel: reading.batteryLevel ?? hive.batteryLevel,
      timestamp: reading.timestamp || new Date().toISOString(),
    };

    this.readings.push(newReading);

    // Update hive current readings
    hive.currentTemp = newReading.temperature;
    hive.currentHumidity = newReading.humidity;
    hive.currentWeight = newReading.weight;
    if (reading.batteryLevel !== undefined) hive.batteryLevel = reading.batteryLevel;

    // Automated anomaly detection & alert generation
    if (newReading.temperature > 36.5) {
      hive.healthStatus = 'WARNING';
      this.createAlert({
        hiveId: hive.id,
        hiveNumber: hive.hiveNumber,
        type: 'HIGH_TEMPERATURE',
        severity: 'WARNING',
        title: `High Temperature Alert in ${hive.hiveNumber}`,
        message: `Current temp is ${newReading.temperature}°C, which exceeds normal brood thermoregulation.`,
      });
    } else if (newReading.temperature < 31.0) {
      hive.healthStatus = 'WARNING';
      this.createAlert({
        hiveId: hive.id,
        hiveNumber: hive.hiveNumber,
        type: 'POSSIBLE_ANOMALY',
        severity: 'WARNING',
        title: `Low Temperature in ${hive.hiveNumber}`,
        message: `Chamber temp dropped to ${newReading.temperature}°C, potential insulation or cluster issue.`,
      });
    }

    return newReading;
  }

  public getReadingsByHiveId(hiveId: string) {
    return this.readings.filter((r) => r.hiveId === hiveId);
  }

  public getLatestReadingByHiveId(hiveId: string) {
    const hiveReadings = this.getReadingsByHiveId(hiveId);
    return hiveReadings[hiveReadings.length - 1] || null;
  }

  // --- Alerts ---
  public getAlerts() {
    return this.alerts;
  }

  public createAlert(alertData: Omit<Alert, 'id' | 'timestamp' | 'read'>) {
    const alert: Alert = {
      ...alertData,
      id: `alt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    this.alerts.unshift(alert);
    this.recordAudit('ALERT_CREATED', 'ALERT', alert.id, 'IOT_MONITOR', { type: alert.type });
    return alert;
  }

  public markAlertRead(id: string) {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.read = true;
    }
    return alert;
  }

  // --- AI Insights ---
  public getAIInsights(hiveId: string): AIAnalysis {
    if (this.aiInsights[hiveId]) {
      return this.aiInsights[hiveId];
    }
    const hive = this.getHiveById(hiveId);
    const fallback: AIAnalysis = {
      id: `ai-${hiveId}`,
      hiveId,
      riskLevel: 'LOW',
      confidence: 0.91,
      colonyHealth: 'Stable / Monitored Status',
      diseaseRisk: 'Low',
      swarmingRisk: 'Low',
      productionForecast: '+8.5% Expected Seasonal Inflow',
      anomalies: [],
      recommendations: [
        'Maintain regular 14-day drone brood inspection schedule.',
        'Sensors confirm stable moisture and internal thermal balance.',
      ],
      sensorCorrelations: {
        tempTrend: `Baseline ${(hive?.currentTemp || 34.2).toFixed(1)}°C within target range`,
        weightDelta: 'Consistent steady mass',
        soundProfile: 'Baseline harmonic foraging acoustics',
      },
      generatedAt: new Date().toISOString(),
    };
    this.aiInsights[hiveId] = fallback;
    return fallback;
  }

  public analyzeHiveColony(hiveId: string) {
    const hive = this.getHiveById(hiveId);
    if (!hive) throw new Error(`Hive not found: ${hiveId}`);

    const isTempHigh = hive.currentTemp > 35.5;
    const isWeightLow = hive.currentWeight < 35.0;

    const analysis: AIAnalysis = {
      id: `ai-${Date.now()}`,
      hiveId,
      riskLevel: isTempHigh || isWeightLow ? 'MODERATE' : 'LOW',
      confidence: 0.92,
      colonyHealth: isTempHigh ? 'Elevated Thermoregulation (Attention Needed)' : 'Optimal Organic Vitality',
      diseaseRisk: 'Low',
      swarmingRisk: isTempHigh ? 'Moderate' : 'Low',
      productionForecast: isTempHigh ? '+4.1% Surplus' : '+14.6% Surplus',
      anomalies: isTempHigh ? ['Elevated chamber thermogenesis detected'] : [],
      recommendations: isTempHigh
        ? ['Inspect brood comb margins within 24h for queen swarm cells.', 'Ensure ventilation screen is clean.']
        : ['Continue regular monitoring; apiary floral conditions are optimal.'],
      sensorCorrelations: {
        tempTrend: `${hive.currentTemp.toFixed(1)}°C recorded by IoT probes`,
        weightDelta: `${hive.currentWeight.toFixed(1)} kg monitored`,
        soundProfile: `${hive.acousticFrequency} Hz acoustic telemetry`,
      },
      generatedAt: new Date().toISOString(),
    };

    this.aiInsights[hiveId] = analysis;
    this.recordAudit('AI_ANALYSIS_GENERATED', 'AI', hiveId, 'AI_ORACLE_ENGINE', { risk: analysis.riskLevel });
    return analysis;
  }

  // --- Harvests ---
  public getHarvests() {
    return this.harvests;
  }

  public getHarvestById(id: string) {
    return this.harvests.find((h) => h.id === id);
  }

  public createHarvest(data: {
    apiaryId: string;
    hiveId: string;
    beekeeperId: string;
    beekeeperName: string;
    quantityKg: number;
    floralSource: string;
    moisturePercent?: number;
    notes?: string;
  }) {
    if (data.quantityKg <= 0) {
      throw new Error('Harvest quantity must be greater than zero kg');
    }
    const apiary = this.getApiaryById(data.apiaryId);
    const hive = this.getHiveById(data.hiveId);
    if (!apiary || !hive) throw new Error('Apiary or Hive not found');

    const harvestId = `hrv-${Date.now()}`;
    const harvestNumber = `HRV-2026-MH-${String(this.harvests.length + 85).padStart(3, '0')}`;

    const newHarvest: Harvest = {
      id: harvestId,
      harvestNumber,
      apiaryId: data.apiaryId,
      apiaryName: apiary.name,
      hiveId: data.hiveId,
      hiveNumber: hive.hiveNumber,
      beekeeperId: data.beekeeperId,
      beekeeperName: data.beekeeperName,
      harvestDate: new Date().toISOString().split('T')[0],
      quantityKg: data.quantityKg,
      floralSource: data.floralSource,
      moisturePercent: data.moisturePercent ?? 17.4,
      location: `${apiary.location}, ${apiary.region}`,
      notes: data.notes,
    };

    this.harvests.unshift(newHarvest);
    this.recordAudit('HARVEST_CREATED', 'HARVEST', harvestId, data.beekeeperName, { quantityKg: data.quantityKg });
    return newHarvest;
  }

  // --- Honey Batches ---
  public getBatches() {
    return this.batches;
  }

  public getBatchById(id: string) {
    return this.batches.find((b) => b.id === id || b.batchId.toLowerCase() === id.toLowerCase());
  }

  public createBatch(data: {
    harvestId: string;
    productName: string;
    quantityKg: number;
    origin?: string;
    floralSource?: string;
    beekeeperId?: string;
    beekeeperName?: string;
  }) {
    const harvest = this.getHarvestById(data.harvestId);
    if (!harvest) throw new Error('Associated harvest not found');

    if (data.quantityKg <= 0 || data.quantityKg > harvest.quantityKg) {
      throw new Error(`Batch quantity (${data.quantityKg}kg) exceeds available harvest volume (${harvest.quantityKg}kg)`);
    }

    const batchIndex = this.batches.length + 125;
    const batchId = `HC-2026-MH-${String(batchIndex).padStart(5, '0')}`;
    const id = `btc-${Date.now()}`;

    // Blockchain registration simulation
    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const blockNumber = (this.blocks[0]?.blockNumber || 182906) + 1;

    const newBatch: HoneyBatch = {
      id,
      batchId,
      harvestId: data.harvestId,
      productName: data.productName,
      quantityKg: data.quantityKg,
      remainingKg: data.quantityKg,
      status: 'CREATED',
      beekeeperId: data.beekeeperId || harvest.beekeeperId,
      beekeeperName: data.beekeeperName || harvest.beekeeperName,
      origin: data.origin || harvest.location,
      region: harvest.apiaryName,
      floralSource: data.floralSource || harvest.floralSource,
      harvestDate: harvest.harvestDate,
      ipfsCid: `bafybei${Math.random().toString(36).substring(2, 12)}alms82q1x3p0z8w9b2k`,
      qrCodeUrl: `/verify/${batchId}`,
      blockchainTxHash: txHash,
      blockNumber,
      verifiedOnChain: true,
      contractAddress: '0x91F5B4dF0Ac77b0F01309852dB214FEBe0b93C98',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.batches.unshift(newBatch);

    // Record supply chain event
    this.recordSupplyChainEvent({
      batchId: newBatch.id,
      stage: 'Batch Registration',
      fromParticipant: newBatch.beekeeperName,
      toParticipant: 'HoneyChain Smart Contract',
      location: harvest.location,
      quantityKg: newBatch.quantityKg,
      status: 'CREATED',
      txHash,
      notes: 'Initial tamper-evident batch minting on Polygon Amoy Testnet.',
    });

    // Record transaction
    this.recordBlockchainTransaction({
      txHash,
      blockNumber,
      batchId: newBatch.batchId,
      event: 'MINT_BATCH',
      from: '0x71C...49b2',
      to: '0x91F5B4dF0Ac77b0F01309852dB214FEBe0b93C98',
      timestamp: new Date().toISOString(),
      status: 'CONFIRMED',
      contractAddress: '0x91F5B4dF0Ac77b0F01309852dB214FEBe0b93C98',
      gasUsed: 46200,
    });

    this.recordAudit('BATCH_CREATED', 'BATCH', newBatch.id, newBatch.beekeeperName, { batchId });
    return newBatch;
  }

  // --- Batch State Transitions & Processing ---
  public updateBatchStatus(batchId: string, nextStatus: BatchStatus, actor: string = 'Authorized Actor') {
    const batch = this.getBatchById(batchId);
    if (!batch) throw new Error(`Batch not found with ID ${batchId}`);

    const allowed = this.allowedTransitions[batch.status];
    if (!allowed.includes(nextStatus)) {
      throw new Error(`Invalid state transition: Cannot change status from ${batch.status} to ${nextStatus}`);
    }

    batch.status = nextStatus;
    batch.updatedAt = new Date().toISOString();
    this.recordAudit('BATCH_STATUS_CHANGED', 'BATCH', batch.id, actor, { from: batch.status, to: nextStatus });
    return batch;
  }

  public recordProcessing(data: {
    batchId: string;
    processorName: string;
    facility: string;
    method: string;
    maxTemperatureC: number;
    filtrationPoresMicron: number;
    notes?: string;
  }) {
    const batch = this.getBatchById(data.batchId);
    if (!batch) throw new Error('Batch not found');

    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const record: ProcessingRecord = {
      id: `prc-${Date.now()}`,
      batchId: batch.id,
      processorName: data.processorName,
      facility: data.facility,
      processingDate: new Date().toISOString().split('T')[0],
      method: data.method,
      maxTemperatureC: data.maxTemperatureC,
      filtrationPoresMicron: data.filtrationPoresMicron,
      notes: data.notes || 'Processed adhering to cold unpasteurized standard.',
      txHash,
    };

    this.processingRecords.unshift(record);
    batch.processingFacility = data.facility;
    batch.processingDate = record.processingDate;

    if (batch.status === 'CREATED' || batch.status === 'HARVESTED') {
      batch.status = 'PROCESSING';
    }

    this.recordSupplyChainEvent({
      batchId: batch.id,
      stage: 'Facility Processing',
      fromParticipant: batch.beekeeperName,
      toParticipant: data.processorName,
      location: data.facility,
      quantityKg: batch.quantityKg,
      status: 'PROCESSED',
      txHash,
      notes: `Cold filtered at ${data.maxTemperatureC}°C (${data.filtrationPoresMicron}μm micro-mesh).`,
    });

    return record;
  }

  public getProcessingRecordsByBatchId(batchId: string) {
    const batch = this.getBatchById(batchId);
    if (!batch) return [];
    return this.processingRecords.filter((p) => p.batchId === batch.id || p.batchId === batch.batchId);
  }

  // --- Quality Testing ---
  public recordQualityTest(data: {
    batchId: string;
    laboratory: string;
    moisturePercent: number;
    hmfMgKg: number;
    purityPercent: number;
    pollenAnalysis: string;
    inspectorName: string;
  }) {
    const batch = this.getBatchById(data.batchId);
    if (!batch) throw new Error('Batch not found');

    const passed = data.moisturePercent <= 20.0 && data.hmfMgKg <= 40.0 && data.purityPercent >= 98.0;
    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const certCid = `ipfs://bafybei${Math.random().toString(36).substring(2, 10)}cert90x2`;

    const test: QualityTest = {
      id: `qt-${Date.now()}`,
      batchId: batch.id,
      laboratory: data.laboratory,
      testDate: new Date().toISOString().split('T')[0],
      moisturePercent: data.moisturePercent,
      hmfMgKg: data.hmfMgKg,
      purityPercent: data.purityPercent,
      sugarProfile: {
        fructosePercent: 39.1,
        glucosePercent: 32.4,
        sucrosePercent: 1.5,
      },
      pollenAnalysis: data.pollenAnalysis,
      antibioticResidue: 'Nil / Below LOQ',
      passed,
      labCertIpfsCid: certCid,
      inspectorName: data.inspectorName,
      txHash,
    };

    this.qualityTests.unshift(test);
    batch.labCertificateCid = certCid;
    if (passed) {
      batch.status = 'CERTIFIED';
    }

    this.recordSupplyChainEvent({
      batchId: batch.id,
      stage: 'NABL Quality Certification',
      fromParticipant: 'Processing Facility',
      toParticipant: data.laboratory,
      location: data.laboratory,
      quantityKg: batch.quantityKg,
      status: passed ? 'CERTIFIED' : 'TEST_FAILED',
      txHash,
      notes: `Moisture ${data.moisturePercent}%, HMF ${data.hmfMgKg} mg/kg. ${passed ? 'Compliant with FSSAI & Agmark.' : 'Non-compliant.'}`,
    });

    return test;
  }

  public getQualityTestsByBatchId(batchId: string) {
    const batch = this.getBatchById(batchId);
    if (!batch) return [];
    return this.qualityTests.filter((q) => q.batchId === batch.id || q.batchId === batch.batchId);
  }

  // --- Supply Chain Transfers ---
  public recordSupplyChainEvent(eventData: Omit<SupplyChainEvent, 'id' | 'timestamp' | 'verified'>) {
    const event: SupplyChainEvent = {
      ...eventData,
      id: `sce-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
      verified: true,
    };
    this.supplyChainEvents.unshift(event);
    return event;
  }

  public getSupplyChainTimeline(batchId: string) {
    const batch = this.getBatchById(batchId);
    if (!batch) return [];
    return this.supplyChainEvents.filter((e) => e.batchId === batch.id || e.batchId === batch.batchId);
  }

  public transferBatch(data: {
    batchId: string;
    fromParticipant: string;
    toParticipant: string;
    location: string;
    quantityKg: number;
    notes?: string;
  }) {
    const batch = this.getBatchById(data.batchId);
    if (!batch) throw new Error('Batch not found');

    if (data.quantityKg <= 0 || data.quantityKg > batch.remainingKg) {
      throw new Error(`Requested transfer quantity (${data.quantityKg}kg) exceeds available stock (${batch.remainingKg}kg)`);
    }

    batch.remainingKg = Number((batch.remainingKg - data.quantityKg).toFixed(1));
    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    if (batch.status === 'CERTIFIED' || batch.status === 'PACKAGED') {
      batch.status = 'IN_TRANSIT';
    } else if (batch.status === 'IN_TRANSIT') {
      batch.status = 'DISTRIBUTED';
    }

    const event = this.recordSupplyChainEvent({
      batchId: batch.id,
      stage: 'Custody Transfer',
      fromParticipant: data.fromParticipant,
      toParticipant: data.toParticipant,
      location: data.location,
      quantityKg: data.quantityKg,
      status: batch.status,
      txHash,
      notes: data.notes || 'Batch transferred under monitored cold-chain telemetry.',
    });

    this.recordBlockchainTransaction({
      txHash,
      blockNumber: (this.blocks[0]?.blockNumber || 182906) + 1,
      batchId: batch.batchId,
      event: 'TRANSFER_CUSTODY',
      from: data.fromParticipant,
      to: data.toParticipant,
      timestamp: new Date().toISOString(),
      status: 'CONFIRMED',
      contractAddress: '0x91F5B4dF0Ac77b0F01309852dB214FEBe0b93C98',
      gasUsed: 49800,
    });

    return { batch, event };
  }

  // --- Blockchain Operations ---
  public getBlocks() {
    return this.blocks;
  }

  public getTransactions() {
    return this.transactions;
  }

  public getTransactionByHash(txHash: string) {
    return this.transactions.find((tx) => tx.txHash.toLowerCase() === txHash.toLowerCase());
  }

  public recordBlockchainTransaction(txData: BlockchainTransaction) {
    this.transactions.unshift(txData);

    // Simulate mining a new block if appropriate
    if (this.transactions.length % 2 === 0) {
      const lastBlock = this.blocks[0];
      const newBlock: BlockchainBlock = {
        blockNumber: (lastBlock?.blockNumber || 182906) + 1,
        timestamp: new Date().toISOString(),
        hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        prevHash: lastBlock ? lastBlock.hash : '0x000',
        transactionsCount: 2,
        validator: 'Polygon Amoy Validator #09',
        gasUsed: '1,120,400 gwei',
        merkleRoot: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        isImmutable: true,
      };
      this.blocks.unshift(newBlock);
    }

    return txData;
  }

  // --- Public Consumer Verification ---
  public verifyBatchPublic(batchId: string) {
    const batch = this.getBatchById(batchId);
    if (!batch) return null;

    const harvest = this.getHarvestById(batch.harvestId);
    const apiary = harvest ? this.getApiaryById(harvest.apiaryId) : null;
    const hive = harvest ? this.getHiveById(harvest.hiveId) : null;
    const processing = this.getProcessingRecordsByBatchId(batch.id);
    const quality = this.getQualityTestsByBatchId(batch.id);
    const timeline = this.getSupplyChainTimeline(batch.id);

    return {
      batchId: batch.batchId,
      productName: batch.productName,
      origin: batch.origin,
      region: batch.region,
      floralSource: batch.floralSource,
      harvestDate: batch.harvestDate,
      beekeeperName: batch.beekeeperName,
      apiaryName: apiary ? apiary.name : 'Sahyadri Organic Bee Sanctuary',
      hiveNumber: hive ? hive.hiveNumber : 'Hive #MH-024',
      status: batch.status,
      blockchainVerification: {
        verifiedOnChain: batch.verifiedOnChain,
        txHash: batch.blockchainTxHash,
        blockNumber: batch.blockNumber,
        contractAddress: batch.contractAddress,
        network: 'Polygon Amoy Testnet',
        ipfsCid: batch.ipfsCid,
        smartContractVerified: true,
      },
      qualityCertification: quality[0] || {
        passed: true,
        moisturePercent: 17.2,
        hmfMgKg: 11.8,
        purityPercent: 99.85,
        laboratory: 'NABL Certified Laboratory',
      },
      processing: processing[0] || {
        facility: batch.processingFacility || 'Western Ghats Agro-Processing Park',
        method: 'Cold Extraction (Unpasteurized, Raw)',
        maxTemperatureC: 36.5,
      },
      timeline: timeline.map((e) => ({
        stage: e.stage,
        from: e.fromParticipant,
        to: e.toParticipant,
        location: e.location,
        timestamp: e.timestamp,
        txHash: e.txHash,
        notes: e.notes,
        status: e.status,
      })),
    };
  }

  // --- Global Search ---
  public search(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return { batches: [], hives: [], apiaries: [], transactions: [] };

    const batches = this.batches.filter(
      (b) =>
        b.batchId.toLowerCase().includes(q) ||
        b.productName.toLowerCase().includes(q) ||
        b.beekeeperName.toLowerCase().includes(q) ||
        b.floralSource.toLowerCase().includes(q)
    );

    const hives = this.hives.filter(
      (h) => h.hiveNumber.toLowerCase().includes(q) || h.apiaryName.toLowerCase().includes(q)
    );

    const apiaries = this.apiaries.filter(
      (a) => a.name.toLowerCase().includes(q) || a.location.toLowerCase().includes(q)
    );

    const transactions = this.transactions.filter(
      (tx) => tx.txHash.toLowerCase().includes(q) || tx.batchId.toLowerCase().includes(q)
    );

    return { batches, hives, apiaries, transactions };
  }

  // --- Dashboard Aggregations ---
  public getBeekeeperDashboard(beekeeperId?: string) {
    const hives = this.hives;
    const activeAlerts = this.alerts.filter((a) => !a.read);
    const harvests = this.harvests;
    const batches = this.batches;

    const totalHoneyHarvestedKg = harvests.reduce((acc, h) => acc + h.quantityKg, 0);
    const avgTemp = Number((hives.reduce((acc, h) => acc + h.currentTemp, 0) / (hives.length || 1)).toFixed(1));
    const nominalHives = hives.filter((h) => h.healthStatus === 'NOMINAL').length;

    return {
      totalApiaries: this.apiaries.length,
      totalHives: hives.length,
      nominalHives,
      warningHives: hives.length - nominalHives,
      activeAlertsCount: activeAlerts.length,
      totalHoneyHarvestedKg,
      totalBatchesCreated: batches.length,
      averageBroodTemperature: avgTemp,
      recentAlerts: activeAlerts.slice(0, 3),
      recentHarvests: harvests.slice(0, 3),
    };
  }

  public getSupplyChainDashboard() {
    return {
      totalActiveBatches: this.batches.length,
      inTransitBatches: this.batches.filter((b) => b.status === 'IN_TRANSIT').length,
      certifiedBatches: this.batches.filter((b) => b.status === 'CERTIFIED' || b.status === 'DISTRIBUTED').length,
      totalQuantityInCirculationKg: this.batches.reduce((acc, b) => acc + b.remainingKg, 0),
      recentEvents: this.supplyChainEvents.slice(0, 5),
      blockchainBlocksMined: this.blocks.length,
    };
  }
}

export const db = new HoneyChainDatabase();
