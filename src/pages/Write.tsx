import { useState, useEffect, useRef } from "react";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { WritingEditor } from "@/components/editor/WritingEditor";
import { DocumentSidebar } from "@/components/editor/DocumentSidebar";
import { useDocuments } from "@/hooks/useDocuments";

const Write = () => {
  const {
    documents,
    activeDocument,
    activeDocumentId,
    createDocument,
    updateDocument,
    deleteDocument,
    selectDocument,
  } = useDocuments();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle content changes with auto-save
  const handleContentChange = (content: string) => {
    if (!activeDocumentId) return;
    
    setIsSaved(false);
    updateDocument(activeDocumentId, { content });

    // Debounced save indicator
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      setIsSaved(true);
    }, 500);
  };

  const handleTitleChange = (title: string) => {
    if (!activeDocumentId) return;
    updateDocument(activeDocumentId, { title });
  };

  return (
    <div className="min-h-screen bg-background">
      <DocumentSidebar
        documents={documents}
        activeDocumentId={activeDocumentId}
        onSelectDocument={selectDocument}
        onNewDocument={createDocument}
        onDeleteDocument={deleteDocument}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        <EditorHeader
          title={activeDocument?.title || ""}
          onTitleChange={handleTitleChange}
          content={activeDocument?.content || ""}
          isSaved={isSaved}
        />

        <main className="container mx-auto px-6 py-8 max-w-3xl">
          <div className="paper-texture rounded-xl p-8 min-h-[calc(100vh-160px)] echo-card">
            <WritingEditor
              content={activeDocument?.content || ""}
              onChange={handleContentChange}
              placeholder="Let your thoughts flow..."
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Write;
