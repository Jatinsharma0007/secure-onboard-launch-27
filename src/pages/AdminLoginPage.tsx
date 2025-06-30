
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const { signIn, user, loading } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  if (user && !loading) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      setIsCheckingAdmin(true);
      
      // First, sign in the user
      await signIn(data.email, data.password);
      
      // Get the current session to check admin status
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('Authentication failed');
      }

      // Check if user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (adminError || !adminData) {
        // Sign out if not an admin
        await supabase.auth.signOut();
        toast({
          title: "Access Denied",
          description: "You are not authorized to access the admin panel.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome Admin!",
        description: `Logged in as ${adminData.admin_level}`,
      });

      // Navigation will be handled by the auth context
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your admin credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your admin email"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password')}
                  className={errors.password ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || loading || isCheckingAdmin}
            >
              {isSubmitting || isCheckingAdmin ? 'Signing in...' : 'Sign in as Admin'}
            </Button>
          </form>

          <div className="text-center text-sm">
            Not an admin?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Regular sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
