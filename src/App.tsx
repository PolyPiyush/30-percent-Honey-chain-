/**
 * HoneyChain Main Application Container
 * Immersive dynamic navigation across the Hive lifecycle
 */

import React from 'react';
import { HiveProvider, useHive } from './context/HiveContext';
import { LandingExperience } from './components/landing/LandingExperience';
import { EnteringTransition } from './components/landing/EnteringTransition';
import { HoneycombDashboard } from './components/dashboard/HoneycombDashboard';
import { TopBar } from './components/navigation/TopBar';
import { TraceabilityModule } from './components/modules/TraceabilityModule';
import { HiveMonitoringModule } from './components/modules/HiveMonitoringModule';
import { BlockchainLedgerModule } from './components/modules/BlockchainLedgerModule';
import { ConsumerQRModule } from './components/modules/ConsumerQRModule';
import { AIInsightsModule } from './components/modules/AIInsightsModule';
import { SupplyChainModule } from './components/modules/SupplyChainModule';
import { BeekeeperModule } from './components/modules/BeekeeperModule';
import { AnalyticsModule } from './components/modules/AnalyticsModule';
import { OraclePipelineModule } from './components/modules/OraclePipelineModule';
import { SystemOverviewModule } from './components/modules/SystemOverviewModule';
import { PersistentBatchBadge } from './components/common/PersistentBatchBadge';
import { LiveDemoController } from './components/common/LiveDemoController';
import { ApiDocsDrawer } from './components/common/ApiDocsDrawer';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const HiveApp: React.FC = () => {
  const { viewMode, activeModule, toast } = useHive();

  return (
    <div className="min-h-screen bg-[#090502] text-[#f7e7ce] flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border bg-[#140b04]/95 backdrop-blur-md shadow-2xl text-xs font-mono transition-all animate-bounce">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
          <span className="text-white">{toast.message}</span>
        </div>
      )}

      {/* View Mode Switching */}
      {viewMode === 'outside' && <LandingExperience />}

      {viewMode === 'entering' && <EnteringTransition />}

      {(viewMode === 'dashboard' || viewMode === 'module') && (
        <div className="flex-1 flex flex-col">
          <TopBar />

          <main className="flex-1 flex flex-col">
            {viewMode === 'dashboard' && <HoneycombDashboard />}

            {viewMode === 'module' && (
              <div className="flex-1 py-4 animate-in fade-in zoom-in-95 duration-200">
                {activeModule === 'traceability' && <TraceabilityModule />}
                {activeModule === 'monitoring' && <HiveMonitoringModule />}
                {activeModule === 'blockchain' && <BlockchainLedgerModule />}
                {activeModule === 'qr_consumer' && <ConsumerQRModule />}
                {activeModule === 'ai_intelligence' && <AIInsightsModule />}
                {activeModule === 'supply_chain' && <SupplyChainModule />}
                {activeModule === 'beekeeper' && <BeekeeperModule />}
                {activeModule === 'analytics' && <AnalyticsModule />}
                {activeModule === 'oracle_pipeline' && <OraclePipelineModule />}
                {activeModule === 'system_overview' && <SystemOverviewModule />}
              </div>
            )}
          </main>

          {/* Persistent Cross-Module Batch Identifier */}
          <PersistentBatchBadge />

          {/* SIH Live Demo Automated Traverse Controller */}
          <LiveDemoController />
        </div>
      )}

      {/* Global Interactive REST API & Swagger Specs Drawer */}
      <ApiDocsDrawer />
    </div>
  );
};

export default function App() {
  return (
    <HiveProvider>
      <HiveApp />
    </HiveProvider>
  );
}
