import { supabase } from "@/integrations/supabase/client";
import { WritingStyle, WritingVariation } from "@/types/echowrite";

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
