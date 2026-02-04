import { WritingStyle, WritingVariation } from '@/types/echowrite';
import { StyleButtonsPopover } from './StyleButtonsPopover';
import { VariationOutput } from './VariationOutput';
import { LengthVariationsPanel } from './LengthVariationsPanel';
import { Zap, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
interface AIContentGeneratorProps {
  currentStyle: WritingStyle;
  onSelectStyle: (style: WritingStyle) => void;
  variations: WritingVariation[];
  selectedVariation: WritingVariation | null;
  onSelectVariation: (v: WritingVariation) => void;
  onApplyToWorkspace: (text: string) => void;
  isLoading: boolean;
  workspaceText?: string;
  onClear?: () => void;
}
export const AIContentGenerator = ({
  currentStyle,
  onSelectStyle,
  variations,
  selectedVariation,
  onSelectVariation,
  onApplyToWorkspace,
  isLoading,
  workspaceText = '',
  onClear
}: AIContentGeneratorProps) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
      toast.success('Workspace cleared!');
    }
  };
  return <div className="neu-flat rounded-3xl p-6">
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl neu-convex flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">⚡ AI-Powered Content Generation</h3>
            <p className="text-[10px] text-muted-foreground">
              20 writing styles + length variations • Powered by AI
            </p>
          </div>
        </div>
        
        {/* Clear Button */}
        {onClear && <button onClick={handleClear} className="flex items-center gap-2 px-4 py-2 rounded-xl neu-button text-destructive hover:bg-destructive/10 transition-colors">
            <Trash2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Clear All</span>
          </button>}
      </div>

      {/* Style Buttons with Popover - Compact */}
      

      {/* Single Column Layout: Style Variations then Length Variations */}
      <div className="space-y-6">
        {/* Style Variation Output - with emoji */}
        <div>
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            ✨ Style Variations Output
          </h4>
          <VariationOutput variations={variations} selectedVariation={selectedVariation} onSelectVariation={onSelectVariation} onApplyToWorkspace={onApplyToWorkspace} isLoading={isLoading} />
        </div>

        {/* Length Variations Panel with Slider - Below Style Variations */}
        <div>
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            📏 Length Variations (1-5 with PDF Export)
          </h4>
          <LengthVariationsPanel text={selectedVariation?.suggestedText || workspaceText} onApplyToWorkspace={onApplyToWorkspace} />
        </div>
      </div>
    </div>;
};