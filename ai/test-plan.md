## Wprowadzenie (cel testów)

Celem testów jest zapewnienie, że MVP aplikacji **FlashcardsAI** spełnia założenia funkcjonalne, niefunkcjonalne oraz wymagania jakościowe. Testy mają wykryć i zarejestrować defekty na różnych poziomach: od testów jednostkowych, przez integracyjne, aż po E2E i weryfikację bezpieczeństwa i dostępności. Dzięki temu zminimalizujemy ryzyko awarii, problemów z autoryzacją, niepoprawnym działaniem API oraz niedostatecznym wsparciem UX/ARIA przed wdrożeniem na produkcję  .

## Zakres testów (co będzie testowane)

1. **Testy funkcjonalne**

  * Generowanie fiszek z tekstu (limit 10 000 znaków, max 20 propozycji)
  * Akceptowanie/odrzucanie propozycji
  * Ręczne tworzenie i edycja fiszek
  * Tryb nauki (losowe wyświetlanie)
  * Statystyki (AI vs. manual, accepted vs. rejected)
  * Autoryzacja (email+hasło, OAuth)
  * Panel admina CRUD dla fiszek i użytkowników .

2. **Testy integracyjne**

  * Komunikacja frontend ↔ backend (REST API, JWT, RLS)
  * Integracja z lokalnym API AI (Ollama w Dockerze)
  * Obsługa błędów HTTP i retry logic .

3. **Testy E2E**

  * Ścieżki użytkownika: rejestracja, logowanie, generowanie fiszek, nauka, statystyki
  * Ścieżki administratora: przegląd użytkowników, CRUD fiszek

4. **Testy API**

  * Endpointy: `/flashcards/generate`, `/flashcards`, `/flashcards/manual`, `/flashcards/study`, `/stats`
  * Walidacja zapytań i odpowiedzi (statusy 200, 201, 400, 401, 404, 429)

5. **Testy bezpieczeństwa**

  * RLS – dostęp tylko do własnych danych
  * Próby nieautoryzowanego dostępu (inny `user_id`)
  * Testy sesji i odświeżania tokenów (JWT)

6. **Testy walidacji danych**

  * Długość pól (text ≤10000, definition ≤… itp.)
  * Wymagane pola i format email

7. **Testy regresji**

  * Odtworzenie defektów po poprawkach (edycja fiszek, ponowne generowanie)

8. **Testy dostępności (a11y)**

  * ARIA labels, kontrast kolorów, focus management, keyboard navigation

9. **Testy UI/UX**

  * Spinner ładowania, snackbar komunikaty, debounce, walidacja „live” .

## Zakres wykluczony (czego nie testujemy w MVP)

* Zaawansowany algorytm powtórek (Spaced Repetition jak SuperMemo/Anki)
* Import wielu formatów (PDF, DOCX, itp.)
* Współdzielenie zestawów fiszek między użytkownikami
* Integracja z zewnętrznymi platformami edukacyjnymi
* Aplikacja mobilna (tylko web) .

## Strategie testowania

| Typ testów           | Narzędzia                      | Odpowiedzialność     |
| -------------------- | ------------------------------ | -------------------- |
| Jednostkowe frontend | Jest, Angular Testing Library  | Developerzy          |
| Jednostkowe backend  | Jest, Supertest                | Developerzy          |
| Integracyjne API     | Postman / Newman, REST-assured | Zespół QA            |
| E2E                  | Cypress                        | Zespół QA            |
| Bezpieczeństwa       | OWASP ZAP, manualne próbki     | Zespół QA / Security |
| Dostępności          | axe-core, Lighthouse           | Zespół QA            |
| UI/UX                | manualne przeglądy, Percy.io   | UX / QA              |

## Wymagania środowiskowe

