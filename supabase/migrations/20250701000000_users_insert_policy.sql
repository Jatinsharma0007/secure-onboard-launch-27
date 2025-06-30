-- Create insert policy for users table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can insert their own profile') THEN
        CREATE POLICY "Users can insert their own profile" ON public.users
          FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Auth trigger can insert user profiles') THEN
        CREATE POLICY "Auth trigger can insert user profiles" ON public.users
          FOR INSERT TO authenticated USING (true);
    END IF;
END $$; 