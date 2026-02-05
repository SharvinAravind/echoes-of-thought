-- Add explicit DELETE protection to profiles table
-- Prevents users from deleting their own profiles (maintains data integrity)
CREATE POLICY "System only - users cannot delete profiles"
ON public.profiles
FOR DELETE
USING (false);