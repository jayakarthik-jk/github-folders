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
      Folder: {
        Row: {
          created_at: string | null
          id: number
          parent_name: string | null
          path: string
          title: string
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          parent_name?: string | null
          path: string
          title: string
          username: string
        }
        Update: {
          created_at?: string | null
          id?: number
          parent_name?: string | null
          path?: string
          title?: string
          username?: string
        }
        Relationships: []
      }
      Repo: {
        Row: {
          created_at: string | null
          folder_name: string | null
          id: number
          path: string
          repo_id: string
          title: string
          username: string
        }
        Insert: {
          created_at?: string | null
          folder_name?: string | null
          id?: number
          path: string
          repo_id: string
          title: string
          username: string
        }
        Update: {
          created_at?: string | null
          folder_name?: string | null
          id?: number
          path?: string
          repo_id?: string
          title?: string
          username?: string
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
