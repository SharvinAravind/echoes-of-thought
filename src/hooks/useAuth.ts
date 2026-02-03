import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserTier } from '@/types/echowrite';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  tier: UserTier;
  usageCount: number;
  maxUsage: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile and role from database
  const fetchUserData = useCallback(async (userId: string, userEmail?: string) => {
    try {
      // Fetch profile - use maybeSingle to handle missing profile gracefully
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, name')
        .eq('user_id', userId)
        .maybeSingle();

      // Fetch role and usage - use maybeSingle to handle missing role gracefully
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role, usage_count, max_usage')
        .eq('user_id', userId)
        .maybeSingle();

      // If profile or role doesn't exist (user created before trigger), return defaults
      if (!profile || !roleData) {
        console.log('User profile or role not found, using defaults for:', userId);
        const email = profile?.email || userEmail || 'user@example.com';
        return {
          id: userId,
          email: email,
          name: profile?.name || email.split('@')[0],
          tier: (roleData?.role || 'user') as UserTier,
          usageCount: roleData?.usage_count || 0,
          maxUsage: roleData?.max_usage || 10
        };
      }

      if (profileError) {
        console.error('Profile fetch error:', profileError);
      }
      if (roleError) {
        console.error('Role fetch error:', roleError);
      }

      return {
        id: userId,
        email: profile.email,
        name: profile.name || profile.email.split('@')[0],
        tier: roleData.role as UserTier,
        usageCount: roleData.usage_count,
        maxUsage: roleData.max_usage
      };
    } catch (err) {
      console.error('Error fetching user data:', err);
      return null;
    }
  }, []);

  // Set up auth state listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Defer database fetch to avoid deadlock
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserData(newSession.user.id, newSession.user.email).then(setAuthUser);
          }, 0);
        } else {
          setAuthUser(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        fetchUserData(existingSession.user.id, existingSession.user.email).then(setAuthUser);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { name: name || email.split('@')[0] }
      }
    });

    return { data, error };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    // Clear any localStorage data on logout
    try {
      localStorage.removeItem('echowrite_history');
      localStorage.removeItem('echowrite_user');
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
    }
    
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  const refreshUserData = useCallback(async () => {
    if (user) {
      const data = await fetchUserData(user.id, user.email);
      if (data) {
        setAuthUser(data);
      }
    }
  }, [user, fetchUserData]);

  return {
    user,
    session,
    authUser,
    loading,
    signUp,
    signIn,
    signOut,
    refreshUserData
  };
};
