export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ai_insights: {
        Row: {
          created_at: string
          data: Json
          description: string | null
          expires_at: string | null
          id: string
          insight_type: string
          is_read: boolean | null
          priority: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          description?: string | null
          expires_at?: string | null
          id?: string
          insight_type: string
          is_read?: boolean | null
          priority?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          description?: string | null
          expires_at?: string | null
          id?: string
          insight_type?: string
          is_read?: boolean | null
          priority?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          key: string
          last_used: string | null
          name: string
          permissions: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key: string
          last_used?: string | null
          name: string
          permissions?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key?: string
          last_used?: string | null
          name?: string
          permissions?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      content_categories: {
        Row: {
          description: string | null
          id: number
          is_active: boolean | null
          name: string
          parent_category_id: number | null
        }
        Insert: {
          description?: string | null
          id?: never
          is_active?: boolean | null
          name: string
          parent_category_id?: number | null
        }
        Update: {
          description?: string | null
          id?: never
          is_active?: boolean | null
          name?: string
          parent_category_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string | null
          bio: string | null
          created_at: string | null
          last_login: string | null
          profile_picture_url: string | null
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          account_type?: string | null
          bio?: string | null
          created_at?: string | null
          last_login?: string | null
          profile_picture_url?: string | null
          updated_at?: string | null
          user_id: string
          username: string
        }
        Update: {
          account_type?: string | null
          bio?: string | null
          created_at?: string | null
          last_login?: string | null
          profile_picture_url?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          platform: string
          post_content: string | null
          post_settings: Json | null
          posted_at: string | null
          scheduled_at: string
          status: string | null
          user_id: string
          video_id: number | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          platform: string
          post_content?: string | null
          post_settings?: Json | null
          posted_at?: string | null
          scheduled_at: string
          status?: string | null
          user_id: string
          video_id?: number | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          platform?: string
          post_content?: string | null
          post_settings?: Json | null
          posted_at?: string | null
          scheduled_at?: string
          status?: string | null
          user_id?: string
          video_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_posts_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          invited_by: string | null
          joined_at: string | null
          permissions: Json | null
          role: string | null
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          permissions?: Json | null
          role?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          permissions?: Json | null
          role?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "team_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      team_workspaces: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          settings: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      video_analytics: {
        Row: {
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          platform: string | null
          recorded_at: string
          user_id: string | null
          video_id: number | null
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          platform?: string | null
          recorded_at?: string
          user_id?: string | null
          video_id?: number | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          platform?: string | null
          recorded_at?: string
          user_id?: string | null
          video_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_analytics_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_interactions: {
        Row: {
          created_at: string | null
          id: number
          interaction_details: Json | null
          interaction_type: string | null
          user_id: string | null
          video_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          interaction_details?: Json | null
          interaction_type?: string | null
          user_id?: string | null
          video_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: never
          interaction_details?: Json | null
          interaction_type?: string | null
          user_id?: string | null
          video_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_interactions_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_projects: {
        Row: {
          created_at: string
          generation_progress: number | null
          generation_status: string | null
          id: string
          media_assets: Json | null
          project_name: string
          script_content: string | null
          style_settings: Json | null
          template_id: string | null
          updated_at: string
          user_id: string
          video_id: number | null
          voice_settings: Json | null
        }
        Insert: {
          created_at?: string
          generation_progress?: number | null
          generation_status?: string | null
          id?: string
          media_assets?: Json | null
          project_name: string
          script_content?: string | null
          style_settings?: Json | null
          template_id?: string | null
          updated_at?: string
          user_id: string
          video_id?: number | null
          voice_settings?: Json | null
        }
        Update: {
          created_at?: string
          generation_progress?: number | null
          generation_status?: string | null
          id?: string
          media_assets?: Json | null
          project_name?: string
          script_content?: string | null
          style_settings?: Json | null
          template_id?: string | null
          updated_at?: string
          user_id?: string
          video_id?: number | null
          voice_settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "video_projects_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "video_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_projects_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          duration: number | null
          id: string
          industry: string | null
          is_premium: boolean | null
          likes_count: number | null
          style: string | null
          tags: string[] | null
          template_data: Json | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          uses_count: number | null
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          industry?: string | null
          is_premium?: boolean | null
          likes_count?: number | null
          style?: string | null
          tags?: string[] | null
          template_data?: Json | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          uses_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          industry?: string | null
          is_premium?: boolean | null
          likes_count?: number | null
          style?: string | null
          tags?: string[] | null
          template_data?: Json | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          uses_count?: number | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string | null
          comments_count: number | null
          created_at: string | null
          description: string | null
          duration: unknown | null
          id: number
          is_public: boolean | null
          likes_count: number | null
          platform: string | null
          prompt: string | null
          script: string | null
          style: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          url: string | null
          user_id: string
          video_url: string
          views_count: number | null
        }
        Insert: {
          category?: string | null
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          duration?: unknown | null
          id?: number
          is_public?: boolean | null
          likes_count?: number | null
          platform?: string | null
          prompt?: string | null
          script?: string | null
          style?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          url?: string | null
          user_id: string
          video_url: string
          views_count?: number | null
        }
        Update: {
          category?: string | null
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          duration?: unknown | null
          id?: number
          is_public?: boolean | null
          likes_count?: number | null
          platform?: string | null
          prompt?: string | null
          script?: string | null
          style?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          url?: string | null
          user_id?: string
          video_url?: string
          views_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
