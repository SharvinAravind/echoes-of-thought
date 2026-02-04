-- Add RLS policies to prevent privilege escalation on user_roles table
-- Users should NOT be able to insert or update their own roles

-- First, verify RLS is enabled (it already is, but being explicit)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Add restrictive INSERT policy - only system/admin can insert (not users)
-- Using a FALSE condition means no regular users can insert
CREATE POLICY "System only - users cannot insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (false);

-- Add restrictive UPDATE policy - users cannot update their own roles
CREATE POLICY "System only - users cannot update roles"
ON public.user_roles
FOR UPDATE
USING (false)
WITH CHECK (false);

-- Add restrictive DELETE policy - users cannot delete roles
CREATE POLICY "System only - users cannot delete roles"
ON public.user_roles
FOR DELETE
USING (false);