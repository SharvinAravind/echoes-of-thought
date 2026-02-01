import { useState, useRef, useEffect } from 'react';
import { Mic, Trash2, Edit3, Square, Pause, Play } from 'lucide-react';

interface WorkspaceProps {
  text: string;
  onTextChange: (text: string) => void;
  onClear: () => void;
  onEnterPress: () => void;
  interimText: string;
  isDictating: boolean;
  isDictationPaused: boolean;
  dictationTime: number;
  onStartDictation: () => void;
  onStopDictation: () => void;
  onTogglePause: () => void;
}

export const Workspace = ({
  text,
  onTextChange,
  onClear,
  onEnterPress,
  interimText,
  isDictating,
  isDictationPaused,
  dictationTime,
  onStartDictation,
  onStopDictation,
  onTogglePause
}: WorkspaceProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onEnterPress();
    }
  };

  return (
    <div className="flex-1 gold-card flex flex-col relative min-h-[500px] overflow-hidden">
      {/* Header */}
      <div className="px-8 py-5 border-b border-border/50 flex justify-between items-center bg-card/40">
        <div className="flex items-center gap-3">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Edit3 className="w-3 h-3 text-primary" /> Workspace
          </h3>
          {isDictating && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full">
              <div className={`w-2 h-2 rounded-full ${isDictationPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
              <span className="text-[9px] font-black text-red-600 uppercase">
                {isDictationPaused ? 'PAUSED' : 'RECORDING'} {formatTime(dictationTime)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isDictating ? (
            <>
              <button
                onClick={onTogglePause}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 hover:bg-yellow-200 transition-all"
              >
                {isDictationPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span className="text-[10px] font-black uppercase">
                  {isDictationPaused ? 'RESUME' : 'PAUSE'}
                </span>
              </button>
              <button
                onClick={onStopDictation}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all shadow-md"
              >
                <Square className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase">STOP</span>
              </button>
            </>
          ) : (
            <button
              onClick={onStartDictation}
              className="flex items-center gap-2 px-5 py-2 rounded-full shadow-md bg-card text-muted-foreground border border-border hover:text-primary hover:border-primary/30 transition-all"
            >
              <Mic className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-tight">DICTATE</span>
            </button>
          )}
          <button
            onClick={onClear}
            className="p-2.5 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Textarea */}
      <div className="flex-1 flex flex-col p-8 overflow-y-auto relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Start typing or use dictation... (Press Enter to generate)"
          className="w-full flex-1 resize-none bg-transparent focus:outline-none text-2xl text-foreground leading-relaxed placeholder:text-muted-foreground/40 font-light"
        />
        {interimText && (
          <p className="text-2xl text-primary opacity-60 leading-relaxed font-light mt-4 italic animate-pulse">
            {interimText}
          </p>
        )}
      </div>
    </div>
  );
};
