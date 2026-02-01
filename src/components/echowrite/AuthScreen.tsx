import { useState } from 'react';
import { User } from '@/types/echowrite';
import { Mail, Lock, ArrowRight, Mic, Sparkles, Languages, CheckCircle2, Star, Zap, Crown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const freeFeatures = [
  "Standard Voice Transcription",
  "Basic AI Phrasing",
  "Last 5 Items History",
  "Single Output Mode"
];

const premiumFeatures = [
  "Elite Accuracy Mode",
  "4 Simultaneous Variations",
  "Unlimited Archive Access",
  "Global Output Translation",
  "Priority AI Support"
];

export const AuthScreen = ({ onLogin }: AuthScreenProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        name: email.split('@')[0],
        tier: 'free'
      };
      onLogin(user);
      toast.success(`Welcome${mode === 'signup' ? '' : ' back'}, ${user.name}!`);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-background font-sans selection:bg-primary/30">
      {/* Left Side: Tier Comparison */}
      <div className="hidden lg:flex w-1/2 bg-muted/50 border-r border-border flex-col p-16 overflow-y-auto">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center shadow-lg border border-white/30">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-gold-dark uppercase">
              EchoWrite
            </h1>
          </div>
          <p className="text-sm text-muted-foreground font-medium max-w-sm">
            Transform your words with AI-powered writing assistance. Voice, text, any style.
          </p>
        </div>

        {/* Tier Comparison */}
        <div className="grid grid-cols-2 gap-6 flex-1">
          {/* Free Tier */}
          <div className="bg-card rounded-3xl border border-border p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                Free
              </h3>
            </div>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-6">
              Get Started
            </p>
            <ul className="space-y-3 flex-1">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Tier */}
          <div className="bg-card rounded-3xl border-2 border-primary p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-[8px] font-black uppercase tracking-widest rounded-bl-xl">
              Popular
            </div>
            <div className="flex items-center gap-2 mb-6">
              <Crown className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-black uppercase tracking-widest text-primary">
                Premium
              </h3>
            </div>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-6">
              Full Power
            </p>
            <ul className="space-y-3 flex-1">
              {premiumFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-xs text-foreground font-medium">
                  <Zap className="w-4 h-4 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features Icons */}
        <div className="mt-12 flex items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <span className="text-[8px] font-black text-muted-foreground uppercase">Voice</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="text-[8px] font-black text-muted-foreground uppercase">AI Styles</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Languages className="w-6 h-6 text-primary" />
            </div>
            <span className="text-[8px] font-black text-muted-foreground uppercase">Translate</span>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center shadow-lg">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-gold-dark uppercase">
              EchoWrite
            </h1>
          </div>

          {/* Form */}
          <div className="bg-card rounded-4xl border border-border p-10 shadow-xl">
            <h2 className="text-xl font-black text-foreground mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              {mode === 'login'
                ? 'Enter your credentials to continue'
                : 'Start your AI writing journey'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 rounded-2xl border-border bg-muted/50"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 rounded-2xl border-border bg-muted/50"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 gold-gradient text-primary-foreground rounded-2xl font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all"
              >
                {isLoading ? (
                  'Processing...'
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4 ml-2" />
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
        </div>
      </div>
    </div>
  );
};
