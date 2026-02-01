import logoBlack from '@/assets/logo-black.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
  '2xl': 'h-20 w-20',
};

export const Logo = ({ 
  size = 'md', 
  showText = false, 
  className = '', 
  animated = true
}: LogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Plain Black Logo with Theme Adaptation */}
      <div 
        className={`
          relative ${sizeClasses[size]} 
          flex items-center justify-center
          ${animated ? 'hover:scale-105 transition-transform duration-300' : ''}
        `}
      >
        <img 
          src={logoBlack} 
          alt="EchoWrite" 
          className="w-full h-full object-contain logo-theme-adapt"
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-foreground">
            EchoWrite
          </span>
          <span className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">
            AI Writing Assistant
          </span>
        </div>
      )}
    </div>
  );
};
