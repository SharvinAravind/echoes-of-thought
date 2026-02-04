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
    const count = 120; // More snowflakes for denser effect

    for (let i = 0; i < count; i++) {
      const snowflake = document.createElement('div');
      const size = Math.random() * 4 + 2; // Slightly larger: 2-6px
      const opacity = Math.random() * 0.6 + 0.3; // More visible: 0.3-0.9
      const duration = Math.random() * 10 + 8; // Slower: 8-18s for smooth fall
      const delay = Math.random() * 10;
      const drift = Math.random() * 60 - 30; // More horizontal drift
      const startX = Math.random() * 100;
      
      snowflake.className = 'snowflake-enhanced';
      snowflake.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 40%, rgba(255, 255, 255, 0.2) 100%);
        border-radius: 50%;
        left: ${startX}%;
        top: -10px;
        opacity: ${opacity};
        pointer-events: none;
        animation: snowfall-enhanced ${duration}s linear infinite;
        animation-delay: ${delay}s;
        --drift: ${drift}px;
        box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.5), 0 0 ${size}px rgba(255, 255, 255, 0.3);
        filter: blur(${Math.random() * 0.5}px);
      `;
      container.appendChild(snowflake);
      snowflakes.push(snowflake);
    }

    // Add CSS animation if not exists
    if (!document.getElementById('snowfall-enhanced-style')) {
      const style = document.createElement('style');
      style.id = 'snowfall-enhanced-style';
      style.textContent = `
        @keyframes snowfall-enhanced {
          0% {
            transform: translateY(-10px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(50vh) translateX(calc(var(--drift) / 2)) rotate(180deg);
            opacity: 0.6;
          }
          85% {
            opacity: 0.4;
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
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    />
  );
};
