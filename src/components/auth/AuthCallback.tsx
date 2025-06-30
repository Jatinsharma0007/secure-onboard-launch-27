import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  console.log("AuthCallback - user:", !!user, "loading:", loading);

  useEffect(() => {
    console.log("AuthCallback - useEffect - user:", !!user, "loading:", loading);
    
    // If we have a user and auth is not loading, redirect to homepage
    if (user && !loading) {
      console.log("AuthCallback - Redirecting to homepage");
      // Use window.location for a hard redirect
      window.location.href = '/';
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
    </div>
  );
} 