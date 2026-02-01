import { WritingStyle } from '@/types/echowrite';
import { 
  Mail, 
  MessageCircle, 
  Scale, 
  Sparkles, 
  GraduationCap, 
  Palette, 
  FileText, 
  Share2, 
  Wrench, 
  List 
} from 'lucide-react';

interface StyleButtonsProps {
  currentStyle: WritingStyle;
  onSelect: (style: WritingStyle) => void;
  isLoading: boolean;
}

const styles = [
  { id: WritingStyle.PROFESSIONAL_EMAIL, label: 'Prof. Email', icon: Mail },
  { id: WritingStyle.CASUAL_TEXT, label: 'Casual Msg', icon: MessageCircle },
  { id: WritingStyle.GRAMMAR_CHECK, label: 'Grammar', icon: Scale },
  { id: WritingStyle.IMPROVE_PHRASING, label: 'Phrasing', icon: Sparkles },
  { id: WritingStyle.ACADEMIC, label: 'Academic', icon: GraduationCap },
  { id: WritingStyle.CREATIVE, label: 'Creative', icon: Palette },
  { id: WritingStyle.PROFESSIONAL_SUMMARY, label: 'Summary', icon: FileText },
  { id: WritingStyle.SOCIAL_MEDIA_POST, label: 'Social', icon: Share2 },
  { id: WritingStyle.TECHNICAL_DOC, label: 'Tech Doc', icon: Wrench },
  { id: WritingStyle.REWRITE_BULLETS, label: 'Bullets', icon: List },
];

export const StyleButtons = ({ currentStyle, onSelect, isLoading }: StyleButtonsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      {styles.map((style) => {
        const Icon = style.icon;
        const isActive = currentStyle === style.id;
        
        return (
          <button
            key={style.id}
            disabled={isLoading}
            onClick={() => onSelect(style.id)}
            className={`style-chip flex items-center gap-2 ${
              isActive ? 'style-chip-active' : 'style-chip-inactive'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Icon className="w-3 h-3" />
            <span>{style.label}</span>
          </button>
        );
      })}
    </div>
  );
};
