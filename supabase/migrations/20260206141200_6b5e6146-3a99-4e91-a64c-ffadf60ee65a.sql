-- Fix RLS policies: Replace RESTRICTIVE with PERMISSIVE for user operations
-- This ensures explicit permission granting rather than relying on restriction only

-- ============================================
-- PROFILES TABLE - Replace RESTRICTIVE with PERMISSIVE for user operations
-- ============================================

-- Drop existing RESTRICTIVE policies for user operations
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create PERMISSIVE policies for user operations
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Note: Keep the RESTRICTIVE "System only - users cannot delete profiles" policy as-is

-- ============================================
-- USER_ROLES TABLE - Replace RESTRICTIVE SELECT with PERMISSIVE
-- ============================================

-- Drop existing RESTRICTIVE SELECT policy
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;

-- Create PERMISSIVE SELECT policy
CREATE POLICY "Users can view own role"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Note: Keep RESTRICTIVE policies for INSERT/UPDATE/DELETE (system-only operations)