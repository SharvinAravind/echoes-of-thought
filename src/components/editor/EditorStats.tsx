interface EditorStatsProps {
  content: string;
}

export const EditorStats = ({ content }: EditorStatsProps) => {
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // Average reading speed

  return (
    <div className="flex items-center gap-6 text-sm text-muted-foreground">
      <span>{wordCount} words</span>
      <span>{charCount} characters</span>
      <span>{readingTime} min read</span>
    </div>
  );
};