* **Środowisko testowe:** staging na Vercel / lokalny Docker (Supabase + Ollama)
* **Przeglądarki:** Chrome (latest), Firefox, Edge, Safari
* **Narzędzia testowe:** Node.js, Angular CLI, Cypress, Jest, Postman, OWASP ZAP, axe-core
* **Dane testowe:**

  * Konta użytkowników (zwykły, admin)
  * Przykładowe teksty \~5000 znaków
  * Zestawy fiszek (AI/manual)
* **Konfiguracja CI:** GitHub Actions uruchamia testy jednostkowe, integracyjne i E2E przy każdym PR

## Scenariusze testowe

| ID   | Nazwa                              | Kroki                                                                                               | Oczekiwany rezultat                                                                              |
| ---- | ---------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| T001 | Generowanie fiszek – sukces        | 1. Zaloguj się<br>2. Przejdź do `/generate`<br>3. Wklej tekst ≤10000 znaków<br>4. Kliknij „Generuj” | Pojawia się spinner; po chwili max 20 propozycji; każde ma definicję i pojęcie                   |
| T002 | Generowanie fiszek – błąd długości | Wklej tekst >10000 znaków i spróbuj wygenerować                                                     | Walidacja „Przekroczono limit znaków!”; brak wywołania API                                       |
| T003 | Akceptacja i odrzucenie            | Z generowanych propozycji zaakceptuj jedną i odrzuć drugą                                           | Zaakceptowana trafia do listy `/flashcards`; odrzucona znika z propozycji; status w DB poprawny  |
| T004 | Ręczne tworzenie fiszki            | Przejdź do `/flashcards/manual`, wypełnij formularz (500/100 zn.) i zapisz                          | Nowa fiszka pojawia się w liście; `source=manual`, `status=accepted`                             |
| T005 | Edycja fiszki                      | Na liście `/flashcards` wybierz edycję, zmodyfikuj pola i zapisz                                    | UI pokazuje komunikat sukcesu; zmiany widoczne natychmiast i w trybie nauki                      |
| T006 | Tryb nauki – losowe wyświetlanie   | Przejdź do `/study`, klikaj „Dalej”/„Powrót”                                                        | Fiszki zmieniają się losowo; spinner między zmianami; obsługa klawiszy strzałek                  |
| T007 | Statystyki                         | Przejdź do `/stats`                                                                                 | Wykres kołowy (AI vs. manual) i (accepted vs. rejected); wartości zgodne z DB                    |
| T008 | Autoryzacja – logowanie            | Spróbuj wejść na chroniony URL bez tokena, następnie z poprawnym loginem                            | Przekierowanie do `/login`; po zalogowaniu dostęp; przy niepoprawnych danych komunikat o błędzie |
| T009 | RLS – bezpieczeństwo danych        | Zaloguj się jako użytkownik A; wywołaj `/flashcards?user_id=B`                                      | Odpowiedź pusta lub 403; dane użytkownika B niedostępne                                          |
| T010 | API – walidacja endpointów         | Testuj `/flashcards/generate` 400/401/429, `/flashcards` 201/400, `/stats` 200/401                  | Zwracane kody i komunikaty zgodnie z dokumentacją API                                            |
| T011 | Testy dostępności                  | Przejdź po aplikacji klawiaturą; przeanalizuj ARIA labels, Lighthouse, axe                          | Brak krytycznych błędów a11y; focus widoczny; elementy opisane aria-label                        |
| T012 | UI/UX – spinner i snackbar         | Wykonuj akcje sieciowe przy wolnym łączu                                                            | Spinner widoczny podczas ładowania; snackbar z potwierdzeniem sukcesu lub błędu                  |

## Metryki sukcesu testów

* **Pokrycie testów jednostkowych:** ≥ 90% linii kodu
* **Pokrycie testów E2E:** ≥ 80% scenariuszy krytycznych
* **Stabilność:** < 5% testów E2E flakowanych
* **Defekty krytyczne:** brak w związanych obszarach (autoryzacja, RLS, walidacja)
* **Kryterium produktowe:** min. 75% fiszek wygenerowanych przez AI zaakceptowanych podczas wewnętrznych testów akceptacyjnych .
