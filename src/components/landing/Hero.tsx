import { Button } from "@/components/ui/button";
import { ArrowRight, Feather } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden paper-texture">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-accent/5 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Icon */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/5 border border-border">
              <Feather className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-semibold text-foreground mb-6 animate-fade-in leading-tight" style={{ animationDelay: '0.2s' }}>
            Write with
            <span className="block text-accent">clarity</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed" style={{ animationDelay: '0.3s' }}>
            Echowrite is a distraction-free writing space designed for focus, 
            creativity, and the pure joy of putting thoughts into words.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/write">
              <Button variant="hero" size="xl" className="group">
                Start Writing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="hero-outline" size="xl">
              Learn More
            </Button>
          </div>

          {/* Social proof or tagline */}
          <p className="mt-12 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Loved by writers, thinkers, and dreamers everywhere
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
