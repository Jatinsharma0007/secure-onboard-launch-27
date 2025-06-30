
-- Fix the handle_new_user function to work with the actual auth.users table structure
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
    joined_at,
    last_login
  )
  values (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'avatar_url',
    'google', -- Set to google for OAuth users, or detect from raw_user_meta_data
    COALESCE(new.raw_user_meta_data ->> 'role', 'member'),
    new.raw_user_meta_data ->> 'phone',
    (new.raw_user_meta_data ->> 'location_id')::uuid,
    now(),
    now()
  );
  return new;
end;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
