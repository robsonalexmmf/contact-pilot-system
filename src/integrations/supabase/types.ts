export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      automations: {
        Row: {
          action_type: string
          created_at: string | null
          delay_minutes: number | null
          description: string | null
          executions: number | null
          id: string
          last_run: string | null
          message: string | null
          name: string
          status: string | null
          success_rate: number | null
          target_group: string | null
          trigger_type: string
          updated_at: string | null
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          delay_minutes?: number | null
          description?: string | null
          executions?: number | null
          id?: string
          last_run?: string | null
          message?: string | null
          name: string
          status?: string | null
          success_rate?: number | null
          target_group?: string | null
          trigger_type: string
          updated_at?: string | null
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          delay_minutes?: number | null
          description?: string | null
          executions?: number | null
          id?: string
          last_run?: string | null
          message?: string | null
          name?: string
          status?: string | null
          success_rate?: number | null
          target_group?: string | null
          trigger_type?: string
          updated_at?: string | null
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat_id: string
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          sender_type: string
        }
        Insert: {
          chat_id: string
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          sender_type: string
        }
        Update: {
          chat_id?: string
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string | null
          status: string | null
          title: string
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          company: string | null
          contact: string
          created_at: string | null
          expected_close: string | null
          id: string
          last_activity: string | null
          notes: string | null
          probability: number | null
          stage: string
          title: string
          updated_at: string | null
          user_id: string
          value: number
        }
        Insert: {
          company?: string | null
          contact: string
          created_at?: string | null
          expected_close?: string | null
          id?: string
          last_activity?: string | null
          notes?: string | null
          probability?: number | null
          stage?: string
          title: string
          updated_at?: string | null
          user_id: string
          value?: number
        }
        Update: {
          company?: string | null
          contact?: string
          created_at?: string | null
          expected_close?: string | null
          id?: string
          last_activity?: string | null
          notes?: string | null
          probability?: number | null
          stage?: string
          title?: string
          updated_at?: string | null
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "deals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          attendees: string[] | null
          created_at: string | null
          deal_id: string | null
          description: string | null
          end_time: string
          id: string
          lead_id: string | null
          location: string | null
          meeting_link: string | null
          start_time: string
          status: string | null
          title: string
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attendees?: string[] | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          end_time: string
          id?: string
          lead_id?: string | null
          location?: string | null
          meeting_link?: string | null
          start_time: string
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attendees?: string[] | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          end_time?: string
          id?: string
          lead_id?: string | null
          location?: string | null
          meeting_link?: string | null
          start_time?: string
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          created_at: string | null
          data: Json
          form_id: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          form_id: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          form_id?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          created_at: string | null
          description: string | null
          fields: Json
          id: string
          name: string
          settings: Json | null
          status: string | null
          submissions: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          fields?: Json
          id?: string
          name: string
          settings?: Json | null
          status?: string | null
          submissions?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          fields?: Json
          id?: string
          name?: string
          settings?: Json | null
          status?: string | null
          submissions?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: string
          last_contact: string | null
          name: string
          next_followup: string | null
          notes: string | null
          phone: string | null
          score: number | null
          source: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          value: number | null
          whatsapp: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          last_contact?: string | null
          name: string
          next_followup?: string | null
          notes?: string | null
          phone?: string | null
          score?: number | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          value?: number | null
          whatsapp?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_contact?: string | null
          name?: string
          next_followup?: string | null
          notes?: string | null
          phone?: string | null
          score?: number | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          value?: number | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          price: number
          sku: string | null
          status: string | null
          stock: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price?: number
          sku?: string | null
          status?: string | null
          stock?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
          sku?: string | null
          status?: string | null
          stock?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          join_date: string | null
          last_login: string | null
          monthly_revenue: number | null
          name: string
          plan: string | null
          status: string | null
          total_leads: number | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          join_date?: string | null
          last_login?: string | null
          monthly_revenue?: number | null
          name: string
          plan?: string | null
          status?: string | null
          total_leads?: number | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          join_date?: string | null
          last_login?: string | null
          monthly_revenue?: number | null
          name?: string
          plan?: string | null
          status?: string | null
          total_leads?: number | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          client: string
          company: string | null
          content: string | null
          created_at: string | null
          id: string
          notes: string | null
          status: string | null
          template: string | null
          title: string
          updated_at: string | null
          user_id: string
          valid_until: string | null
          value: number
        }
        Insert: {
          client: string
          company?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          template?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          valid_until?: string | null
          value?: number
        }
        Update: {
          client?: string
          company?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          template?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          valid_until?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          id: string
          settings: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          settings?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          settings?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          deal_id: string | null
          description: string | null
          due_date: string | null
          id: string
          lead_id: string | null
          priority: string | null
          status: string | null
          title: string
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          priority?: string | null
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          priority?: string | null
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string
          deal_id: string | null
          description: string
          id: string
          lead_id: string | null
          payment_method: string | null
          status: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date: string
          deal_id?: string | null
          description: string
          id?: string
          lead_id?: string | null
          payment_method?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string
          deal_id?: string | null
          description?: string
          id?: string
          lead_id?: string | null
          payment_method?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
