# Specyfikacja techniczna: Moduł autentykacji użytkownika

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### Widoki i komponenty

#### Nowe widoki:

* **/signup** – formularz rejestracji
* **/recover** – formularz resetowania hasła (krok 1)
* **/reset-password** – formularz ustawienia nowego hasła (krok 2 z tokenem z URL)

#### Istniejące widoki do modyfikacji:

* **/login** – rozszerzenie o linki do rejestracji i odzyskiwania hasła
* **TopBarComponent** – menu użytkownika z opcją „Wyloguj”

### Komponenty i odpowiedzialności

| Komponent                | Odpowiedzialność                                              |
| ------------------------ | ------------------------------------------------------------- |
| `LoginFormComponent`     | Obsługa logowania i przekierowania po sukcesie/porażce        |
| `SignupFormComponent`    | Walidacja i wysyłka danych rejestracyjnych do `/auth/signup`  |
| `RecoverFormComponent`   | Obsługa formularza odzyskiwania hasła i komunikatów           |
| `ResetPasswordComponent` | Odczyt tokena z URL i resetowanie hasła                       |
| `AuthGuardService`       | Przekierowanie do `/login` jeśli brak JWT w localStorage      |
| `MatSnackBar`            | Pokazywanie błędów i komunikatów sukcesu                      |
| `AuthService`            | Integracja z backendem: login, signup, recover, reset, logout |

### Walidacja i UX

* **Login** – email wymagany, hasło min. 6 znaków
* **Signup** – email poprawny, hasło min. 8 znaków, potwierdzenie hasła (client-side only)
* **Recover** – tylko poprawny email
* **Reset password** – hasło i jego powtórzenie, token wymagany (z URL)

### Scenariusze UX

* Błąd logowania → snackbar „Niepoprawny email lub hasło”
* Błąd przy rejestracji → snackbar z kodem błędu Supabase (np. konflikt emaila)
* Sukces rejestracji → snackbar „Sprawdź skrzynkę pocztową w celu potwierdzenia konta”
* Po resecie hasła → redirect do loginu z komunikatem sukcesu
* Po wylogowaniu → redirect do `/login`
* **Login** – email/hasło wymagane lub przyciski OAuth
* **OAuth** – po sukcesie: redirect do `/dashboard`; po błędzie: snackbar „Logowanie OAuth nie powiodło się”


## 2. LOGIKA BACKENDOWA

### Endpointy

Zgodnie z plikiem `api-plan.md`:

* `POST /auth/signup` – rejestracja
* `POST /auth/login` – logowanie
* `POST /auth/recover` – wysyłka linku do resetu hasła
* `POST /auth/reset` – ustawienie nowego hasła (token + newPassword)
* `POST /auth/logout` – unieważnienie sesji lokalnej (tylko frontend)

### Modele danych

* **Rejestracja**:

```json
{
  "email": "string",
  "password": "string"
}
```

* **Logowanie**:

```json
{
  "email": "string",
  "password": "string"
}
```

* **Reset hasła** (etap 1):

```json
{
  "email": "string"
}
```

* **Reset hasła** (etap 2):

```json
{
  "token": "string",
  "newPassword": "string"
}
```

### Walidacja i obsługa błędów

* Backend zwraca błędy w formacie JSON + kod HTTP (`400`, `401`, `409`)
* Błędy frontendowe prezentowane za pomocą `MatSnackBar`
* `AuthInterceptor` przechwytuje błędy `401` i przekierowuje do `/login`

### Renderowanie stron

* Strony `/dashboard` i pozostałe wymagają JWT – dostępne tylko po autentykacji
* Brak JWT → przekierowanie do `/login`

## 3. SYSTEM AUTENTYKACJI (Supabase Auth)

### Użytkownicy

Tabela `users` zarządzana przez Supabase:

```sql
id: UUID PRIMARY KEY
email: VARCHAR UNIQUE
created_at: TIMESTAMPTZ
confirmed_at: TIMESTAMPTZ
```

### Rejestracja i logowanie

* `supabase.auth.signUp({ email, password })`
* `supabase.auth.signInWithPassword({ email, password })`
* Obsługa tokenów JWT automatyczna po stronie Supabase SDK
* Token trzymany w localStorage i automatycznie odświeżany

### Odzyskiwanie hasła

* `supabase.auth.resetPasswordForEmail(email)` – krok 1
* Link zawiera `access_token`, który frontend odczytuje z URL w `/reset-password`
* `supabase.auth.updateUser({ password })` – krok 2

### Wylogowanie

* `supabase.auth.signOut()`
* Po stronie frontendowej kasowanie tokena i redirect do `/login`

### Ochrona zasobów

* Supabase JWT zawiera `user_id`, który mapowany jest na `flashcards.user_id`
* PostgreSQL RLS (Row-Level Security) zapewnia, że użytkownik widzi tylko swoje dane

## Podsumowanie

System autoryzacji i rejestracji użytkowników zostanie zintegrowany w sposób zgodny z istniejącą strukturą UI i architekturą backendową opartą o Supabase. Angular 19 i Angular Material zapewniają pełną obsługę formularzy i walidacji, a Supabase Auth pozwala na szybkie i bezpieczne wdrożenie funkcjonalności bez konieczności tworzenia logiki uwierzytelniania od podstaw.
