import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Settings, LogOut } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Profile() {
  const { user, profile, loading, updateProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Redirect if not authenticated
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const formData = new FormData(e.currentTarget);
    const updates = {
      username: formData.get('username') as string,
      bio: formData.get('bio') as string,
      profile_picture_url: formData.get('profile_picture_url') as string,
    };
    
    await updateProfile(updates);
    setIsUpdating(false);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <h1 className="text-xl font-semibold">Profile Settings</h1>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile Overview */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.profile_picture_url || ''} />
                <AvatarFallback className="text-lg">
                  {profile.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              {profile.username}
            </CardTitle>
            <CardDescription>@{profile.username}</CardDescription>
            <div className="flex justify-center gap-2 mt-2">
              <Badge variant={profile.account_type === 'premium' ? 'default' : 'secondary'}>
                {profile.account_type || 'free'} Plan
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                Member since {new Date(profile.created_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Manage your profile details and preferences
                </CardDescription>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username"
                    name="username" 
                    defaultValue={profile.username || ''}
                    placeholder="Your username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile_picture_url">Profile Picture URL</Label>
                  <Input 
                    id="profile_picture_url"
                    name="profile_picture_url" 
                    type="url"
                    defaultValue={profile.profile_picture_url || ''}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    name="bio" 
                    defaultValue={profile.bio || ''}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Username</Label>
                  <p className="mt-1">@{profile.username || 'Not set'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="mt-1">{user?.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Bio</Label>
                  <p className="mt-1">{profile.bio || 'No bio added yet'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Account Type</Label>
                  <p className="mt-1 capitalize">{profile.account_type || 'Free'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}