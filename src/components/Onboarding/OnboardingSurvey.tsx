import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

const HOW_FOUND_OPTIONS = [
  'Google', 'Instagram', 'TikTok', 'YouTube', 'Friend', 'Event', 'Other'
];

const ROLE_OPTIONS = [
  'DJ/Producer', 'Manager', 'Label', 'Creator', 'Other'
];

const PLATFORM_OPTIONS = [
  'Instagram', 'TikTok', 'YouTube', 'Facebook', 'WhatsApp', 'Other'
];

const SET_LENGTH_OPTIONS = [
  '<1h', '1-2h', '2-4h', '4h+'
];

const GENRE_OPTIONS = [
  'House', 'Techno', 'Trance', 'Deep House', 'Progressive House', 'Tech House',
  'Drum & Bass', 'Dubstep', 'Hardstyle', 'Ambient', 'Minimal', 'Breakbeat',
  'Garage', 'Disco', 'Funk', 'Hip Hop', 'R&B', 'Pop', 'Rock', 'Other'
];

const POSTING_FREQUENCY_OPTIONS = [
  '1/week', '2-3/week', '4-6/week', 'Daily'
];

export const OnboardingSurvey = () => {
  const [howFound, setHowFound] = useState('');
  const [role, setRole] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [setLength, setSetLength] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [postingFrequency, setPostingFrequency] = useState('');
  const [country, setCountry] = useState('');
  const [timezone, setTimezone] = useState('');
  const [newsletterOptin, setNewsletterOptin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePlatformChange = (platform: string, checked: boolean) => {
    if (checked) {
      setPlatforms([...platforms, platform]);
    } else {
      setPlatforms(platforms.filter(p => p !== platform));
    }
  };

  const handleGenreChange = (genre: string, checked: boolean) => {
    if (checked) {
      setGenres([...genres, genre]);
    } else {
      setGenres(genres.filter(g => g !== genre));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to complete the survey.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const { error } = await supabase
        .from('user_survey')
        .insert([{
          user_id: user.id,
          how_found: howFound,
          role,
          platforms,
          set_length: setLength,
          genres,
          posting_frequency: postingFrequency,
          country,
          timezone,
          newsletter_optin: newsletterOptin
        }]);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome to Clipped Set!",
          description: "Your profile has been set up successfully.",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Clipped Set!</CardTitle>
          <CardDescription>
            Help us personalize your experience by answering a few quick questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="howFound">How did you discover Clipped Set?</Label>
              <Select value={howFound} onValueChange={setHowFound} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {HOW_FOUND_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">What's your role?</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Primary platforms (select all that apply):</Label>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORM_OPTIONS.map(platform => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform}
                      checked={platforms.includes(platform)}
                      onCheckedChange={(checked) => 
                        handlePlatformChange(platform, checked as boolean)
                      }
                    />
                    <Label htmlFor={platform} className="text-sm">{platform}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="setLength">Average set length?</Label>
              <Select value={setLength} onValueChange={setSetLength} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  {SET_LENGTH_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Genres you play (select all that apply):</Label>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {GENRE_OPTIONS.map(genre => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={genre}
                      checked={genres.includes(genre)}
                      onCheckedChange={(checked) => 
                        handleGenreChange(genre, checked as boolean)
                      }
                    />
                    <Label htmlFor={genre} className="text-sm">{genre}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postingFrequency">How often do you post content?</Label>
              <Select value={postingFrequency} onValueChange={setPostingFrequency} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {POSTING_FREQUENCY_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country/Region</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="NL">Netherlands</SelectItem>
                    <SelectItem value="ES">Spain</SelectItem>
                    <SelectItem value="IT">Italy</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern (EST)</SelectItem>
                    <SelectItem value="PST">Pacific (PST)</SelectItem>
                    <SelectItem value="CET">Central European (CET)</SelectItem>
                    <SelectItem value="GMT">Greenwich (GMT)</SelectItem>
                    <SelectItem value="JST">Japan (JST)</SelectItem>
                    <SelectItem value="AEST">Australian Eastern (AEST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletter"
                checked={newsletterOptin}
                onCheckedChange={(checked) => setNewsletterOptin(checked as boolean)}
              />
              <Label htmlFor="newsletter" className="text-sm">
                Subscribe to our newsletter for updates and tips
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Completing Setup...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};