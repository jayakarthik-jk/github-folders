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
          created_at: string
          folder_name: string
          id: number
          parent_id: number | null
          path: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          created_at?: string
          folder_name: string
          id?: number
          parent_id?: number | null
          path?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          created_at?: string
          folder_name?: string
          id?: number
          parent_id?: number | null
          path?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "Folder_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "Folder"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Folder_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      Repo: {
        Row: {
          created_at: string
          folder_id: number | null
          id: number
          path: string | null
          repo_name: string
          user_id: string
          user_name: string
        }
        Insert: {
          created_at?: string
          folder_id?: number | null
          id?: number
          path?: string | null
          repo_name: string
          user_id: string
          user_name: string
        }
        Update: {
          created_at?: string
          folder_id?: number | null
          id?: number
          path?: string | null
          repo_name?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "Repo_folder_id_fkey"
            columns: ["folder_id"]
            referencedRelation: "Folder"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Repo_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
