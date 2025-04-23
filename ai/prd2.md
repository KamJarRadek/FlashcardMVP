# Dokument wymagań produktu (PRD) - Fiszki AI

## 1. Przegląd produktu
Aplikacja Fiszki AI ma na celu usprawnienie procesu tworzenia fiszek edukacyjnych poprzez automatyczne generowanie fiszek na podstawie wprowadzonego tekstu oraz umożliwienie ich ręcznego tworzenia. Rozwiązanie skierowane jest do osób w wieku 30–50 lat, pracujących i zainteresowanych zdobywaniem nowej wiedzy. Produkt ma zapewnić prosty, intuicyjny interfejs oraz podstawową responsywność dla urządzeń desktop i mobilnych. Całość MVP ma zostać zrealizowana w ciągu 2 tygodni, koncentrując się na jednym, spójnym scenariuszu użytkownika.

## 2. Problem użytkownika
Manualne tworzenie wysokiej jakości fiszek edukacyjnych jest czasochłonne i wymaga znacznego nakładu pracy. Użytkownicy, którzy chcą wykorzystać metodę spaced repetition do efektywnej nauki, często rezygnują z tej metody z powodu zbyt dużej pracy potrzebnej do przygotowania materiałów. Fiszki AI eliminują ten problem, automatyzując proces generowania fiszek z wprowadzonego tekstu, przy jednoczesnej możliwości ręcznego tworzenia i modyfikowania fiszek, co zwiększa komfort użytkownika.

## 3. Wymagania funkcjonalne
- Automatyczne generowanie fiszek przez AI na podstawie wprowadzonego przez użytkownika tekstu (maksymalnie 10 000 znaków wejściowych). W wyniku tego procesu może zostać wygenerowanych maksymalnie 20 fiszek, każda zawierająca dwa pola: przód (pytanie) i tył (odpowiedź).
- Możliwość ręcznego tworzenia fiszek z wykorzystaniem dwóch pól (przód i tył).
- Funkcjonalność przeglądania, edycji oraz usuwania fiszek.
- Prosty system rejestracji i logowania, umożliwiający bezpieczne przechowywanie danych użytkownika.
- Integracja z gotowym algorytmem powtórek, który umożliwia zastosowanie metody spaced repetition bez konieczności opracowywania własnego algorytmu.
- Walidacja tekstu wejściowego – ograniczenie do 10 000 znaków bez konieczności informowania użytkownika o limicie.

## 4. Granice produktu
- Nie zostanie wdrożony własny, zaawansowany algorytm powtórek (np. typu SuperMemo czy Anki); wykorzystamy gotowy algorytm.
- Nie przewidujemy importu wielu formatów plików (np. PDF, DOCX).
- Nie uwzględniamy możliwości współdzielenia zestawów fiszek między użytkownikami.
- Brak integracji z zewnętrznymi platformami edukacyjnymi.
- Na etapie MVP aplikacja będzie dostępna wyłącznie w formie webowej – nie przewiduje się aplikacji mobilnych.
- Nie obejmuje wdrożenia zaawansowanych narzędzi analitycznych ani funkcji dodatkowych, takich jak edycja automatycznie generowanych fiszek poza standardową możliwością ręcznej modyfikacji.

## 5. Historyjki użytkowników

### US-001: Rejestracja i logowanie
- Tytuł: Rejestracja i logowanie użytkownika
- Opis: Jako użytkownik chcę mieć możliwość rejestracji oraz logowania do systemu, aby mieć bezpieczny dostęp do moich fiszek i móc je modyfikować.
- Kryteria akceptacji:
  - Użytkownik musi podać unikalny adres e-mail oraz hasło podczas rejestracji.
  - System po poprawnej rejestracji automatycznie loguje użytkownika.
  - Funkcja logowania wymaga weryfikacji podanych danych.
  - Dostęp do fiszek jest ograniczony do zalogowanego użytkownika.

### US-002: Manualne tworzenie fiszek
- Tytuł: Ręczne tworzenie fiszek
- Opis: Jako użytkownik chcę mieć możliwość ręcznego tworzenia fiszek, aby móc dostosować treść do moich indywidualnych potrzeb.
- Kryteria akceptacji:
  - Interfejs umożliwia wpisanie danych do dwóch pól: przód (pytanie) i tył (odpowiedź).
  - Użytkownik może zapisać fiszkę, która następnie pojawia się na liście dostępnych fiszek.
  - Zapisana fiszka jest edytowalna i możliwa do usunięcia.

### US-003: Automatyczne generowanie fiszek przez AI
- Tytuł: Automatyczne generowanie fiszek
- Opis: Jako użytkownik chcę wprowadzić dowolny tekst (do 10 000 znaków) i automatycznie otrzymać wygenerowane fiszki (maksymalnie 20), aby oszczędzić czas potrzebny na ich ręczne tworzenie.
- Kryteria akceptacji:
  - Użytkownik ma możliwość wklejenia tekstu do pola wejściowego.
  - System waliduje długość tekstu (maksymalnie 10 000 znaków).
  - Po zatwierdzeniu tekstu system generuje do 20 fiszek, z których każda zawiera pola: przód (pytanie) i tył (odpowiedź).
  - Wygenerowane fiszki są prezentowane użytkownikowi, który może je zaakceptować lub odrzucić.

### US-004: Przeglądanie, edycja i usuwanie fiszek
- Tytuł: Zarządzanie fiszkami
- Opis: Jako użytkownik chcę móc przeglądać, edytować i usuwać moje fiszki, aby łatwo zarządzać nauczanym materiałem.
- Kryteria akceptacji:
  - Użytkownik może wyświetlić listę wszystkich zapisanych fiszek.
  - Każda fiszka może być edytowana lub usunięta przy użyciu intuicyjnych przycisków w interfejsie.
  - Zmiany wprowadzone w fiszce są zapisywane i widoczne na liście.

### US-005: Integracja z algorytmem powtórek
- Tytuł: Integracja z algorytmem powtórek
- Opis: Jako użytkownik chcę, aby moje fiszki były zintegrowane z gotowym algorytmem powtórek, umożliwiając efektywne stosowanie metody spaced repetition.
- Kryteria akceptacji:
  - Po zapisaniu fiszki informacje są automatycznie przekazywane do systemu powtórek.
  - Użytkownik ma możliwość rozpoczęcia sesji powtórek zgodnie z ustalonym algorytmem.
  - Interfejs wyświetla informacje dotyczące nadchodzących powtórek dla poszczególnych fiszek.

## 6. Metryki sukcesu
- 75% fiszek wygenerowanych przez AI musi być akceptowanych przez użytkowników.
- Użytkownicy mają korzystać z funkcji generowania AI dla co najmniej 75% stworzonych fiszek.
- Produkt musi zostać dostarczony w ciągu 2 tygodni bez przekraczania ustalonych wymagań MVP.
- Użytkownicy zgłaszają pozytywne opinie dotyczące prostoty obsługi interfejsu i intuicyjności całego systemu.
