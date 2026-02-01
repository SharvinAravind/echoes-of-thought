import { useState } from "react";
import { FileText, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DocumentSidebarProps {
  documents: Document[];
  activeDocumentId: string | null;
  onSelectDocument: (id: string) => void;
  onNewDocument: () => void;
  onDeleteDocument: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const DocumentSidebar = ({
  documents,
  activeDocumentId,
  onSelectDocument,
  onNewDocument,
  onDeleteDocument,
  isOpen,
  onToggle,
}: DocumentSidebarProps) => {
  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 p-2 bg-card border border-border rounded-r-lg hover:bg-accent/10 transition-colors"
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-30 transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-4">
            <h2 className="font-serif text-lg font-semibold text-sidebar-foreground">
              Documents
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNewDocument}
              className="hover:bg-sidebar-accent/20"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Document list */}
          <div className="flex-1 overflow-y-auto space-y-1">
            {documents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No documents yet.<br />Click + to create one.
              </p>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className={cn(
                    "group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                    activeDocumentId === doc.id
                      ? "bg-sidebar-accent/20 border border-sidebar-accent/30"
                      : "hover:bg-sidebar-accent/10"
                  )}
                  onClick={() => onSelectDocument(doc.id)}
                >
                  <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {doc.title || "Untitled"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doc.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDocument(doc.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
