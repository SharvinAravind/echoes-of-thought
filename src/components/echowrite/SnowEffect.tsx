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
    const count = 80; // More snowflakes for smoother effect

    for (let i = 0; i < count; i++) {
      const snowflake = document.createElement('div');
      const size = Math.random() * 3 + 1; // Tiny: 1-4px
      const opacity = Math.random() * 0.4 + 0.2; // Subtle: 0.2-0.6
      const duration = Math.random() * 8 + 6; // 6-14s for smooth fall
      const delay = Math.random() * 8;
      const drift = Math.random() * 40 - 20; // Horizontal drift
      
      snowflake.className = 'snowflake-tiny';
      snowflake.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.3) 100%);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: -10px;
        opacity: ${opacity};
        pointer-events: none;
        animation: snowfall-smooth ${duration}s linear infinite;
        animation-delay: ${delay}s;
        --drift: ${drift}px;
      `;
      container.appendChild(snowflake);
      snowflakes.push(snowflake);
    }

    // Add CSS animation if not exists
    if (!document.getElementById('snowfall-smooth-style')) {
      const style = document.createElement('style');
      style.id = 'snowfall-smooth-style';
      style.textContent = `
        @keyframes snowfall-smooth {
          0% {
            transform: translateY(-10px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(100vh) translateX(var(--drift)) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
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
