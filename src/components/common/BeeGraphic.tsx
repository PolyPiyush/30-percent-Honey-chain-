import React from 'react';

interface BeeGraphicProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const BeeGraphic: React.FC<BeeGraphicProps> = ({ className = '', size = 48, glow = true }) => {
  return (
    <div
      className={`relative inline-block select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-md bg-amber-400/40 animate-pulse pointer-events-none"
          style={{ transform: 'scale(1.3)' }}
        />
      )}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10 drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Wing with Flutter Animation */}
        <g className="origin-[45px_42px] animate-[wingFlutter_0.08s_infinite_alternate]">
          <ellipse
            cx="32"
            cy="30"
            rx="18"
            ry="11"
            transform="rotate(-28 32 30)"
            fill="url(#wingGrad)"
            stroke="#fde68a"
            strokeWidth="0.8"
            opacity="0.85"
          />
          {/* Wing veins */}
          <path d="M42 36 L24 25 M36 32 L20 34 M38 34 L30 20" stroke="#fef08a" strokeWidth="0.5" opacity="0.6" />
        </g>

        {/* Right Wing with Flutter Animation */}
        <g className="origin-[55px_42px] animate-[wingFlutter_0.08s_infinite_alternate-reverse]">
          <ellipse
            cx="68"
            cy="30"
            rx="18"
            ry="11"
            transform="rotate(28 68 30)"
            fill="url(#wingGrad)"
            stroke="#fde68a"
            strokeWidth="0.8"
            opacity="0.85"
          />
          {/* Wing veins */}
          <path d="M58 36 L76 25 M64 32 L80 34 M62 34 L70 20" stroke="#fef08a" strokeWidth="0.5" opacity="0.6" />
        </g>

        {/* Legs */}
        <path d="M42 58 L34 68 M40 50 L30 54 M44 62 L38 74" stroke="#451a03" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M58 58 L66 68 M60 50 L70 54 M56 62 L62 74" stroke="#451a03" strokeWidth="2.2" strokeLinecap="round" />

        {/* Pollen Basket (Golden pellet on hind leg) */}
        <circle cx="37" cy="71" r="3.2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
        <circle cx="63" cy="71" r="3.2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />

        {/* Bee Abdomen (Striped Torpedo Body) */}
        <g>
          {/* Base amber body */}
          <ellipse cx="50" cy="62" rx="14" ry="20" fill="#f59e0b" />
          {/* Dark stripes */}
          <path d="M37 52 Q50 56 63 52" stroke="#291204" strokeWidth="3.6" strokeLinecap="round" />
          <path d="M36 60 Q50 64 64 60" stroke="#291204" strokeWidth="3.6" strokeLinecap="round" />
          <path d="M38 68 Q50 72 62 68" stroke="#291204" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M43 75 Q50 78 57 75" stroke="#291204" strokeWidth="2.4" strokeLinecap="round" />
          {/* Stinger tip */}
          <polygon points="50,83 48,81 52,81" fill="#1c0c03" />
        </g>

        {/* Thorax (Fuzzy dark brown with golden highlights) */}
        <circle cx="50" cy="45" r="11" fill="#451a03" />
        <circle cx="50" cy="45" r="9" fill="#78350f" opacity="0.8" />
        <circle cx="48" cy="43" r="6" fill="#b45309" opacity="0.7" />

        {/* Head */}
        <circle cx="50" cy="31" r="8" fill="#291204" />

        {/* Large compound eyes */}
        <ellipse cx="45" cy="30" rx="3.2" ry="4.5" fill="#110702" stroke="#f59e0b" strokeWidth="0.6" />
        <ellipse cx="55" cy="30" rx="3.2" ry="4.5" fill="#110702" stroke="#f59e0b" strokeWidth="0.6" />
        <circle cx="44.2" cy="28.8" r="0.9" fill="#fef08a" />
        <circle cx="54.2" cy="28.8" r="0.9" fill="#fef08a" />

        {/* Antennae */}
        <path d="M48 24 Q44 15 38 18" stroke="#291204" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M52 24 Q56 15 62 18" stroke="#291204" strokeWidth="1.6" strokeLinecap="round" fill="none" />

        {/* Gradients */}
        <defs>
          <linearGradient id="wingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#fef3c7" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
