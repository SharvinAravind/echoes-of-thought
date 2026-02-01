import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface WritingEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const WritingEditor = ({ content, onChange, placeholder }: WritingEditorProps) => {
  return (
    <div className="w-full h-full">
      <Textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Start writing..."}
        className="w-full h-full min-h-[calc(100vh-200px)] resize-none border-0 bg-transparent font-serif text-lg leading-relaxed focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
        style={{ fontSize: '1.125rem', lineHeight: '1.8' }}
      />
    </div>
  );
};
