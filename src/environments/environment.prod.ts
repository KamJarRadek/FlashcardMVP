/**
 * Konfiguracja środowiska produkcyjnego Angular
 *
 * UWAGA: Ten plik jest używany TYLKO przez frontend (Angular) w produkcji.
 * Dla konfiguracji backendu używaj pliku .env
 */
export const environment = {
  production: true,
  // Dane Supabase - powinny być takie same jak w pliku .env
  supabaseUrl: 'https://ypshzvdduhpozncpzkbz.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwc2h6dmRkdWhwb3puY3B6a2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MDEzNTMsImV4cCI6MjA1OTk3NzM1M30.Y2nv6h0rGR9BB_CMAqVnHo0mke6EW1kWSNiNqGaK7CM',
  // URL do API - w produkcji używamy względnego URL (aplikacja i API na tym samym serwerze)
  apiUrl: '/api'
};
