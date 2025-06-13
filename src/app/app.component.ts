import {RouterOutlet} from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NavbarComponent} from './components/navbar/navbar.component';
import {AuthService} from './services/auth.service';
import {SupabaseService} from './services/supabase.service';
import {Subscription} from 'rxjs';
import {TextFormComponent} from './components/text-form/text-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, NavbarComponent, TextFormComponent],
  providers: [SupabaseService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Aplikacja do nauki z fiszkami';
  isLoggedIn = false;
  isLoading = true;
  private authSubscription: Subscription | null = null;
  private loadingSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    // Ustaw nasłuchiwanie na zmiany autentykacji z Supabase
    // Musi być wywołane przed sprawdzeniem stanu logowania
    this.authService.setupAuthListener();

    // Subskrybuj zmiany stanu logowania
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;

      if (isAuthenticated) {
        const userId = this.authService.getCurrentUserId();
        console.log('Zalogowany użytkownik:', userId);
      }
    });

    // Subskrybuj stan ładowania
    this.loadingSubscription = this.authService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  ngOnDestroy() {
    // Wyczyść subskrypcje przy zniszczeniu komponentu
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }

    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
