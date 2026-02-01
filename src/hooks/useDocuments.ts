import { useState, useEffect, useCallback } from "react";
import type { Document } from "@/components/editor/DocumentSidebar";

const STORAGE_KEY = "echowrite_documents";

const generateId = () => Math.random().toString(36).substring(2, 15);

const getStoredDocuments = (): Document[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const docs = JSON.parse(stored);
      return docs.map((doc: any) => ({
        ...doc,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt),
      }));
    }
  } catch (e) {
    console.error("Failed to load documents:", e);
  }
  return [];
};

const saveDocuments = (documents: Document[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  } catch (e) {
    console.error("Failed to save documents:", e);
  }
};

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>(() => getStoredDocuments());
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);

  // Initialize with first document or create one
  useEffect(() => {
    if (documents.length === 0) {
      createDocument();
    } else if (!activeDocumentId) {
      setActiveDocumentId(documents[0].id);
    }
  }, []);

  // Save to localStorage whenever documents change
  useEffect(() => {
    saveDocuments(documents);
  }, [documents]);

  const activeDocument = documents.find((d) => d.id === activeDocumentId) || null;

  const createDocument = useCallback(() => {
    const newDoc: Document = {
      id: generateId(),
      title: "",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setActiveDocumentId(newDoc.id);
    return newDoc;
  }, []);

  const updateDocument = useCallback(
    (id: string, updates: Partial<Pick<Document, "title" | "content">>) => {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? { ...doc, ...updates, updatedAt: new Date() }
            : doc
        )
      );
    },
    []
  );

  const deleteDocument = useCallback(
    (id: string) => {
      setDocuments((prev) => {
        const filtered = prev.filter((d) => d.id !== id);
        // If we deleted the active document, select another
        if (activeDocumentId === id && filtered.length > 0) {
          setActiveDocumentId(filtered[0].id);
        } else if (filtered.length === 0) {
          // Create a new document if we deleted the last one
          const newDoc: Document = {
            id: generateId(),
            title: "",
            content: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setActiveDocumentId(newDoc.id);
          return [newDoc];
        }
        return filtered;
      });
    },
    [activeDocumentId]
  );

  const selectDocument = useCallback((id: string) => {
    setActiveDocumentId(id);
  }, []);

  return {
    documents,
    activeDocument,
    activeDocumentId,
    createDocument,
    updateDocument,
    deleteDocument,
    selectDocument,
  };
};
