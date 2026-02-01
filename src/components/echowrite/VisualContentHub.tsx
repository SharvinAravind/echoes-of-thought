import { useState, useEffect, useRef } from 'react';
import { 
  Layout, 
  GitBranch, 
  Brain, 
  Clock, 
  Download, 
  Maximize2,
  Sparkles,
  RefreshCw,
  X,
  Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateVisualContent, VisualContent } from '@/services/aiService';
import { toast } from 'sonner';
import mermaid from 'mermaid';
import { Button } from '@/components/ui/button';

type VisualType = 'diagram' | 'flowchart' | 'mindmap' | 'timeline';

interface VisualItem {
  id: string;
  type: VisualType;
  title: string;
  mermaidCode: string;
  description: string;
  svg?: string;
}

const visualTypes = [
  { id: 'diagram', label: 'Diagrams', icon: Layout },
  { id: 'flowchart', label: 'Flowcharts', icon: GitBranch },
  { id: 'mindmap', label: 'Mind Maps', icon: Brain },
  { id: 'timeline', label: 'Timelines', icon: Clock },
] as const;

interface VisualContentHubProps {
  workspaceText?: string;
}

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'inherit',
});

export const VisualContentHub = ({ workspaceText = '' }: VisualContentHubProps) => {
  const [selectedType, setSelectedType] = useState<VisualType>('diagram');
  const [generatedItems, setGeneratedItems] = useState<VisualItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fullscreenItem, setFullscreenItem] = useState<VisualItem | null>(null);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const mermaidRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const lastTextRef = useRef<string>('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Manual generate function - now works with single word
  const handleManualGenerate = async () => {
    if (!workspaceText.trim()) {
      toast.error('Please enter some text in workspace');
      return;
    }
    
    setIsGenerating(true);
    lastTextRef.current = workspaceText;

    try {
      const visualPromises = visualTypes.map(async (type) => {
        const result = await generateVisualContent(workspaceText, type.id);
        return {
          id: `${type.id}-${Date.now()}`,
          type: type.id,
          title: result.title,
          mermaidCode: result.mermaidCode,
          description: result.description,
        } as VisualItem;
      });

      const newItems = await Promise.all(visualPromises);
      setGeneratedItems(newItems);
      toast.success('Visual content generated!');
    } catch (error) {
      console.error('Error generating visuals:', error);
      toast.error('Failed to generate visual content');
    } finally {
      setIsGenerating(false);
    }
  };

  // Render mermaid diagrams
  useEffect(() => {
    const renderDiagrams = async () => {
      for (const item of generatedItems) {
        const element = mermaidRefs.current.get(item.id);
        if (element && item.mermaidCode && !item.svg) {
          try {
            const { svg } = await mermaid.render(`mermaid-${item.id}`, item.mermaidCode);
            setGeneratedItems(prev => 
              prev.map(i => i.id === item.id ? { ...i, svg } : i)
            );
          } catch (err) {
            console.error('Mermaid render error:', err);
          }
        }
      }
    };
    renderDiagrams();
  }, [generatedItems]);

  // Auto-generate visual content when workspace text changes (only if autoGenerate is enabled)
  // Now works with any text (including single words)
  useEffect(() => {
    if (!autoGenerate) return;
    if (!workspaceText.trim()) return;
    if (workspaceText === lastTextRef.current) return;

    // Debounce the generation
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      lastTextRef.current = workspaceText;
      setIsGenerating(true);

      try {
        // Generate all visual types in parallel
        const visualPromises = visualTypes.map(async (type) => {
          const result = await generateVisualContent(workspaceText, type.id);
          return {
            id: `${type.id}-${Date.now()}`,
            type: type.id,
            title: result.title,
            mermaidCode: result.mermaidCode,
            description: result.description,
          } as VisualItem;
        });

        const newItems = await Promise.all(visualPromises);
        setGeneratedItems(newItems);
        toast.success('Visual content generated!');
      } catch (error) {
        console.error('Error generating visuals:', error);
        toast.error('Failed to generate visual content');
      } finally {
        setIsGenerating(false);
      }
    }, 2000); // 2 second debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [workspaceText, autoGenerate]);

  const handleDownload = (item: VisualItem) => {
    if (!item.svg) return;
    
    const blob = new Blob([item.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.title.replace(/\s+/g, '-').toLowerCase()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  const filteredItems = generatedItems.filter(item => item.type === selectedType);

  return (
    <div className="neu-flat rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl neu-convex flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Visual Content Creation</h3>
            <p className="text-[10px] text-muted-foreground">
              Generate diagrams, flowcharts, mind maps, and timelines
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Auto-generate toggle */}
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={autoGenerate}
              onChange={(e) => setAutoGenerate(e.target.checked)}
              className="w-4 h-4 rounded accent-primary"
            />
            Auto
          </label>
          
          {/* Generate Button - Now works with any text */}
          <Button
            onClick={handleManualGenerate}
            disabled={isGenerating || !workspaceText.trim()}
            size="sm"
            className="gap-2 primary-button"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Visual Type Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {visualTypes.map((type) => {
          const Icon = type.icon;
          const count = generatedItems.filter(i => i.type === type.id).length;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0',
                selectedType === type.id
                  ? 'style-chip-active'
                  : 'neu-flat text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4" />
              {type.label}
              {count > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px]">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="group relative rounded-2xl neu-pressed overflow-hidden"
            >
              {/* Visual Preview */}
              <div 
                ref={(el) => {
                  if (el) mermaidRefs.current.set(item.id, el);
                }}
                className="bg-background p-4 min-h-[200px] flex items-center justify-center"
              >
                {item.svg ? (
                  <div 
                    className="w-full overflow-auto"
                    dangerouslySetInnerHTML={{ __html: item.svg }}
                  />
                ) : (
                  <RefreshCw className="w-6 h-6 text-muted-foreground animate-spin" />
                )}
              </div>
              
              {/* Title & Description */}
              <div className="p-3 border-t border-border/30">
                <h4 className="text-xs font-bold text-foreground truncate">{item.title}</h4>
                <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
              </div>
              
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button 
                  onClick={() => handleDownload(item)}
                  className="p-3 rounded-xl bg-background/90 hover:bg-background transition-colors"
                  title="Download SVG"
                >
                  <Download className="w-5 h-5 text-foreground" />
                </button>
                <button 
                  onClick={() => setFullscreenItem(item)}
                  className="p-3 rounded-xl bg-background/90 hover:bg-background transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl neu-pressed p-8 text-center">
          <div className="w-12 h-12 rounded-xl neu-flat flex items-center justify-center mx-auto mb-3">
            {selectedType === 'diagram' && <Layout className="w-6 h-6 text-muted-foreground/50" />}
            {selectedType === 'flowchart' && <GitBranch className="w-6 h-6 text-muted-foreground/50" />}
            {selectedType === 'mindmap' && <Brain className="w-6 h-6 text-muted-foreground/50" />}
            {selectedType === 'timeline' && <Clock className="w-6 h-6 text-muted-foreground/50" />}
          </div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            {isGenerating ? 'Generating...' : `No ${selectedType}s yet`}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {isGenerating 
              ? 'Creating visual content from your text...'
              : 'Enter any text in workspace and click Generate'
            }
          </p>
        </div>
      )}

      {/* Fullscreen Modal */}
      {fullscreenItem && (
        <div 
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-8"
          onClick={() => setFullscreenItem(null)}
        >
          <button 
            onClick={() => setFullscreenItem(null)}
            className="absolute top-6 right-6 p-3 rounded-xl neu-button"
          >
            <X className="w-6 h-6" />
          </button>
          <div 
            className="max-w-5xl max-h-[80vh] overflow-auto bg-card rounded-3xl neu-flat p-8"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-2">{fullscreenItem.title}</h2>
            <p className="text-sm text-muted-foreground mb-6">{fullscreenItem.description}</p>
            {fullscreenItem.svg && (
              <div 
                className="w-full"
                dangerouslySetInnerHTML={{ __html: fullscreenItem.svg }}
              />
            )}
            <button
              onClick={() => handleDownload(fullscreenItem)}
              className="mt-6 primary-button flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download SVG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
