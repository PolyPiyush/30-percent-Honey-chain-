/**
 * HoneyChain "Entering the Hive" Transition & Embedded Honeycomb Authentication
 * Zoom-through-cell transition, interior hive ambiance, and hexagonal login console
 */

import React, { useState } from 'react';
import { useHive } from '../../context/HiveContext';
import { UserRole } from '../../types';
import { BeeGraphic } from '../common/BeeGraphic';
import { haptics } from '../../utils/haptics';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, KeyRound, Sparkles } from 'lucide-react';

export const EnteringTransition: React.FC = () => {
  const { setSelectedRole, selectedRole, loginAsDemo, exitToOutside, showToast } = useHive();
  const [email, setEmail] = useState('rajesh.patil@honeychain.agri');
  const [password, setPassword] = useState('••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Role descriptions for context
  const roles: { role: UserRole; title: string; color: string; desc: string }[] = [
    {
      role: 'BEEKEEPER',
      title: 'Beekeeper',
      color: '#f59e0b',
      desc: 'Apiary telemetry, queen acoustics & harvest minting',
    },
    {
      role: 'PROCESSOR',
      title: 'Processor',
      color: '#10b981',
      desc: 'Cold extraction, micro-filtration & lab certificates',
    },
    {
      role: 'DISTRIBUTOR',
      title: 'Distributor',
      color: '#3b82f6',
      desc: 'Cold chain transit, GPS telematics & custody handoffs',
    },
    {
      role: 'CONSUMER',
      title: 'Consumer',
      color: '#ec4899',
      desc: 'QR verification, origin storytelling & lab authenticity',
    },
    {
      role: 'ADMIN',
      title: 'Admin / Inspector',
      color: '#8b5cf6',
      desc: 'Smart contract governance, oracle feeds & audit logs',
    },
  ];

  const handleRoleChange = (role: UserRole) => {
    haptics.tap();
    setSelectedRole(role);
    if (role === 'BEEKEEPER') setEmail('rajesh.patil@honeychain.agri');
    else if (role === 'PROCESSOR') setEmail('sunita.k@westernghatsfoods.in');
    else if (role === 'DISTRIBUTOR') setEmail('v.mehta@agricoldlogistics.com');
    else if (role === 'CONSUMER') setEmail('ananya.sharma@example.com');
    else if (role === 'ADMIN') setEmail('admin@honeychain.network');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    haptics.buttonClick();
    setIsSubmitting(true);
    try {
      await loginAsDemo(selectedRole);
    } catch {
      haptics.warning();
      showToast('Authentication failed. Check credentials.', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Environment glow depending on selected role
  const activeColor = roles.find((r) => r.role === selectedRole)?.color || '#f59e0b';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0c0703] flex items-center justify-center px-4 select-none">
      {/* Dynamic Role Background Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-700 ease-in-out"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activeColor}15 0%, #120903 50%, #060301 100%)`,
        }}
      />

      {/* Floating Ambient Bees in the Hive Interior */}
      <div className="absolute top-[18%] left-[12%] animate-float-gentle opacity-75 pointer-events-none">
        <BeeGraphic size={38} glow={false} />
      </div>
      <div
        className="absolute bottom-[22%] right-[14%] animate-float-gentle opacity-60 pointer-events-none"
        style={{ animationDelay: '1.5s' }}
      >
        <BeeGraphic size={32} glow={false} />
      </div>
      <div
        className="absolute top-[70%] left-[20%] animate-float-gentle opacity-50 pointer-events-none"
        style={{ animationDelay: '2.5s' }}
      >
        <BeeGraphic size={26} glow={false} />
      </div>

      {/* Honeycomb Interior Cell Frame Backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <svg
          className="w-[700px] h-[700px] max-w-none text-amber-500/20"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="50 2, 95 26, 95 74, 50 98, 5 74, 5 26"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2 4"
          />
          <polygon
            points="50 10, 87 29, 87 71, 50 90, 13 71, 13 29"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Back to Exterior button */}
      <button
        onClick={exitToOutside}
        className="absolute top-6 left-6 z-30 text-xs font-mono tracking-wider text-amber-300/70 hover:text-amber-200 transition-colors flex items-center gap-1.5 py-1.5 px-3 rounded border border-amber-900/50 bg-black/40 backdrop-blur-sm cursor-pointer"
      >
        <span>← Exit Hive (Outside)</span>
      </button>

      {/* Embedded Honeycomb Authentication Console */}
      <div className="relative z-10 w-full max-w-lg mx-auto">
        <div className="relative rounded-2xl border border-amber-500/30 bg-[#160d05]/90 backdrop-blur-xl p-6 sm:p-8 shadow-[0_12px_45px_rgba(0,0,0,0.8),0_0_50px_rgba(245,158,11,0.15)]">
          {/* Hexagonal Honey Header Badge */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3">
              <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-inner">
                <BeeGraphic size={36} glow={true} />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display mb-1">
              Welcome Back, Keeper
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/70">
              Enter the hive and manage your honey ecosystem.
            </p>
          </div>

          {/* Interactive Role Selection */}
          <div className="mb-6">
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300/70 mb-2">
              Select Keeper Role:
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 bg-black/40 rounded-lg border border-amber-950">
              {roles.map((r) => {
                const isSelected = selectedRole === r.role;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleRoleChange(r.role)}
                    className={`px-2 py-2 rounded text-xs font-medium tracking-tight transition-all duration-200 text-center whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                        : 'text-amber-200/60 hover:text-amber-100 hover:bg-amber-950/40'
                    }`}
                  >
                    {r.title}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-amber-300/50 mt-1.5 italic text-center">
              {roles.find((r) => r.role === selectedRole)?.desc}
            </p>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-amber-200/80 mb-1.5">
                Email / Keeper Identifier
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-amber-900/60 rounded-lg text-sm text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all font-mono"
                  placeholder="keeper@honeychain.agri"
                />
                <Mail className="w-4 h-4 text-amber-500/60 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-amber-200/80 mb-1.5">
                Cryptographic Key / Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-amber-900/60 rounded-lg text-sm text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all font-mono"
                  placeholder="••••••••••••"
                />
                <KeyRound className="w-4 h-4 text-amber-500/60 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-sm tracking-wide transition-all shadow-[0_4px_18px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Enter Hive</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  haptics.buttonClick();
                  loginAsDemo(selectedRole);
                }}
                className="w-full py-2 px-4 rounded-lg border border-amber-500/30 hover:border-amber-500/60 bg-amber-950/20 hover:bg-amber-950/40 text-amber-200 text-xs font-medium tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Continue as Demo ({roles.find((r) => r.role === selectedRole)?.title})</span>
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="mt-5 pt-4 border-t border-amber-900/40 flex items-center justify-between text-[11px] text-amber-400/60">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Tamper-Evident Ledger
            </span>
            <span>Polygon Amoy · NPOP Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
