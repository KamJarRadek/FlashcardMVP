import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {SupabaseService} from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private currentUserSubject = new BehaviorSubject<any>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();

  // Klucze do localStorage
  private readonly AUTH_TOKEN_KEY = 'auth_session';
  private readonly USER_DATA_KEY = 'user_data';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    // Sprawdź czy użytkownik jest zalogowany przy inicjalizacji
    this.initializeAuthState();
  }

  // Inicjalizacja stanu autoryzacji - sprawdza zarówno sesję Supabase jak i localStorage
  private async initializeAuthState(): Promise<void> {
    try {
      this.isLoadingSubject.next(true);

      // Najpierw próbujemy pobrać dane z localStorage
      this.restoreAuthStateFromStorage();

      // Następnie sprawdzamy sesję z Supabase (jako weryfikacja)
      await this.checkAuthState();
    } catch (error) {
      console.error('Błąd inicjalizacji stanu autoryzacji:', error);
      this.clearAuthState();
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  // Przywraca stan autoryzacji z localStorage
  private restoreAuthStateFromStorage(): void {
    try {
      const userData = localStorage.getItem(this.USER_DATA_KEY);
      const sessionData = localStorage.getItem(this.AUTH_TOKEN_KEY);

      if (userData && sessionData) {
        const user = JSON.parse(userData);
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(user);
        console.log('Przywrócono stan autoryzacji z localStorage');
      }
    } catch (error) {
      console.error('Błąd podczas przywracania stanu autoryzacji z localStorage:', error);
    }
  }

  // Zapisuje stan autoryzacji w localStorage
  private saveAuthStateToStorage(user: any, session: any): void {
    try {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
      localStorage.setItem(this.AUTH_TOKEN_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Błąd podczas zapisywania stanu autoryzacji do localStorage:', error);
    }
  }

  // Czyści stan autoryzacji (localStorage i stan aplikacji)
  private clearAuthState(): void {
    localStorage.removeItem(this.USER_DATA_KEY);
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  async checkAuthState(): Promise<void> {
    try {
      this.isLoadingSubject.next(true);
      const session = await this.supabaseService.getSession();

      if (session) {
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(session.user);
        // Zapisz dane sesji w localStorage
        this.saveAuthStateToStorage(session.user, session);
      } else {
        // Jeśli brak sesji w Supabase, wyczyść również localStorage
        this.clearAuthState();
      }
    } catch (error) {
      console.error('Błąd sprawdzania sesji:', error);
      this.clearAuthState();
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await this.supabaseService.signIn(email, password);

      if (response.error) {
        throw response.error;
      }

      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(response.data.user);

      // Zapisz dane sesji w localStorage
      this.saveAuthStateToStorage(response.data.user, response.data.session);

      return response;
    } catch (error) {
      console.error('Błąd logowania:', error);
      throw error;
    }
  }

  async register(email: string, password: string): Promise<any> {
    try {
      const response = await this.supabaseService.signUp(email, password);

      if (response.error) {
        throw response.error;
      }

      // Dodano przekierowanie po udanej rejestracji
      this.router.navigate(['/verify-email']);

      return response;
    } catch (error) {
      console.error('Błąd rejestracji:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.supabaseService.signOut();
      // Wyczyść dane sesji z localStorage
      this.clearAuthState();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Błąd wylogowania:', error);
    }
  }

  async resetPassword(email: string): Promise<any> {
    try {
      const response = await this.supabaseService.resetPassword(email);

      if (response.error) {
        throw response.error;
      }

      // Dodano przekierowanie po udanym resetowaniu hasła
      this.router.navigate(['/reset-password']);

      return response;
    } catch (error) {
      console.error('Błąd resetowania hasła:', error);
      throw error;
    }
  }

  async updatePassword(password: string, token: string): Promise<any> {
    try {
      const response = await this.supabaseService.updatePassword(password, token);

      if (response.error) {
        throw response.error;
      }

      return response;
    } catch (error) {
      console.error('Błąd aktualizacji hasła:', error);
      throw error;
    }
  }

  getCurrentUserId(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.id : null;
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Słuchanie zmian stanu autoryzacji z Supabase
  setupAuthListener(): void {
    this.supabaseService.client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(session.user);
        // Zapisz dane sesji w localStorage
        this.saveAuthStateToStorage(session.user, session);
      } else if (event === 'SIGNED_OUT') {
        // Wyczyść dane sesji z localStorage
        this.clearAuthState();
      } else if (event === 'USER_UPDATED' && session) {
        this.currentUserSubject.next(session.user);
        // Zaktualizuj dane użytkownika w localStorage
        this.saveAuthStateToStorage(session.user, session);
      }
    });
  }
}

