export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      recipes: {
        Row: {
          id: string
          created_at: string
          title: string
          image_url: string | null
          duration: string | null
          category: string | null
          ingredients: string[]
          steps: string[]
          source_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          image_url?: string | null
          duration?: string | null
          category?: string | null
          ingredients: string[]
          steps: string[]
          source_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          image_url?: string | null
          duration?: string | null
          category?: string | null
          ingredients?: string[]
          steps?: string[]
          source_url?: string | null
        }
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
  }
}

export type Recipe = Database['public']['Tables']['recipes']['Row']
