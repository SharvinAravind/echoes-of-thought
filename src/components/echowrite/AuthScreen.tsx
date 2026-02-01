import { useState } from 'react';
import { User } from '@/types/echowrite';
import { Mail, Lock, ArrowRight, Mic, Sparkles, Languages, CheckCircle2, Star, Zap, Crown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Logo } from './Logo';
import { PREMIUM_FEATURES } from '@/types/echowrite';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const freeFeatures = [
  "Standard Voice Transcription",
  "Basic AI Phrasing",
  "10 Generations/Day",
  "2 Theme Options",
  "Last 5 Items History"
];

const premiumFeatures = [
  "Elite Accuracy Mode",
  "Unlimited Generations",
  "All 10 Premium Themes",
  "4 Simultaneous Variations",
  "Global Output Translation",
  "Cloud Sync & Backup",
  "Priority AI Processing"
];

export const AuthScreen = ({ onLogin }: AuthScreenProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    
    // Simulate authentication (in production, use real auth)
    setTimeout(() => {
      const user: User = {
        id: crypto.randomUUID(),
        email,
        name: name || email.split('@')[0],
        tier: 'free',
        usageCount: 0,
        maxUsage: 10
      };
      onLogin(user);
      toast.success(`Welcome${mode === 'signup' ? '' : ' back'}, ${user.name}!`);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-background font-sans selection:bg-primary/30 overflow-hidden">
      {/* Left Side: Hero & Tier Comparison */}
      <div className="hidden lg:flex w-1/2 flex-col p-12 overflow-y-auto relative">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-32 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-12">
            <Logo size="lg" showText />
          </div>

          <h2 className="text-3xl font-display font-bold text-foreground mb-4 leading-tight">
            Transform Your Words with AI-Powered Writing
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Voice-to-text processing with AI-powered content generation. 
            Transform your ideas into polished content in seconds.
          </p>

          {/* Tier Comparison */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            {/* Free Tier */}
            <div className="neu-flat rounded-3xl p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Free
                </h3>
              </div>
              <p className="text-2xl font-bold text-foreground mb-4">$0</p>
              <ul className="space-y-2.5 flex-1">
                {freeFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Premium Tier */}
            <div className="neu-convex rounded-3xl p-6 flex flex-col relative overflow-hidden ring-2 ring-gold">
              <div className="absolute top-0 right-0 gold-gradient text-white px-3 py-1 text-[8px] font-bold uppercase tracking-widest rounded-bl-xl">
                Popular
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-gold" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-gold">
                  Premium
                </h3>
              </div>
              <p className="text-2xl font-bold text-foreground mb-4">$9/mo</p>
              <ul className="space-y-2.5 flex-1">
                {premiumFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-foreground font-medium">
                    <Zap className="w-3.5 h-3.5 text-gold shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature Icons */}
          <div className="mt-8 flex items-center gap-6">
            {[
              { icon: Mic, label: '25+ Languages' },
              { icon: Sparkles, label: 'AI Styles' },
              { icon: Languages, label: 'Translate' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl neu-flat flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Logo size="lg" showText />
          </div>

          {/* Form */}
          <div className="neu-flat rounded-[2rem] p-8 md:p-10">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              {mode === 'login'
                ? 'Enter your credentials to continue'
                : 'Start your AI writing journey'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="relative">
                  <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 h-14 rounded-2xl neu-pressed border-0 focus-visible:ring-primary"
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 rounded-2xl neu-pressed border-0 focus-visible:ring-primary"
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 rounded-2xl neu-pressed border-0 focus-visible:ring-primary"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 primary-button rounded-2xl text-base gap-2"
              >
                {isLoading ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {mode === 'login'
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>

          {/* Free tier notice */}
          <div className="mt-6 p-4 rounded-2xl neu-flat text-center">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Free tier includes:</span>{' '}
              10 generations/day • Basic transcription • 2 themes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
