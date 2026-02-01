import { useState, useCallback, useEffect } from 'react';
import { 
  WritingStyle, 
  WritingVariation, 
  SUPPORTED_LANGUAGES,
  HistoryItem,
  Theme
} from '@/types/echowrite';
import { getWritingVariations } from '@/services/aiService';
import { StyleButtons } from '@/components/echowrite/StyleButtons';
import { VariationOutput } from '@/components/echowrite/VariationOutput';
import { Workspace } from '@/components/echowrite/Workspace';
import { HistorySidebar } from '@/components/echowrite/HistorySidebar';
import { ProfileMenu } from '@/components/echowrite/ProfileMenu';
import { AuthScreen } from '@/components/echowrite/AuthScreen';
import { Logo } from '@/components/echowrite/Logo';
import { PremiumBadge } from '@/components/echowrite/PremiumBadge';
import { SnowEffect } from '@/components/echowrite/SnowEffect';
import { SettingsPanel } from '@/components/echowrite/SettingsPanel';
import { useDictation } from '@/hooks/useDictation';
import { useHistory } from '@/hooks/useHistory';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';
import { 
  History as HistoryIcon, 
  Languages, 
  User as UserIcon,
  Sparkles,
  Snowflake,
  Settings
} from 'lucide-react';

const EchoWrite = () => {
  // User & Auth
  const { user, login, logout, upgradeToPremium } = useUser();
  
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
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inputLang, setInputLang] = useState('en-US');
  const [currentTheme, setCurrentTheme] = useState<Theme>('neumorphic-green');

  // Apply theme class to body
  useEffect(() => {
    // Remove all theme classes first
    document.documentElement.classList.remove(
      'theme-golden-cream',
      'theme-glassmorphism',
      'theme-neo-brutalism',
      'theme-skeuomorphism',
      'theme-clay-morphism',
      'theme-minimalism',
      'theme-liquid-glass',
      'theme-ocean-deep',
      'theme-sunset-glow'
    );
    
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

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen onLogin={login} />;
  }

  return (
    <div className="min-h-screen flex flex-col relative transition-colors duration-700 bg-background overflow-hidden font-sans">
      {/* Snow Effect */}
      <SnowEffect enabled={snowEnabled} />
      {/* History Sidebar */}
      <HistorySidebar
        history={history}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectItem={handleHistorySelect}
      />

      {/* Navbar */}
      <header className="px-6 py-4 glass-frosted flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className="p-2.5 rounded-xl neu-button text-muted-foreground hover:text-primary transition-colors"
          >
            <HistoryIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <Logo size="lg" animated />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-display font-bold tracking-tight text-foreground">
                  EchoWrite
                </h1>
                {user.tier === 'premium' && (
                  <PremiumBadge variant="badge" />
                )}
              </div>
              <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest">
                Premium AI Writing
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Settings Button */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2.5 rounded-xl neu-button text-muted-foreground hover:text-primary transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Snow Toggle */}
          <button
            onClick={() => setSnowEnabled(!snowEnabled)}
            className={`p-2.5 rounded-xl neu-button transition-all ${snowEnabled ? 'text-primary' : 'text-muted-foreground'}`}
            title={snowEnabled ? 'Disable snow effect' : 'Enable snow effect'}
          >
            <Snowflake className="w-5 h-5" />
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl neu-flat transition-transform hover:scale-[1.02]">
            <Languages className="w-4 h-4 text-primary" />
            <select
              value={inputLang}
              onChange={(e) => setInputLang(e.target.value)}
              className="bg-transparent border-none text-[10px] font-bold uppercase text-muted-foreground outline-none cursor-pointer"
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
              className="p-2.5 rounded-xl neu-button hover:scale-[1.02] transition-all"
            >
              <UserIcon className="w-5 h-5 text-muted-foreground" />
            </button>
            <ProfileMenu
              user={user}
              isOpen={profileOpen}
              onClose={() => setProfileOpen(false)}
              onLogout={logout}
              onUpgrade={() => {
                upgradeToPremium();
                toast.success("🎉 Welcome to Premium! All features unlocked.");
                setProfileOpen(false);
              }}
              currentTheme={currentTheme}
              onThemeChange={setCurrentTheme}
            />
          </div>

          {/* Generate Button */}
          <button
            disabled={!text || isLoading}
            onClick={() => handleProcess(style)}
            className="primary-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" /> GENERATE
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 relative z-10 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide">
          {/* Style Buttons */}
          <div className="neu-flat p-4 rounded-3xl">
            <StyleButtons
              currentStyle={style}
              onSelect={handleProcess}
              isLoading={isLoading}
            />
          </div>

          {/* Workspace and Output */}
          <div className="flex flex-col xl:flex-row gap-6 flex-1">
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

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        onUpgrade={() => {
          upgradeToPremium();
          toast.success("🎉 Welcome to Premium! All features unlocked.");
          setSettingsOpen(false);
        }}
      />
    </div>
  );
};

export default EchoWrite;
