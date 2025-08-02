-- Create comprehensive database schema for AI video platform

-- Create video templates table
CREATE TABLE public.video_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  industry TEXT,
  style TEXT,
  duration INTEGER, -- in seconds
  thumbnail_url TEXT,
  template_data JSONB, -- stores template configuration
  tags TEXT[],
  is_premium BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  uses_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for templates
ALTER TABLE public.video_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for templates
CREATE POLICY "Templates are viewable by everyone" ON public.video_templates
  FOR SELECT USING (true);

CREATE POLICY "Users can create templates" ON public.video_templates
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own templates" ON public.video_templates
  FOR UPDATE USING (auth.uid() = created_by);

-- Create video projects table (extends existing videos table)
CREATE TABLE public.video_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id BIGINT REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  project_name TEXT NOT NULL,
  template_id UUID REFERENCES public.video_templates(id),
  script_content TEXT,
  voice_settings JSONB,
  style_settings JSONB,
  media_assets JSONB, -- array of uploaded files
  generation_status TEXT DEFAULT 'draft', -- draft, generating, completed, failed
  generation_progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for video projects
ALTER TABLE public.video_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for video projects
CREATE POLICY "Users can view their own projects" ON public.video_projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects" ON public.video_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.video_projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.video_projects
  FOR DELETE USING (auth.uid() = user_id);

-- Create team workspaces table
CREATE TABLE public.team_workspaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for workspaces
ALTER TABLE public.team_workspaces ENABLE ROW LEVEL SECURITY;

-- Create team members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.team_workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  role TEXT DEFAULT 'member', -- owner, admin, editor, viewer, member
  permissions JSONB DEFAULT '{}',
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for team members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for team workspaces
CREATE POLICY "Users can view workspaces they belong to" ON public.team_workspaces
  FOR SELECT USING (
    id IN (
      SELECT workspace_id FROM public.team_members WHERE user_id = auth.uid()
    ) OR owner_id = auth.uid()
  );

CREATE POLICY "Users can create workspaces" ON public.team_workspaces
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Workspace owners can update" ON public.team_workspaces
  FOR UPDATE USING (auth.uid() = owner_id);

-- Create policies for team members
CREATE POLICY "Team members can view workspace members" ON public.team_members
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM public.team_members WHERE user_id = auth.uid()
    )
  );

-- Create video analytics table
CREATE TABLE public.video_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id BIGINT REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  metric_type TEXT NOT NULL, -- views, likes, shares, comments, watch_time
  metric_value NUMERIC NOT NULL,
  platform TEXT, -- youtube, tiktok, instagram, etc.
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS for analytics
ALTER TABLE public.video_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics
CREATE POLICY "Users can view analytics for their videos" ON public.video_analytics
  FOR SELECT USING (
    video_id IN (
      SELECT id FROM public.videos WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert analytics for their videos" ON public.video_analytics
  FOR INSERT WITH CHECK (
    video_id IN (
      SELECT id FROM public.videos WHERE user_id = auth.uid()
    )
  );

-- Create scheduled posts table
CREATE TABLE public.scheduled_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id BIGINT REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  platform TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  post_content TEXT,
  post_settings JSONB DEFAULT '{}',
  status TEXT DEFAULT 'scheduled', -- scheduled, posted, failed, cancelled
  posted_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for scheduled posts
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for scheduled posts
CREATE POLICY "Users can manage their scheduled posts" ON public.scheduled_posts
  FOR ALL USING (auth.uid() = user_id);

-- Create AI insights table
CREATE TABLE public.ai_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  insight_type TEXT NOT NULL, -- performance, content, audience, trends
  title TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL,
  priority TEXT DEFAULT 'medium', -- low, medium, high
  is_read BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for AI insights
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- Create policies for AI insights
CREATE POLICY "Users can view their own insights" ON public.ai_insights
  FOR ALL USING (auth.uid() = user_id);

-- Create storage buckets for media assets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('video-assets', 'video-assets', false),
  ('thumbnails', 'thumbnails', true),
  ('user-uploads', 'user-uploads', false);

-- Create storage policies for video assets
CREATE POLICY "Users can upload their own video assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'video-assets' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own video assets" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'video-assets' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policies for thumbnails (public)
CREATE POLICY "Thumbnails are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'thumbnails');

CREATE POLICY "Users can upload thumbnails" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'thumbnails');

-- Create storage policies for user uploads
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own uploads" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_video_templates_updated_at
  BEFORE UPDATE ON public.video_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_video_projects_updated_at
  BEFORE UPDATE ON public.video_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_workspaces_updated_at
  BEFORE UPDATE ON public.team_workspaces
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample templates
INSERT INTO public.video_templates (title, description, category, industry, style, duration, template_data, tags, is_premium) VALUES
('Marketing Explainer', 'Perfect template for explaining products or services', 'Marketing', 'Technology', 'Modern', 60, '{"style": "modern", "transition": "fade", "music": "upbeat"}', ARRAY['marketing', 'explainer', 'business'], false),
('Social Media Story', 'Engaging vertical video for social platforms', 'Social Media', 'Lifestyle', 'Trendy', 30, '{"style": "trendy", "orientation": "vertical", "effects": "dynamic"}', ARRAY['social', 'story', 'vertical'], false),
('Corporate Presentation', 'Professional template for business presentations', 'Business', 'Corporate', 'Professional', 120, '{"style": "professional", "layout": "slides", "branding": true}', ARRAY['corporate', 'presentation', 'business'], true),
('Product Demo', 'Showcase your product features effectively', 'Product', 'E-commerce', 'Clean', 90, '{"style": "clean", "showcase": "product", "callouts": true}', ARRAY['product', 'demo', 'features'], false),
('Educational Content', 'Perfect for tutorials and educational videos', 'Education', 'Education', 'Informative', 180, '{"style": "informative", "structure": "lesson", "graphics": "educational"}', ARRAY['education', 'tutorial', 'learning'], false);