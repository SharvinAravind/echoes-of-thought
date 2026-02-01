import { useEffect, useRef } from 'react';

interface SnowEffectProps {
  enabled: boolean;
}

export const SnowEffect = ({ enabled }: SnowEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const snowflakes: HTMLDivElement[] = [];
    const count = 50;

    for (let i = 0; i < count; i++) {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.style.cssText = `
        position: absolute;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: radial-gradient(circle, hsl(var(--primary) / 0.8) 0%, hsl(var(--primary) / 0.2) 100%);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: -20px;
        opacity: ${Math.random() * 0.6 + 0.4};
        pointer-events: none;
        animation: snowfall ${Math.random() * 5 + 5}s linear infinite;
        animation-delay: ${Math.random() * 5}s;
        filter: blur(${Math.random() * 1}px);
        box-shadow: 0 0 10px hsl(var(--primary) / 0.3);
      `;
      container.appendChild(snowflake);
      snowflakes.push(snowflake);
    }

    return () => {
      snowflakes.forEach(s => s.remove());
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    />
  );
};
