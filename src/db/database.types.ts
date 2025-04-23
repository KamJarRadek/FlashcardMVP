// database.types.ts

/** Pomocniczy typ JSON */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

/** Enums odzwierciedlające ograniczenia CHECK na kolumnach */
export enum FlashcardsStatus {
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export enum FlashcardsSource {
  AI = 'ai',
  Manual = 'manual',
}

/** Definicja całej bazy danych (public schema) */
export interface Database {
  public: {
    Tables: {
      flashcards: {
        /** Wiersz zwracany z bazy */
        Row: {
          id: string;
          user_id: string;
          definition: string;
          concept: string;
          status: FlashcardsStatus;
          source: FlashcardsSource;
          created_at: string;  // ISO-8601 timestamp
          updated_at: string;  // ISO-8601 timestamp
          duration: string;    // PostgreSQL INTERVAL jako string, np. "00:05:00"
        };
        /** Obiekt używany przy insercie */
        Insert: {
          id?: string;          // UUID, domyślnie gen_random_uuid()
          user_id: string;
          definition: string;
          concept: string;
          status?: FlashcardsStatus;  // domyślnie trzeba podać jeden z enumów
          source?: FlashcardsSource;   // domyślnie trzeba podać jeden z enumów
          created_at?: string;
          updated_at?: string;
          duration?: string;
        };
        /** Obiekt używany przy update */
        Update: {
          id?: string;
          user_id?: string;
          definition?: string;
          concept?: string;
          status?: FlashcardsStatus;
          source?: FlashcardsSource;
          created_at?: string;
          updated_at?: string;
          duration?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      flashcards_status: FlashcardsStatus;
      flashcards_source: FlashcardsSource;
    };
    CompositeTypes: Record<string, never>;
  };
}
