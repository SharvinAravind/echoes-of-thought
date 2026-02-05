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
    const count = 150; // Dense snowflake effect for maximum visibility

    for (let i = 0; i < count; i++) {
      const snowflake = document.createElement('div');
      const size = Math.random() * 8 + 4; // Larger: 4-12px for better visibility
      const opacity = Math.random() * 0.3 + 0.7; // More visible: 0.7-1.0
      const duration = Math.random() * 15 + 8; // Smoother: 8-23s for gentle fall
      const delay = Math.random() * 10;
      const drift = Math.random() * 100 - 50; // More horizontal movement
      const startX = Math.random() * 100;
      
      snowflake.className = 'snowflake-enhanced';
      snowflake.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 40%, rgba(255, 255, 255, 0.6) 100%);
        border-radius: 50%;
        left: ${startX}%;
        top: -20px;
        opacity: ${opacity};
        pointer-events: none;
        animation: snowfall-enhanced ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
        --drift: ${drift}px;
        box-shadow: 
          0 0 ${size * 4}px rgba(255, 255, 255, 0.9), 
          0 0 ${size * 2}px rgba(255, 255, 255, 0.7), 
          0 0 ${size}px rgba(255, 255, 255, 0.5),
          inset 0 0 ${size * 0.5}px rgba(255, 255, 255, 0.4);
        filter: blur(${Math.random() * 0.2}px);
        z-index: 9999;
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
            transform: translateY(-10px) translateX(0) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          8% {
            opacity: 0.9;
            transform: translateY(8vh) translateX(calc(var(--drift) * 0.1)) rotate(30deg) scale(1);
          }
          25% {
            transform: translateY(25vh) translateX(calc(var(--drift) * 0.3)) rotate(90deg) scale(1);
            opacity: 0.85;
          }
          50% {
            transform: translateY(50vh) translateX(calc(var(--drift) * 0.5)) rotate(180deg) scale(1);
            opacity: 0.75;
          }
          75% {
            transform: translateY(75vh) translateX(calc(var(--drift) * 0.8)) rotate(270deg) scale(1);
            opacity: 0.6;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(105vh) translateX(var(--drift)) rotate(360deg) scale(0.9);
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
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ 
        background: 'transparent',
        zIndex: 9999,
      }}
      aria-hidden="true"
    />
  );
};
