import { WritingStyle, WritingVariation } from '@/types/echowrite';
import { StyleButtons } from './StyleButtons';
import { VariationOutput } from './VariationOutput';
import { LengthVariationsPanel } from './LengthVariationsPanel';
import { Zap } from 'lucide-react';

interface AIContentGeneratorProps {
  currentStyle: WritingStyle;
  onSelectStyle: (style: WritingStyle) => void;
  variations: WritingVariation[];
  selectedVariation: WritingVariation | null;
  onSelectVariation: (v: WritingVariation) => void;
  onApplyToWorkspace: (text: string) => void;
  isLoading: boolean;
  workspaceText?: string;
}

export const AIContentGenerator = ({
  currentStyle,
  onSelectStyle,
  variations,
  selectedVariation,
  onSelectVariation,
  onApplyToWorkspace,
  isLoading,
  workspaceText = ''
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
            20 writing style variations + 15 length variations • Powered by AI
          </p>
        </div>
      </div>

      {/* Style Buttons - Full Width */}
      <div className="mb-8">
        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">
          Select Writing Style (20 Varieties)
        </h4>
        <StyleButtons
          currentStyle={currentStyle}
          onSelect={onSelectStyle}
          isLoading={isLoading}
        />
      </div>

      {/* Single Column Layout: Style Variations then Length Variations */}
      <div className="space-y-8">
        {/* Style Variation Output */}
        <div>
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Style Variations Output
          </h4>
          <VariationOutput
            variations={variations}
            selectedVariation={selectedVariation}
            onSelectVariation={onSelectVariation}
            onApplyToWorkspace={onApplyToWorkspace}
            isLoading={isLoading}
          />
        </div>

        {/* Length Variations Panel - Below Style Variations */}
        <div>
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Length Variations (5 Simple • 5 Medium • 5 Long)
          </h4>
          <LengthVariationsPanel
            text={selectedVariation?.suggestedText || workspaceText}
            onApplyToWorkspace={onApplyToWorkspace}
          />
        </div>
      </div>
    </div>
  );
};
