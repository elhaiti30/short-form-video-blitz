-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  subscription_plan TEXT DEFAULT 'free',
  total_videos_generated INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update video_templates with sample data
INSERT INTO public.video_templates (title, description, category, industry, style, duration, tags, template_data, thumbnail_url, is_premium)
VALUES 
  ('Product Launch', 'Professional product launch video template', 'Marketing', 'Technology', 'Modern', 30, ARRAY['product', 'launch', 'tech'], '{"scenes": [{"type": "title", "text": "{{product_name}}"}, {"type": "features", "items": "{{features}}"}, {"type": "cta", "text": "{{cta_text}}"}]}', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', false),
  ('Social Media Promo', 'Eye-catching social media promotion template', 'Social Media', 'E-commerce', 'Vibrant', 15, ARRAY['social', 'promo', 'sale'], '{"scenes": [{"type": "hook", "text": "{{hook_text}}"}, {"type": "offer", "text": "{{offer_details}}"}, {"type": "urgency", "text": "{{urgency_text}}"}]}', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400', false),
  ('Corporate Overview', 'Professional corporate introduction template', 'Business', 'Corporate', 'Professional', 60, ARRAY['corporate', 'business', 'intro'], '{"scenes": [{"type": "company_intro", "text": "{{company_name}}"}, {"type": "mission", "text": "{{mission_statement}}"}, {"type": "contact", "text": "{{contact_info}}"}]}', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', false),
  ('Tutorial & How-to', 'Step-by-step tutorial video template', 'Education', 'Technology', 'Clean', 120, ARRAY['tutorial', 'education', 'howto'], '{"scenes": [{"type": "intro", "text": "{{tutorial_title}}"}, {"type": "steps", "items": "{{step_list}}"}, {"type": "conclusion", "text": "{{conclusion}}"}]}', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400', false),
  ('Event Promotion', 'Dynamic event promotion template', 'Events', 'Entertainment', 'Energetic', 45, ARRAY['event', 'promotion', 'entertainment'], '{"scenes": [{"type": "event_title", "text": "{{event_name}}"}, {"type": "details", "text": "{{event_details}}"}, {"type": "registration", "text": "{{registration_info}}"}]}', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400', true),
  ('Testimonial Showcase', 'Customer testimonial video template', 'Marketing', 'Service', 'Trustworthy', 40, ARRAY['testimonial', 'customer', 'review'], '{"scenes": [{"type": "customer_intro", "text": "{{customer_name}}"}, {"type": "testimonial", "text": "{{testimonial_text}}"}, {"type": "rating", "text": "{{rating}}"}]}', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', true)
ON CONFLICT (id) DO NOTHING;

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();