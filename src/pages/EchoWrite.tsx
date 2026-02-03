import { useState, useCallback, useEffect } from 'react';
import { WritingStyle, WritingVariation, SUPPORTED_LANGUAGES, HistoryItem, Theme, User } from '@/types/echowrite';
import { getWritingVariations } from '@/services/aiService';
import { Workspace } from '@/components/echowrite/Workspace';
import { HistorySidebar } from '@/components/echowrite/HistorySidebar';
import { AuthScreen } from '@/components/echowrite/AuthScreen';
import { Logo } from '@/components/echowrite/Logo';
import { PremiumBadge } from '@/components/echowrite/PremiumBadge';
import { SnowEffect } from '@/components/echowrite/SnowEffect';
import { SettingsPanel } from '@/components/echowrite/SettingsPanel';
import { AIContentGenerator } from '@/components/echowrite/AIContentGenerator';
import { VisualContentHub } from '@/components/echowrite/VisualContentHub';
import { useDictation } from '@/hooks/useDictation';
import { useHistory } from '@/hooks/useHistory';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { History as HistoryIcon, Languages, Sparkles, Snowflake, User as UserIcon, Loader2 } from 'lucide-react';

const EchoWrite = () => {
  // Real Supabase Auth
  const { authUser, loading, signOut } = useAuth();

  // History
  const { history, addToHistory } = useHistory();

  // Snow effect toggle
  const [snowEnabled, setSnowEnabled] = useState(false);

  // Main State
  const [text, setText] = useState('');
  const [style, setStyle] = useState<WritingStyle>(WritingStyle.PROFESSIONAL_EMAIL);
  const [variations, setVariations] = useState<WritingVariation[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<WritingVariation | null>(null);
  const [interimText, setInterimText] = useState('');

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inputLang, setInputLang] = useState('en-US');
  const [currentTheme, setCurrentTheme] = useState<Theme>('neumorphic-green');

  // Apply theme class to body
  useEffect(() => {
    // Remove all theme classes first
    document.documentElement.classList.remove('theme-golden-cream', 'theme-glassmorphism', 'theme-neo-brutalism', 'theme-skeuomorphism', 'theme-clay-morphism', 'theme-minimalism', 'theme-liquid-glass', 'theme-ocean-deep', 'theme-sunset-glow');

    // Add current theme class (neumorphic-green is default, no class needed)
    if (currentTheme !== 'neumorphic-green') {
      document.documentElement.classList.add(`theme-${currentTheme}`);
    }
  }, [currentTheme]);

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
    onFinalResult: finalText => {
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
      toast.success("Generated 8 variations!");
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('Unauthorized') || err.message?.includes('Invalid token')) {
        toast.error("Please sign in to generate variations");
      } else if (err.message?.includes('Usage limit exceeded')) {
        toast.error("Daily limit reached. Upgrade to premium for unlimited generations!");
      } else {
        toast.error(err.message || "Failed to generate variations. Please try again.");
      }
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

  // Handle logout
  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Logged out successfully");
    }
    setSettingsOpen(false);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Logo size="xl" animated />
          <div className="flex items-center gap-2 mt-4 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!authUser) {
    return <AuthScreen onAuthSuccess={() => {}} />;
  }

  // Convert authUser to User type for existing components
  const user: User = {
    id: authUser.id,
    email: authUser.email,
    name: authUser.name,
    tier: authUser.tier,
    usageCount: authUser.usageCount,
    maxUsage: authUser.maxUsage
  };

  return (
    <div className="min-h-screen flex flex-col relative transition-colors duration-700 bg-background overflow-hidden font-sans">
      {/* Snow Effect */}
      <SnowEffect enabled={snowEnabled} />
      {/* History Sidebar */}
      <HistorySidebar history={history} isOpen={historyOpen} onClose={() => setHistoryOpen(false)} onSelectItem={handleHistorySelect} />

      {/* Navbar */}
      <header className="px-6 py-4 glass-frosted flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button onClick={() => setHistoryOpen(!historyOpen)} className="p-2.5 rounded-xl neu-button text-muted-foreground hover:text-primary transition-colors">
            <HistoryIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <Logo size="2xl" animated />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-display font-black tracking-tight text-foreground logo-glow">
                  EchoWrite
                </h1>
                {user.tier === 'premium' && <PremiumBadge variant="badge" />}
              </div>
              <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest">
                Premium AI Writing • 20 Styles
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Snow Toggle */}
          <button onClick={() => setSnowEnabled(!snowEnabled)} className={`p-2.5 rounded-xl neu-button transition-all ${snowEnabled ? 'text-primary' : 'text-muted-foreground'}`} title={snowEnabled ? 'Disable snow effect' : 'Enable snow effect'}>
            <Snowflake className="w-5 h-5" />
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl neu-flat transition-transform hover:scale-[1.02]">
            <Languages className="w-4 h-4 text-primary" />
            <select value={inputLang} onChange={e => setInputLang(e.target.value)} className="bg-transparent border-none text-[10px] font-bold uppercase text-muted-foreground outline-none cursor-pointer">
              {SUPPORTED_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
          </div>

          {/* Unified Profile/Settings Button */}
          <div className="relative">
            <button onClick={() => setSettingsOpen(!settingsOpen)} className="p-2.5 rounded-xl neu-button hover:scale-[1.02] transition-all">
              <UserIcon className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Generate Button */}
          <button disabled={!text || isLoading} onClick={() => handleProcess(style)} className="primary-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <Sparkles className="w-4 h-4" /> GENERATE
          </button>
        </div>
      </header>

      {/* Main Content - Vertical Layout */}
      <div className="flex flex-1 relative z-10 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide">
          {/* Row 1: Workspace - Full Width */}
          <Workspace text={text} onTextChange={setText} onClear={handleClear} onEnterPress={() => handleProcess(style)} interimText={interimText} isDictating={dictation.isDictating} isDictationPaused={dictation.isPaused} dictationTime={dictation.dictationTime} onStartDictation={dictation.start} onStopDictation={dictation.stop} onTogglePause={dictation.togglePause} />

          {/* Row 2: AI-Powered Content Generation */}
          <AIContentGenerator currentStyle={style} onSelectStyle={handleProcess} variations={variations} selectedVariation={selectedVariation} onSelectVariation={setSelectedVariation} onApplyToWorkspace={handleApplyToWorkspace} isLoading={isLoading} workspaceText={text} />

          {/* Row 3: Visual Content Creation */}
          <VisualContentHub workspaceText={text} />
        </main>
      </div>

      {/* Settings Panel - Unified with all options */}
      <SettingsPanel 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        user={user} 
        currentTheme={currentTheme} 
        onThemeChange={setCurrentTheme} 
        onUpgrade={() => {
          toast.info("Premium upgrade coming soon!", {
            description: "Contact support to upgrade to premium"
          });
        }}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default EchoWrite;
