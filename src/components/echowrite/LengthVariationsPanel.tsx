import { useState, useEffect } from 'react';
import { LengthVariations, getLengthVariations, LengthVariation } from '@/services/aiService';
import { Copy, CheckCircle2, ArrowRight, RefreshCw, FileText, AlignLeft, BookOpen, Share2, Mail, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface LengthVariationsPanelProps {
  text: string;
  onApplyToWorkspace: (text: string) => void;
}

type LengthType = 'simple' | 'medium' | 'long';

export const LengthVariationsPanel = ({ text, onApplyToWorkspace }: LengthVariationsPanelProps) => {
  const [variations, setVariations] = useState<LengthVariations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<LengthType>('medium');
  const [selectedVariation, setSelectedVariation] = useState<LengthVariation | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (text.trim().length >= 20) {
      fetchVariations();
    }
  }, [text]);

  const fetchVariations = async () => {
    if (!text.trim() || text.length < 20) return;
    
    setIsLoading(true);
    try {
      const result = await getLengthVariations(text);
      setVariations(result);
      // Auto-select first medium variation
      if (result.medium?.[0]) {
        setSelectedVariation(result.medium[0]);
      }
    } catch (error) {
      console.error('Error fetching length variations:', error);
      toast.error('Failed to generate length variations');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (variation: LengthVariation) => {
    await navigator.clipboard.writeText(variation.text);
    setCopiedId(variation.id);
    toast.success('Copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareToWhatsApp = (variation: LengthVariation) => {
    const text = encodeURIComponent(variation.text);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const shareToEmail = (variation: LengthVariation) => {
    const subject = encodeURIComponent('Shared from EchoWrite');
    const body = encodeURIComponent(variation.text);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    toast.success('Opening email client...');
  };

  const lengthTypes: { id: LengthType; label: string; icon: typeof FileText; description: string }[] = [
    { id: 'simple', label: 'Simple', icon: AlignLeft, description: 'Short & concise' },
    { id: 'medium', label: 'Medium', icon: FileText, description: 'Balanced length' },
    { id: 'long', label: 'Long', icon: BookOpen, description: 'Detailed & comprehensive' },
  ];

  const currentVariations = variations?.[selectedType] || [];

  if (isLoading) {
    return (
      <div className="neu-flat rounded-2xl p-8 flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Generating 15 variations...
        </p>
        <p className="text-[10px] text-muted-foreground mt-2">
          5 simple • 5 medium • 5 long
        </p>
      </div>
    );
  }

  if (!variations) {
    return (
      <div className="neu-pressed rounded-2xl p-8 text-center opacity-70">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Length Variations
        </p>
        <p className="text-[10px] text-muted-foreground mt-2">
          Generate content above to see length variations
        </p>
      </div>
    );
  }

  return (
    <div className="neu-flat rounded-2xl p-6">
      {/* Length Type Tabs */}
      <div className="flex gap-3 mb-6">
        {lengthTypes.map((type) => {
          const Icon = type.icon;
          const count = variations?.[type.id]?.length || 0;
          return (
            <button
              key={type.id}
              onClick={() => {
                setSelectedType(type.id);
                setSelectedVariation(variations?.[type.id]?.[0] || null);
              }}
              className={cn(
                'flex-1 flex flex-col items-center gap-2 px-4 py-4 rounded-xl transition-all',
                selectedType === type.id
                  ? 'style-chip-active'
                  : 'neu-flat text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">{type.label}</span>
              <span className="text-[10px] text-muted-foreground">{count} variations</span>
            </button>
          );
        })}
      </div>

      {/* Variations List - All 5 visible with spacing */}
      <div className="space-y-4">
        {currentVariations.map((variation, index) => (
          <div
            key={variation.id}
            onClick={() => setSelectedVariation(variation)}
            className={cn(
              'p-5 rounded-xl cursor-pointer transition-all',
              selectedVariation?.id === variation.id
                ? 'neu-pressed ring-2 ring-primary'
                : 'neu-flat hover:scale-[1.01]'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-primary uppercase">
                Variation {index + 1}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                  {variation.wordCount} words
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(variation);
                  }}
                  className="p-2 rounded-lg neu-button hover:text-primary transition-colors"
                  title="Copy"
                >
                  {copiedId === variation.id ? (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                
                {/* Share Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg neu-button hover:text-primary transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="neu-flat border-border">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        shareToWhatsApp(variation);
                      }}
                      className="gap-2 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-accent" />
                      Share to WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        shareToEmail(variation);
                      }}
                      className="gap-2 cursor-pointer"
                    >
                      <Mail className="w-4 h-4 text-primary" />
                      Share via Email
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Content - Full text visible */}
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {variation.text}
            </p>

            {/* Apply Button */}
            {selectedVariation?.id === variation.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApplyToWorkspace(variation.text);
                }}
                className="mt-4 w-full py-3 primary-button rounded-xl flex items-center justify-center gap-2 text-xs"
              >
                Apply to Workspace
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
