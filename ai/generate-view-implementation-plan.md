# Plan implementacji widoku Generowanie fiszek

## 1. Przegląd
Widok „Generowanie fiszek” umożliwia użytkownikowi wklejenie tekstu (do 10 000 znaków), wygenerowanie do 20 propozycji fiszek („definicja – pojęcie”) oraz zaakceptowanie lub odrzucenie każdej propozycji. Zaakceptowane fiszki są od razu zapisywane do bazy i usuwane z widoku propozycji.

## 2. Routing widoku
- `/generate` – główny widok z formularzem generowania
- `/generate/proposals` – widok z listą wygenerowanych propozycji

## 3. Struktura komponentów
```
GenerateViewComponent
├── GenerateFormComponent
│   ├── CharacterCounterDirective
│   └── SpinnerOverlayService (injected)
└── ProposalListComponent
    ├── FlashcardProposalCardComponent  (× up to 20)
    ├── ConfirmDeleteDialog  (MatDialog)
    └── ErrorService (injected)
```

## 4. Szczegóły komponentów

### GenerateFormComponent
- **Opis**: formularz do wklejenia tekstu, walidacja długości, wywołanie API
- **Główne elementy**:
  - `<mat-form-field>` z `<textarea matInput>` podłączonym do Reactive Forms
  - `<app-character-counter>` pokazujący liczbę znaków/limit
  - `<button mat-raised-button>` „Generuj” (disabled gdy invalid)
  - SpinnerOverlayService.show() / .hide()
- **Obsługiwane zdarzenia**:
  - `input` → aktualizacja sygnału tekstu
  - `click` na „Generuj” → `onGenerate()`
- **Warunki walidacji**:
  - `Validators.required`
  - `Validators.maxLength(10000)`
- **Typy**:
  - `GenerateRequestDTO { text: string; maxCount: number }`
  - `GenerateResponseDTO { proposals: ProposalDTO[] }`
- **Propsy**: brak (samodzielny widok)

### ProposalListComponent
- **Opis**: wyświetla listę wygenerowanych propozycji, zarządza akcjami akceptuj/usuń
- **Główne elementy**:
  - `<app-flashcard-proposal-card>` w `*ngFor="let p of proposals"`
  - `<mat-dialog>` dla potwierdzenia usunięcia
  - Informacja gdy `proposals.length === 0`
- **Obsługiwane zdarzenia**:
  - `accept` (z karty) → `onAccept(p: ProposalDTO)`
  - `delete` (z karty) → `onDelete(p: ProposalDTO)`
- **Warunki walidacji**: brak (dane z API)
- **Typy**:
  - `ProposalDTO { definition: string; concept: string }`
  - `FlashcardDTO { id: string; definition: string; concept: string; status: 'accepted'; source: 'AI'; created_at: string }`
- **Propsy**: 
  - `@Input() proposals: Signal<ProposalDTO[]>`
  - `@Output() accept = new EventEmitter<ProposalDTO>()`
  - `@Output() delete = new EventEmitter<ProposalDTO>()`

### FlashcardProposalCardComponent
- **Opis**: karta pojedynczej propozycji
- **Elementy dzieci**:
  - Nagłówek: definicja
  - Treść: pojęcie
  - Dwa przyciski: `MatButton` „Akceptuj” i „Usuń”
- **Obsługiwane zdarzenia**:
  - klik „Akceptuj” → `accept.emit(this.proposal)`
  - klik „Usuń” → `delete.emit(this.proposal)`
- **Propsy**:
  - `@Input() proposal: ProposalDTO`
  - `@Output() accept = new EventEmitter<ProposalDTO>()`
  - `@Output() delete = new EventEmitter<ProposalDTO>()`

## 5. Typy

\`\`\`ts
// DTO do wywołań API
interface GenerateRequestDTO {
  text: string;
  maxCount: number;
}
interface ProposalDTO {
  definition: string;
  concept: string;
}
interface GenerateResponseDTO {
  proposals: ProposalDTO[];
}
interface AcceptProposalsRequestDTO {
  proposals: ProposalDTO[];
}
interface FlashcardDTO {
  id: string;
  definition: string;
  concept: string;
  status: 'accepted';
  source: 'AI';
  created_at: string;
}
interface AcceptProposalsResponseDTO {
  items: FlashcardDTO[];
}

// ViewModel
type ProposalsSignal = Signal<ProposalDTO[]>;
\`\`\`

## 6. Zarządzanie stanem
- **FlashcardsService** (injectable, standalone)
  - `proposals = signal<ProposalDTO[]>([])`
  - `isLoading = signal(false)`
  - `generate(text: string)`: ustawia `isLoading`, wywołuje `/flashcards/generate`, zapisuje `proposals`
  - `acceptOne(p: ProposalDTO)`: POST `/flashcards` z `[p]`, usuwa z `proposals`
- **GenerateViewComponent** korzysta z service.proposals i service.isLoading
- OnPush + Angular Signals + deferrable views

## 7. Integracja API
- **`POST /flashcards/generate`**  
  - Request: `GenerateRequestDTO`  
  - Response: `GenerateResponseDTO`  
- **`POST /flashcards`**  
  - Request: `AcceptProposalsRequestDTO` (może być pojedyncza propozycja)  
  - Response: `AcceptProposalsResponseDTO`  
- Realizacja przez Angular HttpClient (AuthInterceptor dodaje JWT)

## 8. Interakcje użytkownika
1. Wpisuje / wkleja tekst → widoczny licznik znaków  
2. Przekroczenie 10 000: inline error, przycisk „Generuj” zablokowany  
3. Klik na „Generuj”: spinner; po éxito redirekt do `/generate/proposals`  
4. Lista kart: każde „Akceptuj” → HTTP POST → usunięcie karty + SnackBar  
5. Każde „Usuń” → otwarcie ConfirmDeleteDialog → po potwierdzeniu usunięcie karty  
6. Gdy lista pusta: komunikat „Brak propozycji”

## 9. Warunki i walidacja
- Formularz generowania:
  - `required`, `maxLength(10000)`
- Przyciski akcji dostępne tylko dla prawidłowych danych
- Obsługa 401 (przekierowanie do `/login`), 429 (wiadomość „Za dużo żądań”), inne błędy → SnackBar

## 10. Obsługa błędów
- Globalny `ErrorService`: subskrypcja HttpInterceptor  
- 401 → `Router.navigate(['/login'])`  
- 429 → SnackBar z komunikatem  
- Inne → „Wystąpił błąd, spróbuj ponownie”  
- Dialog potwierdzenia przed usunięciem propozycji

## 11. Kroki implementacji
1. Utworzyć `FlashcardsService` z metodami `generate(text)`, `acceptOne(p)`; sygnały `proposals`, `isLoading`.  
2. Zaimplementować `GenerateFormComponent` (ReactiveForms + CharacterCounterDirective + spinner).  
3. Dodać routing do `GenerateViewComponent` i lazy‐load w `GenerateModule`.  
4. Zaimplementować `ProposalListComponent` i `FlashcardProposalCardComponent` (OnPush).  
5. Utworzyć `ConfirmDeleteDialog` (MatDialog) dla usuwania.  
6. Dodać `AuthInterceptor` i `ErrorService` do obsługi błędów.  
7. Przetestować scenariusze: przekroczenie limitu, sukces API, błędy sieci.  
8. Dodać e2e testy generowania i akceptacji za pomocą Cypress (opcjonalnie).  
9. Zapisać zmiany i uruchomić manualne testy w przeglądarce.  
10. Przekazać do code review i CI/CD.
