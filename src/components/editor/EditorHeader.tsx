import { Feather, Save, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EditorStats } from "./EditorStats";

interface EditorHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  content: string;
  isSaved: boolean;
}

export const EditorHeader = ({ title, onTitleChange, content, isSaved }: EditorHeaderProps) => {
  return (
    <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary/5 border border-border flex items-center justify-center group-hover:border-accent/50 transition-colors">
              <Feather className="w-4 h-4 text-primary" />
            </div>
            <span className="font-serif text-xl font-semibold text-foreground hidden sm:block">
              Echowrite
            </span>
          </Link>

          {/* Document title */}
          <div className="flex-1 max-w-md mx-4">
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Untitled"
              className="w-full text-center bg-transparent border-0 font-serif text-lg font-medium text-foreground focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Stats & Save indicator */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <EditorStats content={content} />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-accent" />
                  <span className="hidden sm:inline">Saved</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
