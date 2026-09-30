/**
 * HoneyChain Application State Context
 * Handles immersive 3D honeycomb navigation, roles, persistent batch state,
 * and automated Live Demo Mode.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { User, UserRole, Hive, HoneyBatch, Alert } from '../types';
import { apiService } from '../services/api';
import { haptics } from '../utils/haptics';

export type ViewMode = 'outside' | 'entering' | 'dashboard' | 'module';

export type HiveModule =
  | 'traceability'
  | 'monitoring'
  | 'blockchain'
  | 'qr_consumer'
  | 'ai_intelligence'
  | 'supply_chain'
  | 'beekeeper'
  | 'analytics'
  | 'oracle_pipeline'
  | 'system_overview';

export interface LiveDemoStepInfo {
  step: number;
  title: string;
  description: string;
  moduleTarget: HiveModule;
}

export const LIVE_DEMO_STEPS: LiveDemoStepInfo[] = [
  {
    step: 1,
    title: '1. IoT Sensor Telemetry Ingestion',
    description: 'Hive #MH-024 probes stream real-time temperature, weight, and acoustic readings.',
    moduleTarget: 'monitoring',
  },
  {
    step: 2,
    title: '2. The Digital Nervous System',
    description: 'Physical hive sensor telemetry streams through edge IoT Gateway toward Oracle Verification.',
    moduleTarget: 'oracle_pipeline',
  },
  {
    step: 3,
    title: '3. Oracle Verification Gateway',
    description: 'Cryptographic Oracle gate scans packet, checks tolerances, verifies secp256k1 signature, and splits paths.',
    moduleTarget: 'oracle_pipeline',
  },
  {
    step: 4,
    title: '4. Smart Contract State Transition',
    description: 'HoneyChainTraceability.sol verifies state invariants on Polygon Amoy Testnet.',
    moduleTarget: 'blockchain',
  },
  {
    step: 5,
    title: '5. Immutable Block Mined & Sealed',
    description: 'Block #182906 is permanently sealed with Merkle state commitment.',
    moduleTarget: 'blockchain',
  },
  {
    step: 6,
    title: '6. The Living Chain Link Illuminates',
    description: 'Physical supply chain link validates custody handoff from Apiary to Cold Logistics.',
    moduleTarget: 'supply_chain',
  },
  {
    step: 7,
    title: '7. 3D Globe Follows Honey Journey',
    description: 'Camera travels along the golden arc across Maharashtra coordinates.',
    moduleTarget: 'traceability',
  },
  {
    step: 8,
    title: '8. Robotic AI Bee Inspects Colony',
    description: 'HIVE AI hovers over acoustic streams and validates zero swarming or pathogen risk.',
    moduleTarget: 'ai_intelligence',
  },
  {
    step: 9,
    title: '9. Consumer Scans QR Honey Portal',
    description: 'Consumer verifies authenticity, cold extraction, and 100% purity certification.',
    moduleTarget: 'qr_consumer',
  },
];

interface HiveContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeModule: HiveModule;
  setActiveModule: (mod: HiveModule) => void;
  enterHive: () => void;
  zoomIntoModule: (mod: HiveModule) => void;
  exitToDashboard: () => void;
  exitToOutside: () => void;
  currentUser: User | null;
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  loginAsDemo: (role?: UserRole) => Promise<void>;
  logout: () => void;
  hives: Hive[];
  activeHiveId: string;
  setActiveHiveId: (id: string) => void;
  batches: HoneyBatch[];
  selectedBatchId: string;
  setSelectedBatchId: (id: string) => void;
  batchModalOpen: boolean;
  setBatchModalOpen: (open: boolean) => void;
  alerts: Alert[];
  unreadAlertsCount: number;
  markAlertRead: (id: string) => Promise<void>;
  isLiveSimulationActive: boolean;
  toggleLiveSimulation: () => void;
  refreshData: () => Promise<void>;
  apiDocsOpen: boolean;
  setApiDocsOpen: (open: boolean) => void;
  // Live Demo Mode
  isLiveDemoRunning: boolean;
  liveDemoStep: number;
  startLiveDemo: () => void;
  pauseLiveDemo: () => void;
  toggleLiveDemo: () => void;
  setLiveDemoStep: (step: number) => void;
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const HiveContext = createContext<HiveContextType | undefined>(undefined);

export const HiveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('outside');
  const [activeModule, setActiveModule] = useState<HiveModule>('traceability');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('BEEKEEPER');
  const [hives, setHives] = useState<Hive[]>([]);
  const [activeHiveId, setActiveHiveId] = useState<string>('hive-mh-024');
  const [batches, setBatches] = useState<HoneyBatch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('HC-2026-MH-00124');
  const [batchModalOpen, setBatchModalOpen] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLiveSimulationActive, setIsLiveSimulationActive] = useState<boolean>(true);
  const [apiDocsOpen, setApiDocsOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Live Demo Mode State
  const [isLiveDemoRunning, setIsLiveDemoRunning] = useState<boolean>(false);
  const [liveDemoStep, setLiveDemoStep] = useState<number>(1);
  const demoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const refreshData = async () => {
    try {
      const [fetchedHives, fetchedBatches, fetchedAlerts] = await Promise.all([
        apiService.getHives().catch(() => []),
        apiService.getBatches().catch(() => []),
        apiService.getAlerts().catch(() => []),
      ]);

      if (fetchedHives.length > 0) setHives(fetchedHives);
      if (fetchedBatches.length > 0) setBatches(fetchedBatches);
      if (fetchedAlerts.length > 0) setAlerts(fetchedAlerts);
    } catch (err) {
      console.error('Error refreshing HoneyChain data:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Periodic sensor simulation
  useEffect(() => {
    if (!isLiveSimulationActive || hives.length === 0) return;

    const interval = setInterval(() => {
      setHives((prevHives) =>
        prevHives.map((hive) => {
          if (hive.id === 'hive-mh-024') {
            const tempDelta = (Math.random() - 0.49) * 0.08;
            const newTemp = Number(Math.max(33.6, Math.min(34.8, hive.currentTemp + tempDelta)).toFixed(2));
            return {
              ...hive,
              currentTemp: newTemp,
            };
          }
          return hive;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveSimulationActive, hives.length]);

  // Automated Live Demo Engine
  useEffect(() => {
    if (!isLiveDemoRunning) {
      if (demoTimerRef.current) clearInterval(demoTimerRef.current);
      return;
    }

    demoTimerRef.current = setInterval(() => {
      setLiveDemoStep((prev) => {
        const nextStep = prev >= LIVE_DEMO_STEPS.length ? 1 : prev + 1;
        const target = LIVE_DEMO_STEPS.find((s) => s.step === nextStep);
        if (target) {
          setActiveModule(target.moduleTarget);
          if (viewMode !== 'module') setViewMode('module');
        }
        return nextStep;
      });
    }, 6000);

    return () => {
      if (demoTimerRef.current) clearInterval(demoTimerRef.current);
    };
  }, [isLiveDemoRunning, viewMode]);

  const startLiveDemo = () => {
    haptics.medium();
    setIsLiveDemoRunning(true);
    setLiveDemoStep(1);
    const first = LIVE_DEMO_STEPS[0];
    setActiveModule(first.moduleTarget);
    setViewMode('module');
    showToast('Live Ecosystem Demo initialized. Stepping through life cycle.', 'success');
  };

  const pauseLiveDemo = () => {
    haptics.light();
    setIsLiveDemoRunning(false);
    showToast('Live Demo paused.', 'info');
  };

  const toggleLiveDemo = () => {
    if (isLiveDemoRunning) pauseLiveDemo();
    else startLiveDemo();
  };

  const enterHive = () => {
    haptics.heavy();
    setViewMode('entering');
  };

  const zoomIntoModule = (mod: HiveModule) => {
    haptics.medium();
    setActiveModule(mod);
    setViewMode('module');
  };

  const exitToDashboard = () => {
    haptics.light();
    setViewMode('dashboard');
  };

  const exitToOutside = () => {
    haptics.heavy();
    setViewMode('outside');
  };

  const loginAsDemo = async (role: UserRole = selectedRole) => {
    try {
      const email = `${role.toLowerCase()}@honeychain.network`;
      const res = await apiService.login(email, role);
      setCurrentUser(res.user);
      setSelectedRole(role);
      setViewMode('dashboard');
      haptics.success();
      showToast(`Welcome Keeper Rajesh. Authenticated as ${role}`, 'success');
    } catch {
      setCurrentUser({
        id: `usr-${role.toLowerCase()}`,
        name: role === 'BEEKEEPER' ? 'Rajesh Patil' : `${role} Operator`,
        email: `${role.toLowerCase()}@honeychain.network`,
        role,
        organization: 'Sahyadri Organic Bee Collective',
        walletAddress: '0x71C...49b2',
        createdAt: new Date().toISOString(),
      });
      setSelectedRole(role);
      setViewMode('dashboard');
      haptics.success();
      showToast(`Logged in as ${role} (Demo)`, 'success');
    }
  };

  const logout = () => {
    haptics.medium();
    setCurrentUser(null);
    setViewMode('entering');
    showToast('Signed out of the Hive session', 'info');
  };

  const markAlertRead = async (id: string) => {
    haptics.light();
    try {
      await apiService.markAlertRead(id);
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
      showToast('Alert acknowledged', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  const toggleLiveSimulation = () => {
    haptics.light();
    setIsLiveSimulationActive((prev) => !prev);
    showToast(!isLiveSimulationActive ? 'Live IoT sensor stream resumed' : 'IoT stream paused', 'info');
  };

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <HiveContext.Provider
      value={{
        viewMode,
        setViewMode,
        activeModule,
        setActiveModule,
        enterHive,
        zoomIntoModule,
        exitToDashboard,
        exitToOutside,
        currentUser,
        selectedRole,
        setSelectedRole,
        loginAsDemo,
        logout,
        hives,
        activeHiveId,
        setActiveHiveId,
        batches,
        selectedBatchId,
        setSelectedBatchId,
        batchModalOpen,
        setBatchModalOpen,
        alerts,
        unreadAlertsCount,
        markAlertRead,
        isLiveSimulationActive,
        toggleLiveSimulation,
        refreshData,
        apiDocsOpen,
        setApiDocsOpen,
        isLiveDemoRunning,
        liveDemoStep,
        startLiveDemo,
        pauseLiveDemo,
        toggleLiveDemo,
        setLiveDemoStep,
        toast,
        showToast,
      }}
    >
      {children}
    </HiveContext.Provider>
  );
};

export const useHive = (): HiveContextType => {
  const context = useContext(HiveContext);
  if (!context) {
    throw new Error('useHive must be used within a HiveProvider');
  }
  return context;
};
