import vintageMicLogo from '@/assets/vintage-mic-logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-20 w-20',
  xl: 'h-24 w-24',
  '2xl': 'h-32 w-32',
  '3xl': 'h-40 w-40',
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
  '2xl': 'text-4xl',
  '3xl': 'text-5xl',
};

export const Logo = ({ 
  size = 'lg', 
  showText = false, 
  className = '', 
  animated = true
}: LogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Vintage Chrome Microphone Logo - 2x size relative */}
      <div 
        className={`
          relative ${sizeClasses[size]} 
          flex items-center justify-center
          ${animated ? 'hover:scale-110 transition-transform duration-300' : ''}
        `}
      >
        <img 
          src={vintageMicLogo} 
          alt="EchoWrite" 
          className="w-full h-full object-contain drop-shadow-xl"
        />
      </div>
      
      {showText && (
        <div className="flex flex-col gap-0.5">
          {/* Electric sparkle text with sparkle particles */}
          <div className="relative">
            <span 
              data-text="ECHOWRITE"
              className={`${textSizeClasses[size]} font-black tracking-tight electric-sparkle`}
              style={{ fontFamily: "'Orbitron', 'Space Grotesk', sans-serif" }}
            >
              ECHOWRITE
            </span>
            {/* Sparkle particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="sparkle-dot absolute top-1 left-[20%] w-1 h-1 bg-accent rounded-full" />
              <div className="sparkle-dot absolute top-0 left-[45%] w-1.5 h-1.5 bg-primary rounded-full" />
              <div className="sparkle-dot absolute top-2 left-[70%] w-1 h-1 bg-accent rounded-full" />
              <div className="sparkle-dot absolute bottom-0 left-[35%] w-1 h-1 bg-primary rounded-full" />
              <div className="sparkle-dot absolute bottom-1 left-[85%] w-1.5 h-1.5 bg-accent rounded-full" />
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            AI Writing Assistant
          </span>
        </div>
      )}
    </div>
  );
};
