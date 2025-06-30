import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';

export function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  console.log("AuthCallback - user:", !!user, "loading:", loading);
  console.log("AuthCallback - URL:", window.location.href);
  
  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hashFragment = window.location.hash;
        console.log("AuthCallback - Hash fragment:", hashFragment);
        
        if (hashFragment && hashFragment.includes('access_token')) {
          console.log("AuthCallback - Processing access token");
          // Let Supabase handle the token exchange
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("AuthCallback - Error getting session:", error);
            navigate('/login', { replace: true });
            return;
          }
          
          console.log("AuthCallback - Session obtained:", !!data.session);
          // Redirect to dashboard on successful authentication
          window.location.href = '/dashboard';
          return;
        }
      } catch (error) {
        console.error("AuthCallback - Error processing callback:", error);
        navigate('/login', { replace: true });
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  useEffect(() => {
    console.log("AuthCallback - useEffect - user:", !!user, "loading:", loading);
    
    // If we have a user and auth is not loading, redirect to dashboard
    if (user && !loading) {
      console.log("AuthCallback - Redirecting to dashboard");
      window.location.href = '/dashboard';
    } 
    // If no user and auth is not loading, redirect to login
    else if (!user && !loading) {
      console.log("AuthCallback - Redirecting to login");
      navigate('/login', { replace: true });
    }
    // Otherwise, we're still loading - show spinner
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">Authenticating...</p>
      <p className="mt-2 text-sm text-gray-500">Processing your login, please wait...</p>
    </div>
  );
} 