import logoBlack from '@/assets/logo-black.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  className?: string;
  animated?: boolean;
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
  animated = true
}: LogoProps) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Simple Plain Logo */}
      <div 
        className={`
          relative ${sizeClasses[size]} 
          flex items-center justify-center
          ${animated ? 'animate-float' : ''}
        `}
      >
        <img 
          src={logoBlack} 
          alt="EchoWrite" 
          className="w-full h-full object-contain transition-all duration-500"
          style={{
            filter: 'brightness(0) saturate(100%)',
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
