import { supabase } from "@/integrations/supabase/client";
import { WritingStyle, WritingVariation } from "@/types/echowrite";

export interface LengthVariation {
  id: string;
  text: string;
  wordCount: number;
}

export interface LengthVariations {
  simple: LengthVariation[];
  medium: LengthVariation[];
  long: LengthVariation[];
}

export interface VisualContent {
  title: string;
  mermaidCode: string;
  description: string;
}

export const getWritingVariations = async (
  text: string,
  style: WritingStyle
): Promise<{ variations: WritingVariation[] }> => {
  const { data, error } = await supabase.functions.invoke('echowrite', {
    body: { action: 'variations', text, style }
  });

  if (error) {
    console.error("Error getting variations:", error);
    throw new Error(error.message || "Failed to get writing variations");
  }

  return data;
};

export const getLengthVariations = async (
  text: string
): Promise<LengthVariations> => {
  const { data, error } = await supabase.functions.invoke('echowrite', {
    body: { action: 'length-variations', text }
  });

  if (error) {
    console.error("Error getting length variations:", error);
    throw new Error(error.message || "Failed to get length variations");
  }

  return data;
};

export const generateVisualContent = async (
  text: string,
  visualType: 'diagram' | 'flowchart' | 'mindmap' | 'timeline'
): Promise<VisualContent> => {
  const { data, error } = await supabase.functions.invoke('echowrite', {
    body: { action: 'generate-visual', text, visualType }
  });

  if (error) {
    console.error("Error generating visual:", error);
    throw new Error(error.message || "Failed to generate visual content");
  }

  return data;
};

export const translateText = async (
  text: string,
  targetLanguage: string
): Promise<string> => {
  const { data, error } = await supabase.functions.invoke('echowrite', {
    body: { action: 'translate', text, targetLanguage }
  });

  if (error) {
    console.error("Error translating:", error);
    throw new Error(error.message || "Failed to translate text");
  }

  return data.text;
};

export const rephraseText = async (
  text: string,
  lengthType: 'simple' | 'medium' | 'long'
): Promise<string> => {
  const { data, error } = await supabase.functions.invoke('echowrite', {
    body: { action: 'rephrase', text, lengthType }
  });

  if (error) {
    console.error("Error rephrasing:", error);
    throw new Error(error.message || "Failed to rephrase text");
  }

  return data.text;
};
