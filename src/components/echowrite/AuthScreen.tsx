import { useState } from 'react';
import { Mail, Lock, ArrowRight, Sparkles, Languages, CheckCircle2, Star, Zap, Crown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Logo } from './Logo';
import { RocketAnimation } from './RocketAnimation';
import { lovable } from '@/integrations/lovable';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

// Validation schemas
const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

interface AuthScreenProps {
  onAuthSuccess: () => void;
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

export const AuthScreen = ({ onAuthSuccess }: AuthScreenProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});

  const validateInputs = () => {
    const newErrors: { email?: string; password?: string; name?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    
    try {
      if (mode === 'signup') {
        const redirectUrl = `${window.location.origin}/`;
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: { name: name || email.split('@')[0] }
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in instead.');
          } else {
            toast.error(error.message || 'Sign up failed');
          }
          return;
        }

        if (data.user && !data.session) {
          // Email confirmation required
          toast.success('Please check your email to confirm your account!');
        } else if (data.session) {
          toast.success(`Welcome, ${name || email.split('@')[0]}!`);
          onAuthSuccess();
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          if (error.message.includes('Invalid login')) {
            toast.error('Invalid email or password');
          } else if (error.message.includes('Email not confirmed')) {
            toast.error('Please confirm your email before signing in');
          } else {
            toast.error(error.message || 'Sign in failed');
          }
          return;
        }

        if (data.session) {
          toast.success(`Welcome back!`);
          onAuthSuccess();
        }
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth('google');
      if (result.error) {
        toast.error(result.error.message || "Google sign-in failed");
      }
      // The page will redirect for OAuth flow
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
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
          {/* Vintage Mic Logo */}
          <div className="mb-12">
            <Logo size="3xl" showText animated />
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
              { icon: Sparkles, label: '25+ Languages' },
              { icon: Sparkles, label: 'AI Styles' },
              { icon: Languages, label: 'Translate' },
            ].map(({ icon: Icon, label }, idx) => (
              <div key={label + idx} className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl neu-flat flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
          
          {/* Rocket Animation - Bottom Right */}
          <div className="absolute bottom-8 right-8">
            <RocketAnimation size="lg" />
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Logo size="2xl" showText animated />
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
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">{errors.name}</p>
                  )}
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
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                )}
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
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password}</p>
                )}
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

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground">or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-14 rounded-2xl neu-flat border-0 gap-3 text-sm font-semibold hover:scale-[1.02] transition-transform"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
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
