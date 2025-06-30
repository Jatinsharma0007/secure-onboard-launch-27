-- Enable RLS on all tables (will skip if already enabled)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Create policies for users table (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view their own profile') THEN
        CREATE POLICY "Users can view their own profile" ON public.users
          FOR SELECT USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update their own profile') THEN
        CREATE POLICY "Users can update their own profile" ON public.users
          FOR UPDATE USING (auth.uid() = id);
    END IF;
    
    -- Add policies for inserting users
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can insert their own profile') THEN
        CREATE POLICY "Users can insert their own profile" ON public.users
          FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Auth trigger can insert user profiles') THEN
        CREATE POLICY "Auth trigger can insert user profiles" ON public.users
          FOR INSERT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow anonymous registration') THEN
        CREATE POLICY "Allow anonymous registration" ON public.users
          FOR INSERT TO anon WITH CHECK (true);
    END IF;
END $$;

-- Create policies for locations table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'locations' AND policyname = 'Authenticated users can view locations') THEN
        CREATE POLICY "Authenticated users can view locations" ON public.locations
          FOR SELECT TO authenticated USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'locations' AND policyname = 'Admins can manage locations') THEN
        CREATE POLICY "Admins can manage locations" ON public.locations
          FOR ALL USING (
            EXISTS (
              SELECT 1 FROM public.users 
              WHERE id = auth.uid() AND role = 'admin'
            )
          );
    END IF;
END $$;

-- Update the handle_new_user function to handle OAuth and regular signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
begin
  insert into public.users (
    id,
    email,
    full_name,
    avatar_url,
    auth_provider,
    role,
    phone,
    location_id,
    joined_at
  )
  values (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'avatar_url',
    COALESCE(new.app_metadata ->> 'provider', 'email'),
    COALESCE(new.raw_user_meta_data ->> 'role', 'member'),
    new.raw_user_meta_data ->> 'phone',
    (new.raw_user_meta_data ->> 'location_id')::uuid,
    now()
  );
  return new;
end;
$$;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Temporarily disable RLS for development/testing if needed
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
