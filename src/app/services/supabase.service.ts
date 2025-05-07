import { Injectable } from '@angular/core';
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
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
  }

  // Metoda do dodawania nowej fiszki
  async addFlashcard(flashcardData: Database['public']['Tables']['flashcards']['Insert']) {
    console.log('Dodawanie fiszki', flashcardData);
    return this.supabase
      .from('flashcards')
      .insert(flashcardData);
  }

  // Metoda do aktualizacji fiszki
  async updateFlashcard(
    id: string,
    updates: Database['public']['Tables']['flashcards']['Update']
  ) {
    return this.supabase
      .from('flashcards')
      .update(updates)
      .eq('id', id);
  }

  // Metoda do usuwania fiszki
  async deleteFlashcard(id: string) {
    return this.supabase
      .from('flashcards')
      .delete()
      .eq('id', id);
  }

  // Nowe metody auth:

  async getSession() {
    // Komunikacja z zewnętrznym serwisem: pobieranie sesji użytkownika
    const { data: { session }, error } = await this.supabase.auth.getSession();
    return error ? null : session;
  }

  async signIn(email: string, password: string) {
    // Komunikacja z zewnętrznym serwisem: logowanie użytkownika
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(email: string, password: string) {
    // Komunikacja z zewnętrznym serwisem: rejestracja użytkownika
    return await this.supabase.auth.signUp({ email, password });
  }

  async signOut() {
    // Komunikacja z zewnętrznym serwisem: wylogowanie użytkownika
    return await this.supabase.auth.signOut();
  }

  async resetPassword(email: string) {
    // Komunikacja z zewnętrznym serwisem: resetowanie hasła użytkownika
    return await this.supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://your-app-url/reset' });
  }

  async updatePassword(password: string, token: string) {
    // Komunikacja z zewnętrznym serwisem: aktualizacja hasła użytkownika
    // Token może być wykorzystany w zewnętrznym serwisie do weryfikacji, jeśli to konieczne.
    return await this.supabase.auth.updateUser({ password });
  }
}
