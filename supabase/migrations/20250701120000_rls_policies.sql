-- Add policies for inserting users
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can insert their own profile') THEN
        CREATE POLICY "Users can insert their own profile" ON public.users
          FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Auth trigger can insert user profiles') THEN
        CREATE POLICY "Auth trigger can insert user profiles" ON public.users
          FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow anonymous registration') THEN
        CREATE POLICY "Allow anonymous registration" ON public.users
          FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Temporarily disable RLS for development/testing if needed
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY; 