import { Crown, Lock, Sparkles, Star } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  variant?: 'badge' | 'lock' | 'icon' | 'large';
  tooltip?: string;
  size?: 'sm' | 'md' | 'lg';
  activated?: boolean;
}

export const PremiumBadge = ({ 
  variant = 'badge', 
  tooltip = 'Premium feature - Upgrade to unlock',
  size = 'sm',
  activated = false
}: PremiumBadgeProps) => {
  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';

  const content = {
    badge: (
      <span className="premium-badge">
        <Crown className={iconSize} />
        <span>PRO</span>
      </span>
    ),
    lock: (
      <Lock className={`${iconSize} text-gold opacity-70`} />
    ),
    icon: (
      <Sparkles className={`${iconSize} text-gold`} />
    ),
    large: (
      <span className={cn(
        'inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm',
        'gold-gradient text-primary-foreground shadow-xl',
        'animate-pulse-slow ring-2 ring-gold/50'
      )}>
        <Star className="w-5 h-5 fill-current" />
        <span className="tracking-wide">PREMIUM</span>
        <Crown className="w-5 h-5" />
      </span>
    ),
  };

  // For activated premium, show large badge without tooltip
  if (activated && variant === 'large') {
    return content.large;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-help">{content[variant]}</span>
        </TooltipTrigger>
        <TooltipContent 
          className="neu-flat border-border text-sm"
          sideOffset={5}
        >
          <p className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            {activated ? 'Premium member - All features unlocked!' : tooltip}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
