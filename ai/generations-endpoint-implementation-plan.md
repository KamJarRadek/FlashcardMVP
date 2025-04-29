# API Endpoint Implementation Plan: Generate Flashcard Proposals

## 1. Przegląd punktu końcowego
Punkt końcowy `/flashcards/generate` umożliwia autoryzowanym użytkownikom generowanie maksymalnie 20 propozycji fiszek (“definicja”-“pojęcie”) na podstawie dostarczonego tekstu (do 10 000 znaków). Wspiera logowanie operacji i zapewnia ochronę przed nadużyciami.

## 2. Szczegóły żądania
- **Metoda HTTP:** `POST`
- **Struktura URL:** `/flashcards/generate`
- **Parametry:**
  - **Wymagane:**
    - `text` (string): treść wejściowa, maks. 10 000 znaków
    - `maxCount` (number): maks. liczba propozycji (>=1, ≤20)
  - **Opcjonalne:** brak
- **Request Body:**
  ```json
  {
    "text": "...",
    "maxCount": 10
  }
  ```

## 3. Wykorzystywane typy
```typescript
// DTO żądania
export class GenerateProposalsRequestDto {
  @IsString()
  @MaxLength(10000)
  text: string;

  @IsInt()
  @Min(1)
  @Max(20)
  maxCount: number;
}

// Model propozycji fiszki
export class FlashcardProposalDto {
  definition: string;
  concept: string;
}

// DTO odpowiedzi
export class GenerateProposalsResponseDto {
  proposals: FlashcardProposalDto[];
}

// Command dla serwisu
export class GenerateFlashcardProposalsCommand {
  constructor(
    public readonly userId: string,
    public readonly text: string,
    public readonly maxCount: number,
  ) {}
}
```

## 4. Szczegóły odpowiedzi
- **Status:** `200 OK`
- **Response Body:**
  ```json
  {
    "proposals": [
      { "definition": "string", "concept": "string" }
    ]
  }
  ```
- **Możliwe kody błędów:**
  - `400 Bad Request` – nieprawidłowe lub brakujące dane wejściowe
  - `401 Unauthorized` – brak lub nieważny token JWT
  - `429 Too Many Requests` – przekroczono limit wywołań
  - `500 Internal Server Error` – wewnętrzny błąd serwera lub AIService

## 5. Przepływ danych
1. **Autoryzacja**  
   - Middleware weryfikuje token JWT Supabase i wyciąga `user_id`.  
2. **Walidacja**  
   - Globalny pipe/validator (`class-validator`) sprawdza `text` i `maxCount`.  
3. **Logika biznesowa**  
   - Kontroler wywołuje `FlashcardService.generateProposals(command)`.  
   - `FlashcardService`:
     1. Wywołuje `AIService.generate(text, maxCount)`.
     2. Mapuje surowe odpowiedzi do `FlashcardProposalDto[]`.
     3. Zapisuje rekord w `generation_logs` z liczbą propozycji.
     4. Zwraca `GenerateProposalsResponseDto`.
4. **Odpowiedź**  
   - Zwrócenie 200 OK z listą propozycji.

## 6. Względy bezpieczeństwa
- **Uwierzytelnienie:** Supabase Auth JWT  
- **Autoryzacja:** RLS na wszystkich tabelach (flashcards oraz generation_logs)  
- **Rate limiting:**  
  - Middleware limitujące liczbę wywołań (np. `100/min/user`)  
- **Ochrona DDoS:** maks. długość `text`  
- **Sanityzacja wejścia:** podstawowa – uniknięcie przesadnie długich payloadów  

## 7. Obsługa błędów
| Scenariusz                                    | Kod   | Opis                                                   |
|-----------------------------------------------|-------|--------------------------------------------------------|
| Nieprawidłowa walidacja                       | 400   | Brak `text`/`maxCount`, `text.length>10000`, `maxCount>20` |
| Brak tokena lub nieważny token                | 401   | Użytkownik nieautoryzowany                             |
| Przekroczono limit wywołań                    | 429   | Too Many Requests                                      |
| Błąd AIService (timeout/500)                  | 500   | Wewnętrzny błąd AIService                              |
| Błąd zapisu do bazy (`generation_logs`)       | 500   | Błąd po stronie bazy                                   |

## 8. Wydajność
- **Asynchroniczność:** AIService wywoływane async, użycie `Promise.all` lub strumieni  
- **Indeksowanie:** Tabela `generation_logs` wymaga indeksu na `user_id` i `created_at`  
- **Cache (opcjonalnie):** krótkoterminowe cache’owanie odpowiedzi dla tych samych zapytań (Redis)  
- **Rate limiting:** zapobiega przeciążeniu  

## 9. Kroki implementacji
1. **Schema update**  
   - Dodać tabelę `generation_logs` w Supabase (SQL migration).  
2. **DTO i Command**  
   - Zaimplementować `GenerateProposalsRequestDto`, `FlashcardProposalDto`, `GenerateProposalsResponseDto`, `GenerateFlashcardProposalsCommand`.  
3. **AIService**  
   - Upewnić się, że istnieje moduł `AIService.generate(text, maxCount)`.  
4. **FlashcardService**  
   - Dodać metodę `generateProposals(command)`:
     1. Wywołanie AI  
     2. Transformacja odpowiedzi  
     3. Zapis do `generation_logs`  
5. **Kontroler**  
   - Utworzyć endpoint `POST /flashcards/generate` w warstwie kontrolera:
     - Walidacja DTO  
     - Autoryzacja JWT  
     - Wywołanie `FlashcardService`  
     - Zwrócenie odpowiedzi  
6. **Middleware**  
   - Wdrożyć rate limiting dla `/flashcards/generate`  
7. **Testy jednostkowe**  
   - Mock AIService i testy dla różnych scenariuszy walidacji i błędów  
8. **Testy integracyjne**  
   - Pełny przebieg z Supabase RLS i SQL migration  
9. **Deployment**  
   - CI/CD poprzez GitHub Actions  
   - Weryfikacja w środowisku staging  
10. **Monitorowanie**  
    - Sprawdzenie logów w Supabase  
    - Dashboard metryk generacji
