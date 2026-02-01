import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface WriteRequest {
  action: 'variations' | 'translate' | 'rephrase';
  text: string;
  style?: string;
  targetLanguage?: string;
  lengthType?: 'simple' | 'medium' | 'long';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { action, text, style, targetLanguage, lengthType } = await req.json() as WriteRequest;

    if (!text || !action) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: text and action" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case 'variations':
        systemPrompt = `You are an elite writing suite.
Generate 4 distinct variations of the user's text for the goal: ${style || 'Improve Phrasing'}.
If the goal is 'Professional Email', each variation MUST be a full email including a Subject Line, Greeting, Body, and Closing.

Return ONLY a valid JSON object with a 'variations' array. Each item has:
- 'id': unique string (v1, v2, v3, v4)
- 'label': e.g. 'Standard Polished', 'Formal', 'Friendly', 'Concise'
- 'suggestedText': the full refined text
- 'tone': short description of the tone
- 'changes': array of {field: string, reason: string} explaining key changes

IMPORTANT: Return ONLY the JSON, no markdown code blocks, no extra text.`;
        userPrompt = `Refine this text into 4 variations:\n\n${text}`;
        break;

      case 'translate':
        systemPrompt = `You are a professional translator. Translate the given text to ${targetLanguage || 'English'}. 
Keep the same tone, formatting, and meaning. Return ONLY the translated text, nothing else.`;
        userPrompt = text;
        break;

      case 'rephrase':
        const rephrasePrompts = {
          simple: "Rewrite this text to be shorter and much simpler. Use plain language and be very concise.",
          medium: "Rewrite this text to be of moderate length. Ensure it is balanced, professional, and clear.",
          long: "Rewrite this text to be more detailed and comprehensive. Expand on the points while maintaining the same core message."
        };
        systemPrompt = rephrasePrompts[lengthType || 'medium'] + " Return ONLY the rephrased text, nothing else.";
        userPrompt = text;
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`Processing ${action} request for text length: ${text.length}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "";

    console.log(`AI response received for ${action}, length: ${content.length}`);

    let result;
    if (action === 'variations') {
      try {
        // Clean the response - remove markdown code blocks if present
        let cleanContent = content.trim();
        if (cleanContent.startsWith('```json')) {
          cleanContent = cleanContent.slice(7);
        }
        if (cleanContent.startsWith('```')) {
          cleanContent = cleanContent.slice(3);
        }
        if (cleanContent.endsWith('```')) {
          cleanContent = cleanContent.slice(0, -3);
        }
        cleanContent = cleanContent.trim();
        
        result = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error("JSON parse error:", parseError, "Content:", content);
        // Fallback: create a single variation from the content
        result = {
          variations: [{
            id: "v1",
            label: "Refined",
            suggestedText: content,
            tone: "Professional",
            changes: [{ field: "overall", reason: "AI-enhanced content" }]
          }]
        };
      }
    } else {
      result = { text: content };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in echowrite function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
