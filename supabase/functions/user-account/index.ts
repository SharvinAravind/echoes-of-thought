import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Valid actions for strict validation
const VALID_ACTIONS = ['bootstrap', 'activate-premium'] as const;
type Action = typeof VALID_ACTIONS[number];

interface UserAccountRequest {
  action: Action;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // 1) Verify JWT with an anon client (same pattern as existing backend functions)
    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await authClient.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const user = userData.user;
    const userId = user.id;
    const email = user.email ?? '';
    const name =
      (user.user_metadata as Record<string, unknown>)?.name ||
      (user.user_metadata as Record<string, unknown>)?.full_name ||
      (email ? email.split('@')[0] : 'User');

    let requestBody: Partial<UserAccountRequest> = {};
    try {
      requestBody = await req.json();
    } catch {
      // If no body or invalid JSON, treat as empty
    }

    const { action } = requestBody;

    // Validate action against allowed values
    if (!action || !VALID_ACTIONS.includes(action)) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid request' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2) Use service role for DB writes (RLS-safe)
    const service = createClient(supabaseUrl, serviceKey);

    // Ensure profile exists (upsert)
    if (email) {
      const { error: profileUpsertError } = await service
        .from('profiles')
        .upsert(
          {
            user_id: userId,
            email,
            name: typeof name === 'string' ? name : String(name),
          },
          { onConflict: 'user_id' },
        );

      if (profileUpsertError) {
        console.error('Profile sync failed:', profileUpsertError.code);
        return new Response(JSON.stringify({ ok: false, error: 'Unable to sync account' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Ensure a single role row exists for the user
    const { data: existingRoleRow, error: existingRoleError } = await service
      .from('user_roles')
      .select('id, role, usage_count, max_usage')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (existingRoleError) {
      console.error('Role check failed:', existingRoleError.code);
      return new Response(JSON.stringify({ ok: false, error: 'Unable to access account' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!existingRoleRow) {
      const { error: insertRoleError } = await service.from('user_roles').insert({
        user_id: userId,
        role: 'user',
        usage_count: 0,
        max_usage: 10,
      });

      if (insertRoleError) {
        console.error('Role init failed:', insertRoleError.code);
        return new Response(JSON.stringify({ ok: false, error: 'Unable to initialize account' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (action === 'activate-premium') {
      const { error: updateError } = await service
        .from('user_roles')
        .update({ role: 'premium' })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Premium activation failed:', updateError.code);
        return new Response(JSON.stringify({ ok: false, error: 'Unable to activate premium' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const { data: finalRoleRow, error: finalRoleError } = await service
      .from('user_roles')
      .select('role, usage_count, max_usage')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (finalRoleError) {
      console.error('Role confirm failed:', finalRoleError.code);
      return new Response(JSON.stringify({ ok: false, error: 'Unable to confirm account' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        action,
        userId,
        role: finalRoleRow?.role ?? 'user',
        usageCount: finalRoleRow?.usage_count ?? 0,
        maxUsage: finalRoleRow?.max_usage ?? 10,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Edge function error:', error instanceof Error ? error.message : 'unknown');
    return new Response(JSON.stringify({ ok: false, error: 'An error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
