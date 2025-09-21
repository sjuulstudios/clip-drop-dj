export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      clips: {
        Row: {
          aspect_ratio: string | null
          created_at: string
          end_time: number
          export_url: string | null
          id: string
          name: string
          start_time: number
          timeline_json: Json | null
          updated_at: string
          upload_id: string
          user_id: string
        }
        Insert: {
          aspect_ratio?: string | null
          created_at?: string
          end_time: number
          export_url?: string | null
          id?: string
          name: string
          start_time: number
          timeline_json?: Json | null
          updated_at?: string
          upload_id: string
          user_id: string
        }
        Update: {
          aspect_ratio?: string | null
          created_at?: string
          end_time?: number
          export_url?: string | null
          id?: string
          name?: string
          start_time?: number
          timeline_json?: Json | null
          updated_at?: string
          upload_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clips_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      cuts: {
        Row: {
          confidence: number | null
          created_at: string
          cut_type: string | null
          end_time: number | null
          id: string
          start_time: number
          upload_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          cut_type?: string | null
          end_time?: number | null
          id?: string
          start_time: number
          upload_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          cut_type?: string | null
          end_time?: number | null
          id?: string
          start_time?: number
          upload_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cuts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          job_type: string
          started_at: string | null
          status: string | null
          upload_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_type: string
          started_at?: string | null
          status?: string | null
          upload_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_type?: string
          started_at?: string | null
          status?: string | null
          upload_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          artist_name: string
          created_at: string
          first_name: string
          id: string
          instagram_link: string | null
          last_name: string
          theme_preference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          artist_name: string
          created_at?: string
          first_name: string
          id?: string
          instagram_link?: string | null
          last_name: string
          theme_preference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          artist_name?: string
          created_at?: string
          first_name?: string
          id?: string
          instagram_link?: string | null
          last_name?: string
          theme_preference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      uploads: {
        Row: {
          created_at: string
          duration_seconds: number | null
          file_path: string
          file_size: number
          filename: string
          id: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          file_path: string
          file_size: number
          filename: string
          id?: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          file_path?: string
          file_size?: number
          filename?: string
          id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_survey: {
        Row: {
          completed_at: string | null
          country: string | null
          created_at: string
          genres: string[] | null
          how_found: string | null
          id: string
          newsletter_optin: boolean | null
          platforms: string[] | null
          posting_frequency: string | null
          role: string | null
          set_length: string | null
          timezone: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          country?: string | null
          created_at?: string
          genres?: string[] | null
          how_found?: string | null
          id?: string
          newsletter_optin?: boolean | null
          platforms?: string[] | null
          posting_frequency?: string | null
          role?: string | null
          set_length?: string | null
          timezone?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          country?: string | null
          created_at?: string
          genres?: string[] | null
          how_found?: string | null
          id?: string
          newsletter_optin?: boolean | null
          platforms?: string[] | null
          posting_frequency?: string | null
          role?: string | null
          set_length?: string | null
          timezone?: string | null
          user_id?: string
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
