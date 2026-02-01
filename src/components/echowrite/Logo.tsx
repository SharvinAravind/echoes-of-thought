import logoImage from '@/assets/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-8',
  md: 'h-12',
  lg: 'h-16',
  xl: 'h-24',
};

export const Logo = ({ size = 'md', showText = false, className = '' }: LogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src={logoImage} 
        alt="EchoWrite" 
        className={`${sizeClasses[size]} w-auto object-contain drop-shadow-lg`}
      />
      {showText && (
        <div className="flex flex-col">
          <span className="font-display text-2xl font-bold tracking-tight text-foreground">
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
