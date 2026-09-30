/**
 * HoneyChain OpenAPI / REST Endpoint Documentation Drawer
 * Allows evaluators and developers to inspect all backend routes, schemas, and execute live tests.
 */

import React, { useState } from 'react';
import { useHive } from '../../context/HiveContext';
import { X, Play, Copy, Check, BookOpen, Code2 } from 'lucide-react';

interface EndpointSpec {
  method: 'GET' | 'POST' | 'PATCH';
  path: string;
  tag: string;
  summary: string;
  sampleBody?: Record<string, unknown>;
}

export const ApiDocsDrawer: React.FC = () => {
  const { apiDocsOpen, setApiDocsOpen, showToast } = useHive();
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointSpec | null>(null);
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!apiDocsOpen) return null;

  const endpoints: EndpointSpec[] = [
    {
      method: 'GET',
      path: '/api/v1/hives',
      tag: 'Hives',
      summary: 'List all hives with real-time IoT micro-climate & acoustic parameters',
    },
    {
      method: 'POST',
      path: '/api/v1/iot/readings',
      tag: 'IoT Telemetry',
      summary: 'Ingest validated sensor reading with biological threshold screening',
      sampleBody: {
        hiveId: 'hive-mh-024',
        temperature: 34.2,
        humidity: 68.0,
        weight: 42.7,
        batteryLevel: 94,
      },
    },
    {
      method: 'POST',
      path: '/api/v1/ai/hives/hive-mh-024/analyze',
      tag: 'AI Intelligence',
      summary: 'Run AI colony vitality, swarming, and acoustic Fourier spectral analysis',
    },
    {
      method: 'GET',
      path: '/api/v1/batches',
      tag: 'Batches',
      summary: 'List immutable honey batches registered on Polygon Amoy',
    },
    {
      method: 'GET',
      path: '/api/v1/verify/HC-2026-MH-00124',
      tag: 'Consumer Verification',
      summary: 'Public consumer batch verification and full provenance history',
    },
    {
      method: 'GET',
      path: '/api/v1/blockchain/blocks',
      tag: 'Blockchain',
      summary: 'Inspect Polygon Amoy testnet finalized blocks and transactions',
    },
    {
      method: 'GET',
      path: '/api/v1/oracle/status',
      tag: 'Oracle',
      summary: 'Health status of the decentralized IoT oracle layer',
    },
    {
      method: 'GET',
      path: '/health',
      tag: 'System',
      summary: 'Comprehensive health probe (Database, Blockchain, IPFS)',
    },
  ];

  const handleTestEndpoint = async (ep: EndpointSpec) => {
    setLoading(true);
    setTestResponse(null);
    try {
      const options: RequestInit = {
        method: ep.method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (ep.method === 'POST' && ep.sampleBody) {
        options.body = JSON.stringify(ep.sampleBody);
      }

      const res = await fetch(ep.path, options);
      const data = await res.json();
      setTestResponse(JSON.stringify(data, null, 2));
      showToast(`Tested ${ep.method} ${ep.path}`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'API call failed';
      setTestResponse(JSON.stringify({ error: msg }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    if (!testResponse) return;
    navigator.clipboard.writeText(testResponse);
    setCopied(true);
    showToast('Response copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-[#0c0703] border-l border-amber-900/60 h-full overflow-y-auto p-6 flex flex-col justify-between text-xs font-mono">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-950 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white font-display">
                HoneyChain REST API Specifications
              </h2>
            </div>

            <button
              onClick={() => setApiDocsOpen(false)}
              className="p-1.5 rounded-lg text-amber-400 hover:text-white hover:bg-amber-950/40 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-amber-200/70 mb-4 font-sans text-xs">
            Standardized REST endpoints conforming to the HoneyChain backend contract. Click "Execute" to run real live queries against the active server.
          </p>

          {/* Endpoints List */}
          <div className="space-y-3">
            {endpoints.map((ep, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-amber-950 bg-black/40 hover:border-amber-900/80 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ep.method === 'GET'
                          ? 'bg-sky-950 text-sky-400 border border-sky-800/40'
                          : ep.method === 'POST'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                          : 'bg-purple-950 text-purple-400 border border-purple-800/40'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="text-white font-semibold">{ep.path}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedEndpoint(ep);
                      handleTestEndpoint(ep);
                    }}
                    disabled={loading}
                    className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    <span>Execute</span>
                  </button>
                </div>

                <p className="text-amber-300/70 font-sans text-xs">{ep.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Test Response Viewer */}
        {testResponse && (
          <div className="mt-6 pt-4 border-t border-amber-950">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                <Code2 className="w-4 h-4" />
                <span>Live Server Response ({selectedEndpoint?.path}):</span>
              </span>
              <button
                onClick={copyResponse}
                className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <pre className="p-3 rounded-lg bg-black border border-amber-950/80 text-[11px] text-emerald-300 max-h-56 overflow-y-auto whitespace-pre-wrap">
              {testResponse}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
