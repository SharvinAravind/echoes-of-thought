import { cn } from '@/lib/utils';
import { Mic, Pause, Play, Square } from 'lucide-react';

interface LiveDictationBarProps {
  isActive: boolean;
  isPaused: boolean;
  dictationTime: number;
  interimText: string;
  onTogglePause: () => void;
  onStop: () => void;
  barCount?: number;
  barStyle?: 'classic' | 'rounded' | 'dots' | 'blocks';
}

export const LiveDictationBar = ({ 
  isActive, 
  isPaused, 
  dictationTime,
  interimText,
  onTogglePause,
  onStop,
  barCount = 12,
  barStyle = 'classic'
}: LiveDictationBarProps) => {
  if (!isActive) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const bars = Array.from({ length: barCount }, (_, i) => i);

  const getBarClassName = () => {
    switch (barStyle) {
      case 'rounded':
        return 'w-2 rounded-full';
      case 'dots':
        return 'w-3 h-3 rounded-full';
      case 'blocks':
        return 'w-3 rounded-sm';
      default:
        return 'w-1.5 rounded-full';
    }
  };

  return (
    <div className="w-full neu-pressed rounded-2xl p-4 animate-fade-in">
      <div className="flex items-center gap-4">
        {/* Recording indicator */}
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-3 h-3 rounded-full',
            isPaused 
              ? 'bg-accent' 
              : 'bg-destructive animate-pulse'
          )} />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            {isPaused ? 'Paused' : 'Live'}
          </span>
        </div>

        {/* Waveform visualization */}
        <div className="flex-1 flex items-center justify-center gap-1 h-10">
          {bars.map((i) => (
            <div
              key={i}
              className={cn(
                'bg-primary transition-all duration-150',
                getBarClassName(),
                barStyle !== 'dots' && 'min-h-[4px]'
              )}
              style={{
                height: isActive && !isPaused 
                  ? `${Math.random() * 100}%` 
                  : barStyle === 'dots' ? '12px' : '4px',
                opacity: isActive && !isPaused ? 0.7 + Math.random() * 0.3 : 0.3,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>

        {/* Timer */}
        <span className="text-sm font-mono font-bold text-primary min-w-[50px]">
          {formatTime(dictationTime)}
        </span>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePause}
            className="p-2 rounded-xl neu-button text-accent hover:text-primary transition-colors"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={onStop}
            className="p-2 rounded-xl bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live transcript preview */}
      {interimText && (
        <div className="mt-3 pt-3 border-t border-border/30">
          <div className="flex items-center gap-2 mb-1">
            <Mic className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Live Transcript
            </span>
          </div>
          <p className="text-sm text-foreground/80 italic animate-pulse">
            {interimText}
          </p>
        </div>
      )}
    </div>
  );
};
