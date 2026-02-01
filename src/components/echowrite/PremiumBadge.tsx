import { Crown, Lock, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PremiumBadgeProps {
  variant?: 'badge' | 'lock' | 'icon';
  tooltip?: string;
  size?: 'sm' | 'md';
}

export const PremiumBadge = ({ 
  variant = 'badge', 
  tooltip = 'Premium feature - Upgrade to unlock',
  size = 'sm' 
}: PremiumBadgeProps) => {
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

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
  };

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
            {tooltip}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
