
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { DataStateWrapper } from '@/components/ui/DataStateWrapper';

export function UserPreferences() {
  const { preferences, loading, error, updatePreferences, refetch } = useUserPreferences();
  const [formData, setFormData] = useState({
    preferred_space_type: preferences?.preferred_space_type || '',
    work_style: preferences?.work_style || '',
    ai_persona_enabled: preferences?.ai_persona_enabled || false,
    notification_opt_in: preferences?.notification_opt_in || false,
  });

  React.useEffect(() => {
    if (preferences) {
      setFormData({
        preferred_space_type: preferences.preferred_space_type || '',
        work_style: preferences.work_style || '',
        ai_persona_enabled: preferences.ai_persona_enabled || false,
        notification_opt_in: preferences.notification_opt_in || false,
      });
    }
  }, [preferences]);

  const handleSave = async () => {
    await updatePreferences(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Preferences</CardTitle>
        <CardDescription>Customize your workspace experience</CardDescription>
      </CardHeader>
      <CardContent>
        <DataStateWrapper
          loading={loading}
          error={error}
          data={preferences || {}}
          emptyTitle="No preferences found"
          emptyDescription="Set up your preferences to personalize your experience."
          onRetry={refetch}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="preferred_space_type">Preferred Space Type</Label>
              <Select 
                value={formData.preferred_space_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, preferred_space_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred space type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desk">Desk</SelectItem>
                  <SelectItem value="room">Meeting Room</SelectItem>
                  <SelectItem value="pod">Focus Pod</SelectItem>
                  <SelectItem value="lounge">Lounge Area</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="work_style">Work Style</Label>
              <Select 
                value={formData.work_style} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, work_style: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your work style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="focused">Focused & Quiet</SelectItem>
                  <SelectItem value="collaborative">Collaborative</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                  <SelectItem value="social">Social & Interactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ai_persona">AI Assistant</Label>
                <p className="text-sm text-gray-600">Enable AI-powered booking suggestions</p>
              </div>
              <Switch
                id="ai_persona"
                checked={formData.ai_persona_enabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ai_persona_enabled: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-sm text-gray-600">Receive booking reminders and updates</p>
              </div>
              <Switch
                id="notifications"
                checked={formData.notification_opt_in}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notification_opt_in: checked }))}
              />
            </div>

            <Button onClick={handleSave} className="w-full">
              Save Preferences
            </Button>
          </div>
        </DataStateWrapper>
      </CardContent>
    </Card>
  );
}
