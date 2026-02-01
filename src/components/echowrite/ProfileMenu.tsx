import { useState } from 'react';
import { User } from '@/types/echowrite';
import { 
  User as UserIcon, 
  Crown, 
  LogOut, 
  Palette, 
  Info, 
  CheckCircle2 
} from 'lucide-react';

interface ProfileMenuProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  theme: 'creamy' | 'pure' | 'minimal';
  onThemeChange: (theme: 'creamy' | 'pure' | 'minimal') => void;
}

const freeFeatures = [
  "Standard Voice Transcription",
  "Basic AI Styles",
  "History (Last 5 items)",
  "Single Variation Mode"
];

const premiumFeatures = [
  "Elite Precision Mode",
  "4 Simultaneous Variations",
  "Unlimited Workspace Archive",
  "Voice Command Suite",
  "Global Output Translation",
  "Zero Latency Engine"
];

export const ProfileMenu = ({
  user,
  isOpen,
  onClose,
  onLogout,
  theme,
  onThemeChange
}: ProfileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-4xl shadow-2xl p-6 z-50 animate-echo-in">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <UserIcon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-black uppercase text-foreground tracking-tighter">
            {user.name}
          </p>
          <p className="text-[9px] text-muted-foreground font-medium truncate">
            {user.email}
          </p>
          <span
            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${
              user.tier === 'premium'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {user.tier} Plan
          </span>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
            <Palette className="w-3 h-3" /> Themes
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(['creamy', 'pure', 'minimal'] as const).map((t) => (
              <button
                key={t}
                onClick={() => onThemeChange(t)}
                className={`h-8 rounded-lg border transition-all flex items-center justify-center ${
                  theme === t
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-muted'
                }`}
              >
                <span className="text-[7px] font-black uppercase text-muted-foreground">
                  {t}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tier Benefits */}
        <div>
          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
            <Info className="w-3 h-3" /> Plan Benefits
          </p>
          <div className="bg-muted rounded-xl p-3 border border-border space-y-3">
            <div>
              <p className="text-[7px] font-black text-muted-foreground uppercase mb-1">
                Current: {user.tier}
              </p>
              <div className="space-y-1">
                {(user.tier === 'premium' ? premiumFeatures : freeFeatures).map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-[8px] font-medium text-muted-foreground"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-green-500" /> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Button (for free users) */}
      {user.tier === 'free' && (
        <button className="w-full mb-4 gold-gradient text-primary-foreground py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
          <Crown className="w-4 h-4" />
          <span className="text-[9px] font-black uppercase tracking-widest">
            Upgrade to Premium
          </span>
        </button>
      )}

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full py-2 flex items-center justify-center gap-2 text-muted-foreground hover:text-destructive transition-colors text-[9px] font-black uppercase tracking-widest"
      >
        <LogOut className="w-3 h-3" /> Sign Out
      </button>
    </div>
  );
};
