import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPreferences } from '@/components/UserPreferences';
import { DataStateWrapper } from '@/components/ui/DataStateWrapper';
import { ErrorState } from '@/components/ui/ErrorState';

export default function Dashboard() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <DataStateWrapper loading={true} data={null}>
            <div></div>
          </DataStateWrapper>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <ErrorState 
            title="Access Required"
            description="Please log in to view your dashboard."
          />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome!</CardTitle>
              <CardDescription>Setting up your profile...</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Your profile is being initialized. Please refresh the page if this takes too long.
              </p>
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {profile?.full_name || user?.email}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {profile?.full_name || 'Not provided'}</p>
                <p><span className="font-medium">Email:</span> {profile?.email || 'Not provided'}</p>
                <p><span className="font-medium">Role:</span> {profile?.role || 'member'}</p>
                <p><span className="font-medium">Phone:</span> {profile?.phone || 'Not provided'}</p>
                <p><span className="font-medium">Organization:</span> {profile?.organization || 'Not provided'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Your current account status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-medium">Status:</span> {profile?.is_active ? 'Active' : 'Inactive'}</p>
                <p><span className="font-medium">Joined:</span> {profile?.joined_at ? new Date(profile.joined_at).toLocaleDateString() : 'Unknown'}</p>
                <p><span className="font-medium">Provider:</span> {profile?.auth_provider || 'Email'}</p>
                <p><span className="font-medium">Last Login:</span> {profile?.last_login ? new Date(profile.last_login).toLocaleDateString() : 'Unknown'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserPreferences />
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                Update Profile
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/my-bookings')}>
                View My Bookings
              </Button>
              <Button variant="destructive" className="w-full" onClick={signOut}>
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
