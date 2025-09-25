import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Share2, Youtube, Instagram, Video, Clock, Send } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface SocialAccount {
  id: string;
  platform: string;
  account_name: string;
  is_active: boolean;
}

interface ScheduledPost {
  id: string;
  platform: string;
  post_content: string;
  scheduled_at: string;
  status: string;
  video_id?: number;
}

export const SocialMediaManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      const [{ data: accountsData }, { data: postsData }] = await Promise.all([
        supabase
          .from('social_accounts')
          .select('*')
          .eq('user_id', user.id),
        supabase
          .from('scheduled_posts')
          .select('*')
          .eq('user_id', user.id)
          .order('scheduled_at', { ascending: false })
      ]);

      setAccounts(accountsData || []);
      setScheduledPosts(postsData || []);
    } catch (error) {
      console.error('Error fetching social media data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch social media data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const schedulePost = async (postData: {
    platform: string;
    post_content: string;
    scheduled_at: string;
    video_id?: number;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('scheduled_posts')
        .insert({
          ...postData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setScheduledPosts(prev => [data, ...prev]);
      setIsScheduleDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Post scheduled successfully",
      });
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast({
        title: "Error",
        description: "Failed to schedule post",
        variant: "destructive",
      });
    }
  };

  const connectAccount = async (platform: string, accountName: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .insert({
          user_id: user.id,
          platform,
          account_name: accountName,
        })
        .select()
        .single();

      if (error) throw error;
      
      setAccounts(prev => [...prev, data]);
      
      toast({
        title: "Success",
        description: `${platform} account connected successfully`,
      });
    } catch (error) {
      console.error('Error connecting account:', error);
      toast({
        title: "Error",
        description: "Failed to connect account",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const SchedulePostForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
    const [formData, setFormData] = useState({
      platform: '',
      post_content: '',
      scheduled_at: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="platform">Platform</Label>
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="post_content">Post Content</Label>
          <Textarea
            id="post_content"
            value={formData.post_content}
            onChange={(e) => setFormData(prev => ({ ...prev, post_content: e.target.value }))}
            placeholder="Write your post content..."
            rows={4}
            required
          />
        </div>

        <div>
          <Label htmlFor="scheduled_at">Schedule Date & Time</Label>
          <Input
            id="scheduled_at"
            type="datetime-local"
            value={formData.scheduled_at}
            onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Post
        </Button>
      </form>
    );
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'tiktok':
        return <Video className="h-4 w-4" />;
      default:
        return <Share2 className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading social media data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Social Media Manager</h2>
          <p className="text-muted-foreground">
            Schedule and manage your video posts across social platforms
          </p>
        </div>
        
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Social Media Post</DialogTitle>
              <DialogDescription>
                Schedule your video to be posted automatically across your social media accounts.
              </DialogDescription>
            </DialogHeader>
            <SchedulePostForm onSubmit={schedulePost} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Manage your connected social media accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="text-center py-8">
              <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Accounts Connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect your social media accounts to start scheduling posts
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => connectAccount('youtube', 'My YouTube Channel')}>
                  <Youtube className="h-4 w-4 mr-2" />
                  YouTube
                </Button>
                <Button variant="outline" onClick={() => connectAccount('instagram', 'My Instagram')}>
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </Button>
                <Button variant="outline" onClick={() => connectAccount('tiktok', 'My TikTok')}>
                  <Video className="h-4 w-4 mr-2" />
                  TikTok
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center p-3 border rounded-lg">
                  {getPlatformIcon(account.platform)}
                  <div className="ml-3">
                    <p className="font-medium">{account.account_name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{account.platform}</p>
                  </div>
                  <div className={`ml-auto w-2 h-2 rounded-full ${account.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scheduled Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Posts</CardTitle>
          <CardDescription>
            View and manage your scheduled social media posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scheduledPosts.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Scheduled Posts</h3>
              <p className="text-muted-foreground">
                Schedule your first post to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getPlatformIcon(post.platform)}
                    <div>
                      <p className="font-medium line-clamp-1">{post.post_content}</p>
                      <p className="text-sm text-muted-foreground">
                        Scheduled for {new Date(post.scheduled_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};