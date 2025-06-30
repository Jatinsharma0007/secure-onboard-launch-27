-- Allow anonymous users to insert into users table (for OAuth and registration)
CREATE POLICY "Allow anonymous registration" ON public.users
  FOR INSERT TO anon
  WITH CHECK (true);

-- Temporarily disable RLS for development/testing if needed
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY; 