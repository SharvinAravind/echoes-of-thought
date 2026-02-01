import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface WriteRequest {
  action: 'variations' | 'translate' | 'rephrase' | 'length-variations' | 'generate-visual';
  text: string;
  style?: string;
  targetLanguage?: string;
  lengthType?: 'simple' | 'medium' | 'long';
  visualType?: 'diagram' | 'flowchart' | 'mindmap' | 'timeline';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error("Missing or invalid authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized - Missing authentication token" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Validate the JWT by getting user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      console.error("JWT validation failed:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = userData.user.id;
    console.log(`Authenticated request from user: ${userId}`);

    // Check user's usage limits from database
    const { data: usageData, error: usageError } = await supabase
      .rpc('get_user_usage', { _user_id: userId });

    if (usageError) {
      console.error("Error fetching user usage:", usageError);
      // If user doesn't exist in roles table, they haven't completed setup
      return new Response(
        JSON.stringify({ error: "User profile not found. Please complete authentication setup." }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userUsage = usageData?.[0];
    if (!userUsage) {
      console.error("No usage data found for user");
      return new Response(
        JSON.stringify({ error: "User profile not found. Please complete authentication setup." }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has exceeded their usage limit (premium users have no limit)
    if (userUsage.role !== 'premium' && userUsage.usage_count >= userUsage.max_usage) {
      console.log(`User ${userId} has exceeded usage limit: ${userUsage.usage_count}/${userUsage.max_usage}`);
      return new Response(
        JSON.stringify({ error: "Usage limit exceeded. Upgrade to premium for unlimited access." }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { action, text, style, targetLanguage, lengthType, visualType } = await req.json() as WriteRequest;

    if (!text || !action) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: text and action" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate and sanitize input
    if (typeof text !== 'string' || text.length > 10000) {
      return new Response(
        JSON.stringify({ error: "Invalid text input - must be a string under 10000 characters" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case 'variations':
        systemPrompt = `You are an elite writing suite.
Generate 8 distinct variations of the user's text for the goal: ${style || 'Improve Phrasing'}.
If the goal is 'Professional Email', each variation MUST be a full email including a Subject Line, Greeting, Body, and Closing.

Return ONLY a valid JSON object with a 'variations' array. Each item has:
- 'id': unique string (v1, v2, v3, v4, v5, v6, v7, v8)
- 'label': e.g. 'Standard Polished', 'Formal', 'Friendly', 'Concise', 'Persuasive', 'Casual', 'Executive', 'Creative'
- 'suggestedText': the full refined text
- 'tone': short description of the tone
- 'changes': array of {field: string, reason: string} explaining key changes

IMPORTANT: Return ONLY the JSON, no markdown code blocks, no extra text.`;
        userPrompt = `Refine this text into 8 variations:\n\n${text}`;
        break;

      case 'length-variations':
        systemPrompt = `You are an elite writing suite.
Generate 5 variations for each length type (simple, medium, long) of the user's text.

For SIMPLE: Create 5 short, concise versions (1-2 sentences each)
For MEDIUM: Create 5 moderate length versions (3-5 sentences each)
For LONG: Create 5 detailed, comprehensive versions (6+ sentences each)

Return ONLY a valid JSON object with this structure:
{
  "simple": [
    {"id": "s1", "text": "...", "wordCount": 10},
    {"id": "s2", "text": "...", "wordCount": 12},
    {"id": "s3", "text": "...", "wordCount": 8},
    {"id": "s4", "text": "...", "wordCount": 15},
    {"id": "s5", "text": "...", "wordCount": 11}
  ],
  "medium": [
    {"id": "m1", "text": "...", "wordCount": 40},
    {"id": "m2", "text": "...", "wordCount": 45},
    {"id": "m3", "text": "...", "wordCount": 38},
    {"id": "m4", "text": "...", "wordCount": 42},
    {"id": "m5", "text": "...", "wordCount": 50}
  ],
  "long": [
    {"id": "l1", "text": "...", "wordCount": 100},
    {"id": "l2", "text": "...", "wordCount": 120},
    {"id": "l3", "text": "...", "wordCount": 95},
    {"id": "l4", "text": "...", "wordCount": 110},
    {"id": "l5", "text": "...", "wordCount": 130}
  ]
}

IMPORTANT: Return ONLY the JSON, no markdown code blocks, no extra text.`;
        userPrompt = `Create 5 variations for each length type (simple, medium, long) of this text:\n\n${text}`;
        break;

      case 'generate-visual':
        const visualPrompts: Record<string, string> = {
          diagram: `Create a Mermaid.js diagram representing the concepts in the text. Use a simple graph TD format.`,
          flowchart: `Create a Mermaid.js flowchart showing the process or workflow described. Use flowchart TD format with decision nodes where appropriate.`,
          mindmap: `Create a Mermaid.js mindmap with the main concept in the center and branches for related ideas.`,
          timeline: `Create a Mermaid.js timeline showing events or steps chronologically. Use the timeline format.`
        };
        
        systemPrompt = `You are a visual content generator. ${visualPrompts[visualType || 'diagram']}

Return ONLY a valid JSON object with this structure:
{
  "title": "A short descriptive title",
  "mermaidCode": "graph TD\\n    A[Start] --> B[Process]\\n    B --> C[End]",
  "description": "Brief description of what this visual represents"
}

Make sure the Mermaid code is valid and will render correctly. Use simple node names without special characters.
IMPORTANT: Return ONLY the JSON, no markdown code blocks, no extra text.`;
        userPrompt = `Generate a ${visualType || 'diagram'} for this content:\n\n${text}`;
        break;

      case 'translate':
        systemPrompt = `You are a professional translator. Translate the given text to ${targetLanguage || 'English'}. 
Keep the same tone, formatting, and meaning. Return ONLY the translated text, nothing else.`;
        userPrompt = text;
        break;

      case 'rephrase':
        const rephrasePrompts: Record<string, string> = {
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

    console.log(`Processing ${action} request for user ${userId}, text length: ${text.length}`);

    // Increment usage count before processing
    const { data: incrementResult, error: incrementError } = await supabase
      .rpc('increment_user_usage', { _user_id: userId });

    if (incrementError || incrementResult === false) {
      console.error("Failed to increment usage:", incrementError);
      return new Response(
        JSON.stringify({ error: "Usage limit exceeded. Upgrade to premium for unlimited access." }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    console.log(`AI response received for ${action}, user ${userId}, length: ${content.length}`);

    let result;
    if (action === 'variations' || action === 'length-variations' || action === 'generate-visual') {
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
        if (action === 'variations') {
          result = {
            variations: [{
              id: "v1",
              label: "Refined",
              suggestedText: content,
              tone: "Professional",
              changes: [{ field: "overall", reason: "AI-enhanced content" }]
            }]
          };
        } else if (action === 'length-variations') {
          result = {
            simple: [{ id: "s1", text: content.substring(0, 100), wordCount: 15 }],
            medium: [{ id: "m1", text: content.substring(0, 300), wordCount: 50 }],
            long: [{ id: "l1", text: content, wordCount: 100 }]
          };
        } else {
          result = {
            title: "Generated Visual",
            mermaidCode: "graph TD\n    A[Content] --> B[Analysis]",
            description: "Auto-generated diagram"
          };
        }
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
      JSON.stringify({ error: "An internal error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
