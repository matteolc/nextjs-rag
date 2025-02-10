export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      documents: {
        Row: {
          content: string;
          embedding: string | null;
          id: string;
          metadata: Json | null;
        };
        Insert: {
          content: string;
          embedding?: string | null;
          id?: string;
          metadata?: Json | null;
        };
        Update: {
          content?: string;
          embedding?: string | null;
          id?: string;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
        };
        Insert: {
          created_at?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
        };
        Update: {
          created_at?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
        };
        Relationships: [];
      };
      token_aggregation: {
        Row: {
          model: string;
          namespace: string;
          profile_id: string;
          service: Database["public"]["Enums"]["service_enum"];
          time_bucket: string;
          total_completion_tokens: number;
          total_prompt_tokens: number;
          total_tokens: number | null;
        };
        Insert: {
          model: string;
          namespace: string;
          profile_id: string;
          service: Database["public"]["Enums"]["service_enum"];
          time_bucket: string;
          total_completion_tokens: number;
          total_prompt_tokens: number;
          total_tokens?: number | null;
        };
        Update: {
          model?: string;
          namespace?: string;
          profile_id?: string;
          service?: Database["public"]["Enums"]["service_enum"];
          time_bucket?: string;
          total_completion_tokens?: number;
          total_prompt_tokens?: number;
          total_tokens?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "token_aggregation_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      token_consumption: {
        Row: {
          chat_id: string | null;
          completion_tokens: number;
          created_at: string | null;
          id: string;
          message_id: string;
          model: string;
          namespace: string;
          profile_id: string;
          prompt_tokens: number;
          service: Database["public"]["Enums"]["service_enum"];
        };
        Insert: {
          chat_id?: string | null;
          completion_tokens: number;
          created_at?: string | null;
          id?: string;
          message_id: string;
          model: string;
          namespace: string;
          profile_id: string;
          prompt_tokens: number;
          service: Database["public"]["Enums"]["service_enum"];
        };
        Update: {
          chat_id?: string | null;
          completion_tokens?: number;
          created_at?: string | null;
          id?: string;
          message_id?: string;
          model?: string;
          namespace?: string;
          profile_id?: string;
          prompt_tokens?: number;
          service?: Database["public"]["Enums"]["service_enum"];
        };
        Relationships: [
          {
            foreignKeyName: "token_consumption_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      uploads: {
        Row: {
          created_at: string | null;
          id: string;
          metadata: Json | null;
          name: string;
          namespace: string;
          profile_id: string;
          size: number;
          type: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          name: string;
          namespace: string;
          profile_id: string;
          size: number;
          type: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          name?: string;
          namespace?: string;
          profile_id?: string;
          size?: number;
          type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "uploads_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      match_documents: {
        Args: {
          query_embedding: string;
          match_count?: number;
          filter?: Json;
        };
        Returns: {
          id: string;
          content: string;
          metadata: Json;
          similarity: number;
        }[];
      };
    };
    Enums: {
      service_enum: "chat" | "summarization" | "extraction" | "other";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
