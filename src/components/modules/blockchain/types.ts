/**
 * Types & State Enums for HoneyChain Cinematic Blockchain Ledger
 */

export type LedgerCameraState =
  | 'STATE_01_OUTSIDE'       // Outside Ledger: Floating Golden Block #182904
  | 'STATE_02_APPROACHING'   // Approaching Block: Camera dollies closer
  | 'STATE_03_ENTERING'      // Entering Block: Camera enters translucent cube
  | 'STATE_04_DISASSEMBLY'   // Inside Data Layers: 4 independent floating layers
  | 'STATE_05_VERIFICATION'  // Honey Data Droplet -> Hex Stream -> Hash Collapse
  | 'STATE_06_SEALING'       // Block Sealing: Layers snap together, hexagonal seal
  | 'STATE_07_CHAIN'         // Full Blockchain: Perspective chain 182901-182906
  | 'STATE_08_INSPECTION'    // Block Inspection: Opened block with circular timeline
  | 'STATE_09_EXIT';         // Exit to Hive: Collapse to honeycomb cell

export interface BlockEventNode {
  id: string;
  stageName: string;
  title: string;
  actor: string;
  timestamp: string;
  txHash: string;
  batchId: string;
  hiveId?: string;
  metrics: { label: string; value: string }[];
  status: 'VERIFIED' | 'CONFIRMED' | 'SEALED';
  color: string;
  iconType: 'harvest' | 'lab' | 'processing' | 'packaging';
}

export interface LiveSimulationEvent {
  step: 'IDLE' | 'DROPLET_ARRIVING' | 'ORACLE_CHECK' | 'CONTRACT_EXEC' | 'BLOCK_MINED';
  batchId: string;
  hiveId: string;
  weightKg: number;
  tempC: number;
  moisturePercent: number;
  txHash: string;
  newBlockNumber: number;
}
