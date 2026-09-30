import React, { useEffect, useRef } from 'react';

interface HoneycombCanvasProps {
  intensity?: number;
  interactive?: boolean;
  mousePos?: { x: number; y: number };
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

export const HoneycombCanvas: React.FC<HoneycombCanvasProps> = ({
  intensity = 1,
  interactive = true,
  mousePos,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Floating golden pollen and honey micro-particles
    const particles: Particle[] = [];
    const particleCount = Math.floor(45 * intensity);
    const colors = ['#f59e0b', '#fbbf24', '#d97706', '#fef08a'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.15,
        alpha: Math.random() * 0.7 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Hexagon drawing helper
    const drawHexagon = (cx: number, cy: number, r: number, alpha: number, isCenter: boolean = false) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + Math.PI / 6;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      if (isCenter) {
        ctx.fillStyle = `rgba(245, 158, 11, ${0.12 * intensity})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(251, 191, 36, ${0.7 * intensity})`;
        ctx.lineWidth = 1.8;
      } else {
        ctx.fillStyle = `rgba(217, 119, 6, ${0.03 * intensity})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(245, 158, 11, ${alpha * 0.35 * intensity})`;
        ctx.lineWidth = 1.0;
      }
      ctx.stroke();
    };

    let tick = 0;

    const render = () => {
      tick += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep radial warm dark background gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, '#1c1006');
      bgGrad.addColorStop(0.5, '#120903');
      bgGrad.addColorStop(1, '#070402');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Central amber glow bloom
      const bloomGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        width * 0.4
      );
      bloomGrad.addColorStop(0, `rgba(245, 158, 11, ${0.18 * intensity})`);
      bloomGrad.addColorStop(0.6, `rgba(180, 83, 9, ${0.08 * intensity})`);
      bloomGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bloomGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Honeycomb Lattice
      const hexRadius = 48;
      const hexWidth = Math.sqrt(3) * hexRadius;
      const hexHeight = 2 * hexRadius * 0.75;
      const cols = Math.ceil(width / hexWidth) + 2;
      const rows = Math.ceil(height / hexHeight) + 2;

      const centerX = width / 2;
      const centerY = height / 2;

      for (let r = -2; r < rows; r++) {
        for (let c = -2; c < cols; c++) {
          const xOffset = (r % 2) * (hexWidth / 2);
          const x = c * hexWidth + xOffset;
          const y = r * hexHeight;

          // Distance from screen center
          const dx = x - centerX;
          const dy = y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Subtle organic ripple from center
          const wave = Math.sin(dist * 0.012 - tick) * 0.15 + 0.85;
          const falloff = Math.max(0, 1 - dist / (Math.max(width, height) * 0.65));

          if (falloff > 0.05) {
            const isCenterCell = dist < hexRadius * 1.2;
            drawHexagon(x, y, hexRadius * 0.94, falloff * wave, isCenterCell);
          }
        }
      }

      // Draw floating pollen particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(tick + i) * 0.2;
        p.y += p.vy;

        // Wrap around
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.6 + Math.sin(tick * 2 + i) * 0.4);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity, interactive, mousePos]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};
