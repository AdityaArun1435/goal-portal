import React, { useEffect, useRef, ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 }
};

export const GlowCard: React.FC<GlowCardProps> = ({ children, className = '', glowColor = 'purple' }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', x.toFixed(2));
        cardRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', y.toFixed(2));
        cardRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
      }
    };
    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        [data-glow]::before, [data-glow]::after {
          pointer-events: none; content: ""; position: absolute;
          inset: calc(var(--border-size) * -1);
          border: var(--border-size) solid transparent;
          border-radius: calc(var(--radius) * 1px);
          background-attachment: fixed;
          background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
          background-repeat: no-repeat; background-position: 50% 50%;
          mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
          mask-clip: padding-box, border-box; mask-composite: intersect;
        }
        [data-glow]::before {
          background-image: radial-gradient(calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px), hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%);
          filter: brightness(2);
        }
        [data-glow]::after {
          background-image: radial-gradient(calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px), hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%);
        }
        [data-glow] [data-glow] { position: absolute; inset: 0; will-change: filter; opacity: var(--outer, 1); border-radius: calc(var(--radius) * 1px); border-width: calc(var(--border-size) * 20); filter: blur(calc(var(--border-size) * 10)); background: none; pointer-events: none; border: none; }
        [data-glow] > [data-glow]::before { inset: -10px; border-width: 10px; }
      `}} />
      <div
        ref={cardRef}
        data-glow
        className={`rounded-2xl relative backdrop-blur-sm ${className}`}
        style={{
          '--base': base,
          '--spread': spread,
          '--radius': '16',
          '--border': '1',
          '--backdrop': 'rgba(17,17,17,0.8)',
          '--backup-border': 'rgba(255,255,255,0.08)',
          '--size': '250',
          '--outer': '1',
          '--border-size': 'calc(var(--border, 1) * 1px)',
          '--spotlight-size': 'calc(var(--size, 150) * 1px)',
          '--hue': `calc(${base} + (var(--xp, 0) * ${spread}))`,
          backgroundImage: `radial-gradient(var(--spotlight-size) var(--spotlight-size) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px), hsl(var(--hue, 210) 100% 70% / 0.05), transparent)`,
          backgroundColor: 'var(--backdrop)',
          backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
          backgroundPosition: '50% 50%',
          backgroundAttachment: 'fixed',
          border: 'var(--border-size) solid var(--backup-border)',
          position: 'relative',
        } as any}
      >
        <div data-glow></div>
        {children}
      </div>
    </>
  );
};
