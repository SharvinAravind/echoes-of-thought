import { useState, useCallback } from 'react';
import { 
  WritingStyle, 
  WritingVariation, 
  SUPPORTED_LANGUAGES,
  HistoryItem 
} from '@/types/echowrite';
import { getWritingVariations } from '@/services/aiService';
import { StyleButtons } from '@/components/echowrite/StyleButtons';
import { VariationOutput } from '@/components/echowrite/VariationOutput';
import { Workspace } from '@/components/echowrite/Workspace';
import { HistorySidebar } from '@/components/echowrite/HistorySidebar';
import { ProfileMenu } from '@/components/echowrite/ProfileMenu';
import { AuthScreen } from '@/components/echowrite/AuthScreen';
import { useDictation } from '@/hooks/useDictation';
import { useHistory } from '@/hooks/useHistory';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';
import { 
  Mic, 
  History as HistoryIcon, 
  Languages, 
  User as UserIcon,
  Sparkles,
  Crown
} from 'lucide-react';

const EchoWrite = () => {
  // User & Auth
  const { user, login, logout } = useUser();
  
  // History
  const { history, addToHistory } = useHistory();
  
  // Main State
  const [text, setText] = useState('');
  const [style, setStyle] = useState<WritingStyle>(WritingStyle.PROFESSIONAL_EMAIL);
  const [variations, setVariations] = useState<WritingVariation[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<WritingVariation | null>(null);
  const [interimText, setInterimText] = useState('');
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [inputLang, setInputLang] = useState('en-US');
  const [theme, setTheme] = useState<'creamy' | 'pure' | 'minimal'>('creamy');

  // Voice Commands Handler
  const handleVoiceCommand = useCallback((command: string): boolean => {
    if (command.includes("stop dictation")) {
      dictation.stop();
      return true;
    }
    if (command.includes("open history")) {
      setHistoryOpen(true);
      return true;
    }
    if (command.includes("close history")) {
      setHistoryOpen(false);
      return true;
    }
    if (command.includes("clear workspace")) {
      setText('');
      setInterimText('');
      return true;
    }
    if (command.includes("generate content") || command.includes("start refining")) {
      handleProcess(style);
      return true;
    }
    return false;
  }, [style]);

  // Dictation Hook
  const dictation = useDictation({
    lang: inputLang,
    onInterimResult: setInterimText,
    onFinalResult: (finalText) => {
      setText(prev => (prev ? prev + ' ' : '') + finalText);
    },
    onVoiceCommand: handleVoiceCommand
  });

  // Process text with AI
  const handleProcess = useCallback(async (targetStyle: WritingStyle) => {
    if (!text.trim() || isLoading) return;
    
    setIsLoading(true);
    setStyle(targetStyle);
    
    try {
      const result = await getWritingVariations(text, targetStyle);
      setVariations(result.variations);
      setSelectedVariation(result.variations[0] || null);
      addToHistory(text, targetStyle, result.variations);
      toast.success("Generated 4 variations!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate variations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [text, isLoading, addToHistory]);

  // Handle history item selection
  const handleHistorySelect = (item: HistoryItem) => {
    setText(item.originalText);
    setVariations(item.variations);
    setSelectedVariation(item.variations[0] || null);
    setHistoryOpen(false);
  };

  // Clear workspace
  const handleClear = () => {
    setText('');
    setVariations([]);
    setSelectedVariation(null);
    setInterimText('');
  };

  // Apply variation to workspace
  const handleApplyToWorkspace = (content: string) => {
    setText(content);
    toast.success("Applied to workspace!");
  };

  // Theme classes
  const themeClasses = {
    creamy: "bg-background",
    pure: "bg-card",
    minimal: "bg-muted/30"
  };

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen onLogin={login} />;
  }

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors duration-700 ${themeClasses[theme]} overflow-hidden font-sans`}>
      {/* History Sidebar */}
      <HistorySidebar
        history={history}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectItem={handleHistorySelect}
      />

      {/* Navbar */}
      <header className="px-6 py-4 gold-frosted flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className="p-2 text-gold-dark hover:bg-card/40 rounded-xl transition-colors"
          >
            <HistoryIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center shadow-lg border border-white/30">
              <Mic className="text-primary-foreground w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tighter text-gold-dark uppercase">
                  EchoWrite
                </h1>
                {user.tier === 'premium' && (
                  <div className="bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1 border border-primary/20">
                    <Crown className="w-3 h-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest">PRIME</span>
                  </div>
                )}
              </div>
              <p className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em]">
                Voice Master Active
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-card/60 px-4 py-2 rounded-full border border-border shadow-sm transition-transform hover:scale-[1.02]">
            <Languages className="w-4 h-4 text-primary" />
            <select
              value={inputLang}
              onChange={(e) => setInputLang(e.target.value)}
              className="bg-transparent border-none text-[10px] font-black uppercase text-muted-foreground outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* Profile Button */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="p-2 rounded-full bg-card/80 border border-border shadow-sm hover:border-primary transition-all"
            >
              <UserIcon className="w-5 h-5 text-muted-foreground" />
            </button>
            <ProfileMenu
              user={user}
              isOpen={profileOpen}
              onClose={() => setProfileOpen(false)}
              onLogout={logout}
              theme={theme}
              onThemeChange={setTheme}
            />
          </div>

          {/* Generate Button */}
          <button
            disabled={!text || isLoading}
            onClick={() => handleProcess(style)}
            className="gold-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" /> GENERATE
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 relative z-10 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide">
          {/* Style Buttons */}
          <div className="bg-card/40 border border-border p-4 rounded-4xl shadow-sm backdrop-blur-sm">
            <StyleButtons
              currentStyle={style}
              onSelect={handleProcess}
              isLoading={isLoading}
            />
          </div>

          {/* Workspace and Output */}
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Left: Workspace */}
            <Workspace
              text={text}
              onTextChange={setText}
              onClear={handleClear}
              onEnterPress={() => handleProcess(style)}
              interimText={interimText}
              isDictating={dictation.isDictating}
              isDictationPaused={dictation.isPaused}
              dictationTime={dictation.dictationTime}
              onStartDictation={dictation.start}
              onStopDictation={dictation.stop}
              onTogglePause={dictation.togglePause}
            />

            {/* Right: Output */}
            <aside className="xl:w-[480px] flex flex-col gap-6">
              <VariationOutput
                variations={variations}
                selectedVariation={selectedVariation}
                onSelectVariation={setSelectedVariation}
                onApplyToWorkspace={handleApplyToWorkspace}
                isLoading={isLoading}
              />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EchoWrite;
