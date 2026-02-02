-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'premium');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles as per security requirements)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    role app_role NOT NULL DEFAULT 'user',
    usage_count INTEGER NOT NULL DEFAULT 0,
    max_usage INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles (read-only for users, writes via functions only)
CREATE POLICY "Users can view own role"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

-- Security definer function to check user role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Security definer function to get user usage (for edge function)
CREATE OR REPLACE FUNCTION public.get_user_usage(_user_id UUID)
RETURNS TABLE(role app_role, usage_count INTEGER, max_usage INTEGER)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT ur.role, ur.usage_count, ur.max_usage
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND auth.uid() = _user_id
$$;

-- Security definer function to increment usage (for edge function)
CREATE OR REPLACE FUNCTION public.increment_user_usage(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_role app_role;
    current_usage INTEGER;
    current_max INTEGER;
BEGIN
    -- Verify the caller is the same user
    IF auth.uid() != _user_id THEN
        RETURN FALSE;
    END IF;
    
    -- Get current usage
    SELECT role, usage_count, max_usage 
    INTO current_role, current_usage, current_max
    FROM public.user_roles 
    WHERE user_id = _user_id;
    
    -- Premium users have no limit
    IF current_role = 'premium' THEN
        UPDATE public.user_roles 
        SET usage_count = usage_count + 1, updated_at = now()
        WHERE user_id = _user_id;
        RETURN TRUE;
    END IF;
    
    -- Check if user has exceeded limit
    IF current_usage >= current_max THEN
        RETURN FALSE;
    END IF;
    
    -- Increment usage
    UPDATE public.user_roles 
    SET usage_count = usage_count + 1, updated_at = now()
    WHERE user_id = _user_id;
    
    RETURN TRUE;
END;
$$;

-- Trigger function to create profile and role on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (user_id, email, name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
    
    -- Create user role with default 'user' role
    INSERT INTO public.user_roles (user_id, role, usage_count, max_usage)
    VALUES (NEW.id, 'user', 0, 10);
    
    RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();