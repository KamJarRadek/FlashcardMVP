// database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/** Enums odzwierciedlające ograniczenia CHECK na kolumnach */
export enum FlashcardsStatus {
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export enum FlashcardsSource {
  AI = 'ai',
  Manual = 'manual',
}

export interface Database {
  public: {
    Tables: {
      flashcards: {
        Row: {
          id: string
          user_id: string
          concept: string
          definition: string
          source: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          concept: string
          definition: string
          source: string
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          concept?: string
          definition?: string
          source?: string
          status?: string
          created_at?: string
          updated_at?: string
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
