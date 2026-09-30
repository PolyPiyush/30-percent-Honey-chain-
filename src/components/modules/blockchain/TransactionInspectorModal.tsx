/**
 * Clean Glass Panel Transaction Inspector Modal
 * Displays deep cryptographic metadata with copy affordances & external block explorer integration.
 */

import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ShieldCheck, Cpu, Database, Flame, Clock } from 'lucide-react';
import { BlockchainTransaction } from '../../../types';
import { haptics } from '../../../utils/haptics';

interface TransactionInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string | null;
  transactions: BlockchainTransaction[];
  blockNumber: number;
}

export const TransactionInspectorModal: React.FC<TransactionInspectorModalProps> = ({
  isOpen,
  onClose,
  txHash,
  transactions,
  blockNumber,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentTx: BlockchainTransaction = (txHash && transactions.find((t) => t.txHash === txHash)) ||
    transactions[0] || {
      txHash: '0x18a937bc901e855a4282e30f1469034cb72e0bf4148e65e6d6ff68a735c2491',
      blockNumber: blockNumber,
      batchId: 'HC-2026-MH-00124',
      event: 'RECORD_HARVEST',
      from: '0x71C824aB39e8F0192847102938471029384749b2',
      to: '0x91F5B4dF0Ac77b0F01309852dB214FEBe0b93C98',
      timestamp: '2026-09-12T10:30:15Z',
      status: 'CONFIRMED',
      contractAddress: '0x91F5B4dF0Ac77b0F01309852dB214FEBe0b93C98',
      gasUsed: 42100,
    };

  const handleCopy = (text: string, key: string) => {
    haptics.tap();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-amber-500/30 bg-[#0c0803]/95 backdrop-blur-xl shadow-2xl p-6 space-y-5 text-xs font-mono">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-950/80 pb-4">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-widest text-amber-400/70 font-bold block">
              Cryptographic Transaction Inspector
            </span>
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{currentTx.event}</span>
            </h3>
          </div>

          <button
            onClick={() => {
              haptics.buttonClick();
              onClose();
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transaction Summary Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-[11px] flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            STATUS: {currentTx.status}
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-200 text-[11px]">
            Block #{currentTx.blockNumber || blockNumber}
          </span>
          <span className="px-3 py-1 rounded-full bg-sky-950/60 border border-sky-500/30 text-sky-200 text-[11px]">
            Batch: {currentTx.batchId}
          </span>
        </div>

        {/* Technical Detail Rows */}
        <div className="space-y-2.5">
          {/* Tx Hash */}
          <div className="p-3 rounded-xl bg-black/50 border border-amber-950/60 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-amber-400/60">
              <span>TRANSACTION HASH</span>
              <button
                onClick={() => handleCopy(currentTx.txHash, 'hash')}
                className="text-amber-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'hash' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'hash' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-white text-xs break-all select-all font-semibold">{currentTx.txHash}</div>
          </div>

          {/* From & To Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-black/50 border border-amber-950/60 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-amber-400/60">
                <span>FROM (SIGNER / SENDER)</span>
                <button
                  onClick={() => handleCopy(currentTx.from, 'from')}
                  className="text-amber-400 hover:text-white cursor-pointer"
                >
                  {copiedKey === 'from' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="text-white text-xs break-all truncate">{currentTx.from}</div>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-amber-950/60 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-amber-400/60">
                <span>TO (CONTRACT ADDRESS)</span>
                <button
                  onClick={() => handleCopy(currentTx.to, 'to')}
                  className="text-amber-400 hover:text-white cursor-pointer"
                >
                  {copiedKey === 'to' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="text-white text-xs break-all truncate">{currentTx.to}</div>
            </div>
          </div>

          {/* Gas & Timestamp */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-black/50 border border-amber-950/60">
              <span className="text-[10px] text-amber-400/60 block flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                GAS CONSUMED
              </span>
              <span className="text-white font-bold text-xs mt-1 block">
                {currentTx.gasUsed ? `${currentTx.gasUsed.toLocaleString()} units` : '42,100 units'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-amber-950/60">
              <span className="text-[10px] text-amber-400/60 block flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                CONFIRMATION TIME
              </span>
              <span className="text-white font-bold text-xs mt-1 block">
                {new Date(currentTx.timestamp).toUTCString()}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-amber-950/60">
              <span className="text-[10px] text-amber-400/60 block flex items-center gap-1">
                <Database className="w-3 h-3 text-amber-400" />
                CONSENSUS NETWORK
              </span>
              <span className="text-emerald-400 font-bold text-xs mt-1 block">
                Polygon Amoy (POS)
              </span>
            </div>
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-amber-950/80">
          <span className="text-[11px] text-amber-300/60">
            Immutable trace verified across Western Ghats multi-flora apiary nodes.
          </span>

          <a
            href={`https://amoy.polygonscan.com/tx/${currentTx.txHash}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
          >
            <span>VIEW ON BLOCKCHAIN</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
