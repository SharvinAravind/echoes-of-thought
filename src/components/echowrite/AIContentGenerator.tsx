import { WritingStyle, WritingVariation } from '@/types/echowrite';
import { StyleButtons } from './StyleButtons';
import { VariationOutput } from './VariationOutput';
import { Sparkles, Zap } from 'lucide-react';

interface AIContentGeneratorProps {
  currentStyle: WritingStyle;
  onSelectStyle: (style: WritingStyle) => void;
  variations: WritingVariation[];
  selectedVariation: WritingVariation | null;
  onSelectVariation: (v: WritingVariation) => void;
  onApplyToWorkspace: (text: string) => void;
  isLoading: boolean;
}

export const AIContentGenerator = ({
  currentStyle,
  onSelectStyle,
  variations,
  selectedVariation,
  onSelectVariation,
  onApplyToWorkspace,
  isLoading
}: AIContentGeneratorProps) => {
  return (
    <div className="neu-flat rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl neu-convex flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">AI-Powered Content Generation</h3>
          <p className="text-[10px] text-muted-foreground">
            8-10 writing style variations • Powered by AI
          </p>
        </div>
      </div>

      {/* Style Buttons */}
      <div className="mb-6">
        <StyleButtons
          currentStyle={currentStyle}
          onSelect={onSelectStyle}
          isLoading={isLoading}
        />
      </div>

      {/* Variation Output */}
      <VariationOutput
        variations={variations}
        selectedVariation={selectedVariation}
        onSelectVariation={onSelectVariation}
        onApplyToWorkspace={onApplyToWorkspace}
        isLoading={isLoading}
      />
    </div>
  );
};
