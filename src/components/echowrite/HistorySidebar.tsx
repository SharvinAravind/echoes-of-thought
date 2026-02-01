import { HistoryItem } from '@/types/echowrite';
import { History as HistoryIcon, X } from 'lucide-react';

interface HistorySidebarProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: HistoryItem) => void;
}

export const HistorySidebar = ({ history, isOpen, onClose, onSelectItem }: HistorySidebarProps) => {
  return (
    <aside
      className={`fixed left-0 top-0 h-full w-80 bg-card/95 backdrop-blur-3xl border-r border-border z-50 transition-transform duration-500 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } shadow-2xl`}
    >
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xs font-black text-gold-dark uppercase tracking-widest flex items-center gap-2">
            <HistoryIcon className="w-4 h-4" /> Archive
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
          {history.length === 0 ? (
            <div className="text-center mt-20">
              <p className="text-[10px] text-muted-foreground uppercase font-black">
                No History
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="p-4 rounded-2xl border border-border bg-muted hover:bg-card hover:border-primary/30 cursor-pointer transition-all shadow-sm"
              >
                <span className="text-[8px] font-black text-gold-dark uppercase block mb-1">
                  {item.style}
                </span>
                <p className="text-xs text-foreground line-clamp-2">
                  {item.originalText}
                </p>
                <p className="text-[9px] text-muted-foreground mt-2">
                  {new Date(item.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};
