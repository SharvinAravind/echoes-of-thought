import { useState } from 'react';
import { 
  Layout, 
  GitBranch, 
  Brain, 
  Clock, 
  Download, 
  Maximize2,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

type VisualType = 'diagram' | 'flowchart' | 'mindmap' | 'timeline';

interface VisualItem {
  id: string;
  type: VisualType;
  title: string;
  preview: string;
}

const visualTypes = [
  { id: 'diagram', label: 'Diagrams', icon: Layout },
  { id: 'flowchart', label: 'Flowcharts', icon: GitBranch },
  { id: 'mindmap', label: 'Mind Maps', icon: Brain },
  { id: 'timeline', label: 'Timelines', icon: Clock },
] as const;

export const VisualContentHub = () => {
  const [selectedType, setSelectedType] = useState<VisualType>('diagram');
  const [generatedItems] = useState<VisualItem[]>([]);

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
      </div>

      {/* Visual Type Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {visualTypes.map((type) => {
          const Icon = type.icon;
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
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      {generatedItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {generatedItems.map((item) => (
            <div 
              key={item.id}
              className="group relative rounded-2xl neu-pressed overflow-hidden aspect-square"
            >
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-xs">{item.title}</span>
              </div>
              
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="p-2 rounded-xl bg-background/90 hover:bg-background transition-colors">
                  <Download className="w-4 h-4 text-foreground" />
                </button>
                <button className="p-2 rounded-xl bg-background/90 hover:bg-background transition-colors">
                  <Maximize2 className="w-4 h-4 text-foreground" />
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
            No {selectedType}s yet
          </p>
          <p className="text-[10px] text-muted-foreground">
            Generate content in the workspace to create visuals
          </p>
        </div>
      )}
    </div>
  );
};
