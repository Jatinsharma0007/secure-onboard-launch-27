
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const onboardingSchema = z.object({
  preferredSpaceType: z.string().optional(),
  workStyle: z.string().optional(),
  notificationOptIn: z.boolean().default(false),
  aiPersonaEnabled: z.boolean().default(false),
  preferredHours: z.object({
    monday: z.object({ start: z.string(), end: z.string() }).optional(),
    tuesday: z.object({ start: z.string(), end: z.string() }).optional(),
    wednesday: z.object({ start: z.string(), end: z.string() }).optional(),
    thursday: z.object({ start: z.string(), end: z.string() }).optional(),
    friday: z.object({ start: z.string(), end: z.string() }).optional(),
    saturday: z.object({ start: z.string(), end: z.string() }).optional(),
    sunday: z.object({ start: z.string(), end: z.string() }).optional(),
  }).optional(),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export function OnboardingPage() {
  const [preferredHours, setPreferredHours] = useState<Record<string, { start: string; end: string }>>({});
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      notificationOptIn: false,
      aiPersonaEnabled: false,
    },
  });

  const notificationOptIn = watch('notificationOptIn');
  const aiPersonaEnabled = watch('aiPersonaEnabled');

  const handleTimeChange = (day: string, type: 'start' | 'end', value: string) => {
    setPreferredHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }));
  };

  const onSubmit = async (data: OnboardingFormData) => {
    if (!user) return;

    try {
      const preferences = {
        user_id: user.id,
        preferred_space_type: data.preferredSpaceType,
        work_style: data.workStyle,
        notification_opt_in: data.notificationOptIn,
        ai_persona_enabled: data.aiPersonaEnabled,
        preferred_hours: Object.keys(preferredHours).length > 0 ? preferredHours : null,
      };

      const { error } = await supabase
        .from('user_preferences')
        .upsert(preferences);

      if (error) throw error;

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome! Let's set up your preferences</CardTitle>
          <CardDescription className="text-center">
            Help us personalize your experience by sharing your preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Preferred Space Type</Label>
              <Select onValueChange={(value) => setValue('preferredSpaceType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your preferred space type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desk">Desk</SelectItem>
                  <SelectItem value="private_office">Private Office</SelectItem>
                  <SelectItem value="meeting_room">Meeting Room</SelectItem>
                  <SelectItem value="phone_booth">Phone Booth</SelectItem>
                  <SelectItem value="lounge">Lounge Area</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Work Style</Label>
              <Select onValueChange={(value) => setValue('workStyle', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your work style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deep_focus">Deep Focus</SelectItem>
                  <SelectItem value="collaborative">Collaborative</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Preferred Working Hours (Optional)</Label>
              <div className="grid grid-cols-1 gap-4">
                {DAYS.map((day) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium">
                      {DAY_LABELS[day as keyof typeof DAY_LABELS]}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        className="px-3 py-1 border rounded text-sm"
                        onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                      />
                      <span className="text-sm text-gray-500">to</span>
                      <input
                        type="time"
                        className="px-3 py-1 border rounded text-sm"
                        onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifications"
                  checked={notificationOptIn}
                  onCheckedChange={(checked) => setValue('notificationOptIn', checked as boolean)}
                />
                <Label htmlFor="notifications" className="text-sm font-normal">
                  I want to receive notifications about bookings and updates
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ai-persona"
                  checked={aiPersonaEnabled}
                  onCheckedChange={(checked) => setValue('aiPersonaEnabled', checked as boolean)}
                />
                <Label htmlFor="ai-persona" className="text-sm font-normal">
                  Enable AI persona for personalized recommendations
                </Label>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/dashboard')}
              >
                Skip for now
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Complete Setup'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
