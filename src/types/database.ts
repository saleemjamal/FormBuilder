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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
      }
    }
  }
}
      user_roles: {
        Row: {
          id: string
          user_id: string
          role_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role_id?: string
          created_at?: string
        }
      }
      forms: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'draft' | 'published' | 'archived'
          branding: Json | null
          version: number
          created_by: string
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: 'draft' | 'published' | 'archived'
          branding?: Json | null
          version?: number
          created_by: string
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      form_elements: {
        Row: {
          id: string
          form_id: string
          type: string
          label: string
          placeholder: string | null
          required: boolean
          validation: Json | null
          options: Json | null
          repeatable: boolean
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          form_id: string
          type: string
          label: string
          placeholder?: string | null
          required?: boolean
          validation?: Json | null
          options?: Json | null
          repeatable?: boolean
          position: number
          created_at?: string
          updated_at?: string
        }
      }
      form_submissions: {
        Row: {
          id: string
          form_id: string
          submitted_by: string | null
          submitted_at: string
          status: 'submitted' | 'reviewed' | 'archived'
        }
      }
      submission_responses: {
        Row: {
          id: string
          submission_id: string
          element_id: string
          value: Json
          created_at: string
        }
      }
      uploaded_files: {
        Row: {
          id: string
          filename: string
          file_path: string
          file_size: number
          mime_type: string
          uploaded_by: string
          submission_id: string | null
          created_at: string
        }
      }
      dropdown_sources: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
      }
      dropdown_options: {
        Row: {
          id: string
          source_id: string
          value: string
          label: string
          position: number
          active: boolean
          created_at: string
        }
      }
    }
  }
}
