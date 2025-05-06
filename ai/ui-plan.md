# Architektura UI dla FlashcardsAI

## 1. Przegląd struktury UI

Interfejs użytkownika składa się z następujących modułów:
- **Autoryzacja**: ekran logowania (e-mail/hasło, OAuth) oraz przekierowania przy wygaśnięciu sesji.
- **Dashboard**: punkt wejścia po zalogowaniu, zawierający główne sekcje (Generowanie, Lista fiszek, Tryb nauki, Statystyki, Panel admina).
- **Generowanie fiszek**: formularz wprowadzania tekstu, walidacja i licznik znaków; widok propozycji do akceptacji/odrzucenia.
- **Zarządzanie fiszkami**: lista fiszek z filtrowaniem i paginacją; edycja, usuwanie, ręczne tworzenie.
- **Tryb nauki**: losowe wyświetlanie fiszek ze spinnerem i cache PWA.
- **Statystyki**: pojedynczy wykres kołowy łączący dane `bySource` i `byStatus`.
- **Panel admina**: widok listy użytkowników, szczegóły użytkownika z CRUD fiszek.

Całość oparto o komponenty Angular z detekcją zmian OnPush i Angular Signals, responsywność zapewnia Angular Flex Layout.

## 2. Lista widoków

| Nazwa widoku                   | Ścieżka                       | Główny cel                                              | Kluczowe informacje                                           | Kluczowe komponenty                                                               | UX, dostępność, bezpieczeństwo                                                                                      |
|--------------------------------|-------------------------------|---------------------------------------------------------|---------------------------------------------------------------|-----------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| Ekran logowania                | `/login`                      | Uwierzytelnienie użytkownika                            | Formularz e-mail/hasło, przyciski OAuth, komunikaty błędów    | `LoginFormComponent`, `OAuthButtonsComponent`, `MatSnackBar`                      | Focus na pierwszym polu, aria-label, obsługa 401 z przekierowaniem                                                  |
| Dashboard                      | `/dashboard`                  | Przegląd głównych sekcji                                | Kafelki/linki do Generowania, Listy fiszek, Nauki, Statystyk  | `NavMenuComponent`, `DashboardCardsComponent`                                     | Kontrast kolorów, keyboard navigation, role=navigation                                                              |
| Generowanie fiszek             | `/generate`                   | Wprowadzenie tekstu i generacja propozycji              | Pole tekstowe (10 000 znaków), licznik, walidacja postępu     | `GenerateFormComponent`, `CharacterCounterDirective`, `MatProgressSpinnerOverlay` | Debounce 500 ms, aria-live dla walidacji, spinner overlay                                                           |
| Propozycje fiszek              | `/generate/proposals`         | Akceptacja/odrzucenie wygenerowanych fiszek             | Lista kart z definicją i pojęciem, przyciski Akceptuj/Usuń    | `ProposalListComponent`, `FlashcardProposalCardComponent`, `MatButton`            | Accessible buttons, confirm dialog przy usuwaniu, aria-pressable                                                    |
| Lista fiszek                   | `/flashcards`                 | Przegląd, filtrowanie, paginacja i zarządzanie fiszkami | Tabela/kafelki fiszek, filtr tekstowy, paginacja (20/50/100)  | `FlashcardListComponent`, `FilterInputComponent`, `MatPaginator`, `MatTable`      | Debounce filtra, ARIA pagination, informacja gdy brak wyników                                                       |
| Tworzenie fiszki (manualnie)   | `/flashcards/manual`          | Dodanie nowej fiszki                                    | Formularz definicja/pojęcie (500/100 znaków), licznik         | `ManualCreateComponent`, `CharacterCounterDirective`, `MatSnackBar`               | Live-walidacja, focus management, walidacja długości pól                                                            |
| Edycja fiszki                  | `/flashcards/:id/edit`        | Modyfikacja istniejącej fiszki                          | Formularz z wstępnymi wartościami, przycisk Zapisz            | `FlashcardEditComponent`, `ReactiveFormsModule`, `MatSnackBar`                    | Zabezpieczenie RLS, ukryte pola niewłaściwych operacji, aria-describedby dla błędów                                 |
| Tryb nauki                     | `/study`                      | Nauka fiszek w trybie losowym                           | Pojedyncze flashcard, przyciski Dalej/Powrót, spinner overlay | `StudyModeComponent`, `StudyCardComponent`, `MatProgressSpinnerOverlay`           | Cache PWA (stale-cache-then-network), keyboard shortcuts (np. strzałki), aria-live dla kolejnej fiszki              |
| Statystyki                     | `/stats`                      | Wizualizacja danych `bySource` i `byStatus`             | Wykres kołowy w `MatCard`, legenda, wartości liczbowe         | `StatsComponent`, `NgxChartsPieComponent`, `MatCard`                              | aria-label dla wykresu, text alternative, responsive chart                                                          |
| Panel admina                   | `/admin`                      | Ogólny widok administracyjny                            | Menu Admina z opcjami Użytkownicy, Fiszki                     | `AdminNavComponent`, `AdminDashboardComponent`                                    | Autoryzacja (tylko dla ról Admin), ukrycie przycisków bez uprawnień                                                 |
| Lista użytkowników (Admin)     | `/admin/users`                | Przegląd wszystkich użytkowników                        | Tabela użytkowników (email, data utworzenia)                  | `AdminUserListComponent`, `MatTable`, `MatPaginator`                              | RLS/Supabase Auth, filtrowanie, paginacja                                                                           |
| Szczegóły użytkownika (Admin)  | `/admin/users/:id`            | Szczegóły użytkownika i CRUD fiszek                     | Profil użytkownika, lista fiszek z CRUD                       | `AdminUserDetailComponent`, `FlashcardListComponent`, `MatAccordion`              | Zapobieganie XSS, potwierdzenie przed kasowaniem, role-based UI                                                     |
| Ekran rejestracji              | `/signup`                     | Rejestracja nowego użytkownika                          | Formularz: e-mail, hasło, potwierdzenie hasła                 | `SignupFormComponent`, `MatFormField`, `MatButton`, `MatSnackBar`                 | Walidacja formatów (email), długości haseł, aria-label, focus management, informacja o wysłanym mailu               |
| Ekran odzyskiwania hasła       | `/forgot-password`            | Wysłanie prośby o reset hasła                           | Pole e-mail, przycisk „Wyślij link”                           | `ForgotPasswordComponent`, `MatFormField`, `MatButton`, `MatSnackBar`             | Walidacja e-mail, aria-describedby, informacja o wysłaniu linku                                                     |
| Ustawienie nowego hasła        | `/reset-password?token=…`     | Ustawienie nowego hasła z otrzymanym tokenem            | Pola: nowe hasło, potwierdzenie hasła, przycisk „Zapisz”      | `ResetPasswordComponent`, `MatFormField`, `MatButton`, `MatSnackBar`              | Walidacja zgodności haseł, długości, obsługa błędnego/nieaktualnego tokena, aria-live dla komunikatów               |
## 3. Mapa podróży użytkownika

