import { Button } from "@/components/ui/button";
import { Feather } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary/5 border border-border flex items-center justify-center group-hover:border-accent/50 transition-colors">
              <Feather className="w-4 h-4 text-primary" />
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">
              Echowrite
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </nav>

          {/* CTA */}
          <Link to="/write">
            <Button variant="default" size="sm">
              Start Writing
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
