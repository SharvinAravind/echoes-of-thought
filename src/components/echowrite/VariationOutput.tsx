import { useState } from 'react';
import { WritingVariation, SUPPORTED_LANGUAGES } from '@/types/echowrite';
import { 
  Copy, 
  CheckCircle2, 
  Share2, 
  Mail, 
  Globe, 
  RefreshCw,
  Zap
} from 'lucide-react';
import { translateText, rephraseText } from '@/services/aiService';
import { toast } from 'sonner';

interface VariationOutputProps {
  variations: WritingVariation[];
  selectedVariation: WritingVariation | null;
  onSelectVariation: (v: WritingVariation) => void;
  onApplyToWorkspace: (text: string) => void;
  isLoading: boolean;
}

export const VariationOutput = ({
  variations,
  selectedVariation,
  onSelectVariation,
  onApplyToWorkspace,
  isLoading
}: VariationOutputProps) => {
  const [copied, setCopied] = useState(false);
  const [isRephrasing, setIsRephrasing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [displayVariation, setDisplayVariation] = useState<WritingVariation | null>(null);

  // Use displayVariation if set, otherwise use selectedVariation
  const currentVariation = displayVariation || selectedVariation;

  const copyToClipboard = async () => {
    if (currentVariation?.suggestedText) {
      await navigator.clipboard.writeText(currentVariation.suggestedText);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTranslate = async (langName: string) => {
    if (!currentVariation || !langName) return;
    setIsTranslating(true);
    try {
      const translated = await translateText(currentVariation.suggestedText, langName);
      setDisplayVariation({ ...currentVariation, suggestedText: translated });
      toast.success(`Translated to ${langName}`);
    } catch (error) {
      toast.error("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleRephrase = async (lengthType: 'simple' | 'medium' | 'long') => {
    if (!currentVariation) return;
    setIsRephrasing(true);
    try {
      const result = await rephraseText(currentVariation.suggestedText, lengthType);
      setDisplayVariation({ ...currentVariation, suggestedText: result });
      toast.success(`Rephrased to ${lengthType} form`);
    } catch (error) {
      toast.error("Rephrasing failed. Please try again.");
    } finally {
      setIsRephrasing(false);
    }
  };

  const shareOutput = (platform: 'whatsapp' | 'email') => {
    if (!currentVariation) return;
    const content = currentVariation.suggestedText;
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(content)}`, '_blank');
    } else {
      window.location.href = `mailto:?subject=EchoWrite&body=${encodeURIComponent(content)}`;
    }
  };

  // Reset displayVariation when selectedVariation changes
  const handleSelectVariation = (v: WritingVariation) => {
    setDisplayVariation(null);
    onSelectVariation(v);
  };

  if (isLoading) {
    return (
      <div className="gold-card p-24 text-center flex flex-col items-center justify-center animate-pulse">
        <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
          Refining Intelligence...
        </p>
      </div>
    );
  }

  if (variations.length === 0) {
    return (
      <div className="bg-muted/30 border-2 border-dashed border-muted rounded-4xl p-24 text-center opacity-60 flex flex-col items-center">
        <Zap className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">
          Engine Standby
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Variation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {variations.map((v) => (
          <button
            key={v.id}
            onClick={() => handleSelectVariation(v)}
            className={`shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black border transition-all ${
              selectedVariation?.id === v.id
                ? 'bg-primary text-primary-foreground border-primary shadow-xl'
                : 'bg-card text-muted-foreground border-border hover:text-primary'
            }`}
          >
            {v.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Selected Variation Content */}
      {currentVariation && (
        <div className="gold-card overflow-hidden animate-echo-in p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full uppercase self-start border border-primary/20">
                {currentVariation.tone} Tone
              </span>
              
              {/* Translate Dropdown */}
              <div className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-lg border border-border group">
                <Globe className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                <select
                  className="bg-transparent border-none text-[8px] font-black uppercase text-muted-foreground outline-none cursor-pointer"
                  onChange={(e) => handleTranslate(e.target.value)}
                  value=""
                  disabled={isTranslating}
                >
                  <option value="" disabled>Translate Output</option>
                  {SUPPORTED_LANGUAGES.map(l => (
                    <option key={l.code} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => shareOutput('whatsapp')}
                className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors shadow-sm"
                title="Share via WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => shareOutput('email')}
                className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors shadow-sm"
                title="Send via Email"
              >
                <Mail className="w-4 h-4" />
              </button>
              <button
                onClick={copyToClipboard}
                className="p-2.5 bg-muted text-muted-foreground hover:text-primary rounded-xl transition-colors shadow-sm"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 bg-muted/50 rounded-3xl border border-border text-foreground text-lg leading-relaxed whitespace-pre-wrap font-medium shadow-inner italic relative min-h-[200px]">
            {(isRephrasing || isTranslating) && (
              <div className="absolute inset-0 bg-card/50 backdrop-blur-[2px] flex items-center justify-center rounded-3xl z-10">
                <RefreshCw className="w-6 h-6 text-primary animate-spin" />
              </div>
            )}
            {currentVariation.suggestedText}
          </div>

          {/* Rephrase Options */}
          <div className="mt-6 flex gap-2">
            {(['simple', 'medium', 'long'] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleRephrase(type)}
                disabled={isRephrasing}
                className="flex-1 py-3 px-3 rounded-xl border border-border bg-muted hover:bg-card hover:border-primary text-[8px] font-black uppercase text-muted-foreground transition-all disabled:opacity-50"
              >
                {type} Form
              </button>
            ))}
          </div>

          {/* Apply Button */}
          <button
            onClick={() => onApplyToWorkspace(currentVariation.suggestedText)}
            className="w-full mt-6 py-5 gold-gradient text-primary-foreground rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all hover:scale-[1.02]"
          >
            APPLY TO WORKSPACE
          </button>
        </div>
      )}
    </div>
  );
};