1. **Logowanie** (`/login`) → przy próbie wejścia bez tokena.
2. **Dashboard** (`/dashboard`) → wybór sekcji.
3. **Generowanie fiszek** (`/generate`):
   - Wprowadź tekst → kliknij „Generuj” → spinner overlay → przejdź do `/generate/proposals`.
4. **Propozycje** (`/generate/proposals`):
   - Akceptuj/Usuń → po akceptacji redirect do `/flashcards`.
5. **Lista fiszek** (`/flashcards`):
   - Filtrowanie, paginacja → wybierz fiszkę → Edycja (`/flashcards/:id/edit`) lub Usuń → powrót do listy.
   - Ręczne tworzenie (`/flashcards/manual`).
6. **Tryb nauki** (`/study`):
   - Pokaż fiszkę → Dalej/Powrót → po zakończeniu informacja o zakończeniu.
7. **Statystyki** (`/stats`):
   - Oglądaj wykres → powrót do Dashboard.
8. **Panel admina** (`/admin`):
   - Lista użytkowników → wybierz (`/admin/users/:id`) → zarządzaj fiszkami.

## 4. Układ i struktura nawigacji

- **SideNav** (stanowi stały layout po zalogowaniu):
  - Generowanie fiszek
  - Lista fiszek
  - Tryb nauki
  - Statystyki
  - (jeśli Admin) Panel admina
- **TopBar**:
  - Logo/tytuł aplikacji
  - UserMenu (awatar, wyloguj)
- **Breadcrumbs** w widokach głębokich (edycja, szczegóły użytkownika)
- **Lazy Loading**: moduły `GenerateModule`, `FlashcardsModule`, `StudyModule`, `StatsModule`, `AdminModule`

## 5. Kluczowe komponenty

- `NavMenuComponent` – nawigacja boczna z aria labels.
- `TopBarComponent` – nagłówek z profilem i wylogowaniem.
- `GenerateFormComponent` – formularz generowania z walidacją i licznikiem.
- `ProposalListComponent` + `FlashcardProposalCardComponent` – prezentacja propozycji.
- `FlashcardListComponent` – tabela/kafelki fiszek z paginacją i filtrem.
- `FlashcardEditComponent` / `ManualCreateComponent` – formularze CRUD fiszek.
- `StudyModeComponent` + `StudyCardComponent` – interfejs nauki z overlay spinner.
- `StatsComponent` – wykres kołowy (ngx-charts).
- `AdminUserListComponent` / `AdminUserDetailComponent` – komponenty admina z CRUD użytkowników i fiszek.
- `ErrorService` + `MatSnackBar` – globalne komunikaty o błędach.
- `SpinnerOverlayService` – wrapper dla `MatProgressSpinner`.
- `AuthInterceptor` – przechwytywanie 401 i przekierowanie.
- `CharacterCounterDirective` – live-limit dla `definition` i `concept`.
