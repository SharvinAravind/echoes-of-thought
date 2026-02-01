import logoImage from '@/assets/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  className?: string;
  animated?: boolean;
  themeColor?: boolean;
}

const sizeClasses = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-20 w-20',
  xl: 'h-28 w-28',
  '2xl': 'h-36 w-36',
};

export const Logo = ({ 
  size = 'md', 
  showText = false, 
  className = '', 
  animated = true,
  themeColor = true 
}: LogoProps) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* 3D Logo Container */}
      <div 
        className={`
          relative ${sizeClasses[size]} 
          rounded-2xl 
          bg-gradient-to-br from-primary/20 via-transparent to-accent/20
          p-1
          ${animated ? 'animate-float' : ''}
        `}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Animated glow ring */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-60 blur-xl -z-10 animate-pulse"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.5) 0%, hsl(var(--accent) / 0.3) 50%, transparent 70%)',
            transform: 'translateZ(-20px)'
          }}
        />
        
        {/* Main logo with 3D transform */}
        <div
          className={`
            relative w-full h-full rounded-xl overflow-hidden
            shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.4)]
            transition-transform duration-500 ease-out
            hover:scale-105
            ${animated ? 'hover:rotate-y-6' : ''}
          `}
          style={{
            transform: 'rotateX(5deg) rotateY(-5deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <img 
            src={logoImage} 
            alt="EchoWrite" 
            className={`
              w-full h-full object-contain 
              mix-blend-multiply dark:mix-blend-screen 
              transition-all duration-500
              ${themeColor ? 'logo-theme-color' : ''}
            `}
            style={{
              filter: themeColor 
                ? 'drop-shadow(0 8px 20px hsl(var(--primary) / 0.4)) drop-shadow(0 4px 8px hsl(var(--accent) / 0.3)) contrast(1.1) saturate(1.1)'
                : 'drop-shadow(0 4px 6px rgba(0,0,0,0.1)) contrast(1.1) saturate(1.1)',
            }}
          />
        </div>
        
        {/* Floating shadow */}
        <div 
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full blur-lg opacity-40 -z-20"
          style={{
            background: 'hsl(var(--primary) / 0.5)'
          }}
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className="font-display text-2xl font-bold tracking-tight text-foreground drop-shadow-sm">
            EchoWrite
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Premium AI Writing
          </span>
        </div>
      )}
    </div>
  );
};
