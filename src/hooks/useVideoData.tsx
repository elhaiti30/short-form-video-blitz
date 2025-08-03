import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface VideoProject {
  id: string;
  video_id?: number;
  user_id: string;
  project_name: string;
  template_id?: string;
  script_content?: string;
  voice_settings?: any;
  style_settings?: any;
  media_assets?: any;
  generation_status: string;
  generation_progress: number;
  created_at: string;
  updated_at: string;
}

export interface VideoTemplate {
  id: string;
  title: string;
  description?: string;
  category: string;
  industry?: string;
  style?: string;
  duration?: number;
  thumbnail_url?: string;
  template_data?: any;
  tags?: string[];
  is_premium: boolean;
  likes_count: number;
  uses_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useVideoData = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [templates, setTemplates] = useState<VideoTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's video projects
  const fetchProjects = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('video_projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
  };

  // Fetch all templates
  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('video_templates')
      .select('*')
      .order('uses_count', { ascending: false });

    if (!error && data) {
      setTemplates(data);
    }
  };

  // Create a new video project
  const createProject = async (projectData: { project_name: string; template_id?: string; script_content?: string; voice_settings?: any; style_settings?: any; media_assets?: any; }) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('video_projects')
      .insert({
        ...projectData,
        user_id: user.id
      })
      .select()
      .single();

    if (!error && data) {
      setProjects(prev => [data, ...prev]);
      return data;
    }
    return null;
  };

  // Update project
  const updateProject = async (id: string, updates: Partial<VideoProject>) => {
    const { data, error } = await supabase
      .from('video_projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setProjects(prev => prev.map(p => p.id === id ? data : p));
      return data;
    }
    return null;
  };

  // Delete project
  const deleteProject = async (id: string) => {
    const { error } = await supabase
      .from('video_projects')
      .delete()
      .eq('id', id);

    if (!error) {
      setProjects(prev => prev.filter(p => p.id !== id));
      return true;
    }
    return false;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProjects(), fetchTemplates()]);
      setLoading(false);
    };

    if (user) {
      loadData();
    } else {
      // Still fetch templates for non-authenticated users
      fetchTemplates().then(() => setLoading(false));
    }
  }, [user]);

  return {
    projects,
    templates,
    loading,
    createProject,
    updateProject,
    deleteProject,
    refetch: () => {
      fetchProjects();
      fetchTemplates();
    }
  };
};