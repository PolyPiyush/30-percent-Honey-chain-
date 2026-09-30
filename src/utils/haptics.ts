/**
 * HoneyChain Vibration API & Tactile Feedback Service
 * Provides realistic haptic pulses for mobile interactions, honeycomb cell navigation,
 * button clicks, and holographic QR verification ripples.
 */

let hapticsEnabled = true;

// Check localStorage if available
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('honeychain_haptics_enabled');
  if (stored !== null) {
    hapticsEnabled = stored === 'true';
  }
}

export const isVibrationSupported = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    'vibrate' in navigator &&
    typeof navigator.vibrate === 'function'
  );
};

export const getHapticsEnabled = (): boolean => hapticsEnabled;

export const setHapticsEnabled = (enabled: boolean): void => {
  hapticsEnabled = enabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('honeychain_haptics_enabled', String(enabled));
  }
};

export const triggerVibration = (pattern: number | number[]): boolean => {
  if (!hapticsEnabled) return false;
  if (!isVibrationSupported()) return false;
  try {
    return navigator.vibrate(pattern);
  } catch {
    return false;
  }
};

export const haptics = {
  /** Subtle 10ms micro-tick for touching or hovering over honeycomb cells */
  cellHover: () => triggerVibration(10),

  /** 35ms solid pulse when expanding/zooming into a honeycomb cell */
  cellSelect: () => triggerVibration(35),

  /** Crisp 16ms tactile tick for any button click */
  buttonClick: () => triggerVibration(16),

  /** Subtle 12ms tick for tab selections, sliders, or small chips */
  tap: () => triggerVibration(12),

  /** 20ms gentle pulse for interactive element clicks */
  light: () => triggerVibration(20),

  /** 35ms solid pulse for transitions */
  medium: () => triggerVibration(35),

  /** 60ms deep feedback when entering or exiting the hive */
  heavy: () => triggerVibration(60),

  /** Multi-pulse confirmation for blockchain verification, login, or custody handoff: [20ms vibrate, 40ms pause, 35ms vibrate] */
  success: () => triggerVibration([20, 40, 35]),

  /** Alert or broken link warning pulse: [40ms vibrate, 60ms pause, 50ms vibrate] */
  warning: () => triggerVibration([40, 60, 50]),

  /** Expanding golden ripple pattern for QR scanning: simulates waves radiating through hexagonal comb */
  ripple: () => triggerVibration([20, 30, 25, 30, 35, 35, 50, 40, 70]),

  /** Holographic QR Verification wave */
  verificationRipple: () => triggerVibration([25, 35, 30, 40, 45, 50, 75]),

  /** Escalating dynamic pulse as reverse journey advances through stages 1 to 6 */
  stageAdvance: (step: number) => {
    const dur = Math.min(50, 16 + step * 6);
    return triggerVibration([dur, 25, dur]);
  },

  /** Block mining and Merkle cryptographic sealing */
  blockchainSeal: () => triggerVibration([20, 30, 25, 40, 60]),

  /** Quick double-tap for radar telemetry pulse */
  pulse: () => triggerVibration([15, 25, 20]),

  /** Cancel any active ongoing vibration */
  cancel: () => triggerVibration(0),
};

