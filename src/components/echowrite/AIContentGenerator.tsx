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
            8 writing style variations + 15 length variations • Powered by AI
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

      {/* Two Column Layout: Style Variations + Length Variations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Style Variation Output */}
        <div>
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Style Variations (8)
          </h4>
          <VariationOutput
            variations={variations}
            selectedVariation={selectedVariation}
            onSelectVariation={onSelectVariation}
            onApplyToWorkspace={onApplyToWorkspace}
            isLoading={isLoading}
          />
        </div>

        {/* Length Variations Panel */}
        <div>
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Length Variations (5 each)
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
