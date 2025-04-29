import { Injectable, inject } from '@angular/core';
import { supabaseClient } from '../../db/supabase.client';
import type { Database } from '../../db/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient<Database> = supabaseClient;

  get client(): SupabaseClient<Database> {
    return this.supabase;
  }

  // Metoda pomocnicza do pobierania fiszek użytkownika
  async getFlashcardsByUserId(userId: string) {
    return this.supabase
      // .from('flashcard_actions')
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
  }

  // Metoda do dodawania nowej fiszki
  async addFlashcard(flashcardData: Database['public']['Tables']['flashcards']['Insert']) {
    return this.supabase
      // .from('flashcard_actions')
      .from('flashcards')
      .insert(flashcardData);
  }

  // Metoda do aktualizacji fiszki
  async updateFlashcard(
    id: string,
    updates: Database['public']['Tables']['flashcards']['Update']
    // updates: Database['public']['Tables']['flashcards']['Update']
  ) {
    return this.supabase
      .from('flashcard_actions')
      // .from('flashcards')
      .update(updates)
      .eq('id', id);
  }

  // Metoda do usuwania fiszki
  async deleteFlashcard(id: string) {
    return this.supabase
      .from('flashcard_actions')
      // .from('flashcards')
      .delete()
      .eq('id', id);
  }
}
