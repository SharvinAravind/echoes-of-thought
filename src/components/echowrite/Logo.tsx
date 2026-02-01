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

export const Logo = ({ 
  size = 'lg', 
  showText = false, 
  className = '', 
  animated = true
}: LogoProps) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Vintage Chrome Microphone Logo */}
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
        <div className="flex flex-col">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            EchoWrite
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            AI Writing Assistant
          </span>
        </div>
      )}
    </div>
  );
};
