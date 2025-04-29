import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

interface User {
  id: string;
  email?: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private supabase: SupabaseClient;
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    // Inicjalizacja klienta Supabase
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );

    // Sprawdzenie czy użytkownik jest zalogowany
    this.checkCurrentUser();
  }

  /**
   * Pobiera aktualnie zalogowanego użytkownika jako Observable
   */
  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  /**
   * Pobiera aktualnie zalogowanego użytkownika
   */
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Sprawdza czy użytkownik jest zalogowany w sesji
   */
  private async checkCurrentUser(): Promise<void> {
    try {
      const { data, error } = await this.supabase.auth.getSession();

      if (error) {
        console.error('Błąd podczas pobierania sesji:', error);
        this.currentUserSubject.next(null);
        return;
      }

      if (data?.session?.user) {
        const user: User = {
          id: data.session.user.id,
          email: data.session.user.email || undefined
        };

        this.currentUserSubject.next(user);
      } else {
        // W przypadku braku zalogowanego użytkownika, używamy tymczasowego ID
        // To jest uproszczenie dla wersji MVP - w pełnej wersji należy zaimplementować pełną autentykację
        const tempUser: User = {
          id: 'temp-user-id',
          name: 'Użytkownik tymczasowy'
        };

        this.currentUserSubject.next(tempUser);
      }
    } catch (error) {
      console.error('Wyjątek podczas pobierania sesji:', error);

      // Awaryjne utworzenie tymczasowego użytkownika
      const tempUser: User = {
        id: 'temp-user-id',
        name: 'Użytkownik tymczasowy'
      };

      this.currentUserSubject.next(tempUser);
    }
  }

  /**
   * Ustawia tymczasowego użytkownika dla celów testowych
   * W pełnej implementacji ta metoda powinna zostać usunięta
   */
  setTemporaryUser(name?: string): void {
    const tempUser: User = {
      id: 'temp-user-id',
      name: name || 'Użytkownik tymczasowy'
    };

    this.currentUserSubject.next(tempUser);
  }
}
