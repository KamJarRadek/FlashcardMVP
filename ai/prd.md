# Dokument wymagań produktu (PRD) - {{app-name}}

## 1. Przegląd produktu
Aplikacja ma na celu usprawnienie procesu tworzenia fiszek edukacyjnych poprzez automatyczne generowanie treści przy pomocy sztucznej inteligencji. System umożliwia użytkownikom nie tylko generowanie fiszek z wprowadzonego tekstu (maksymalnie 10 000 znaków) w formacie "definicja-pojęcie", ale także ręczne tworzenie, edycję oraz usuwanie fiszek. Produkt wspiera prosty system autoryzacji (logowanie za pomocą e-maila, hasła oraz OAuth) oraz tryb nauki oparty na losowym (sekwencyjnym) wyświetlaniu fiszek. Dodatkowo, system zbiera dane dotyczące pochodzenia fiszek (AI vs. ręczne tworzenie) oraz ich statusu (zaakceptowane lub odrzucone) w celu prezentacji statystyk.

## 2. Problem użytkownika
Użytkownicy chcą korzystać z efektywnej metody nauki, jaką jest spaced repetition, jednak ręczne tworzenie wysokiej jakości fiszek jest czasochłonne i zniechęcające. Problem polega na tym, że:
- Wprowadzenie długiego tekstu wymaga dużego nakładu pracy przy ekstrakcji najważniejszych informacji.
- Ręczne przygotowanie definiujących pojęć fiszek jest uciążliwe, co wpływa negatywnie na motywację do nauki.
- Brak automatyzacji utrudnia szybkie generowanie materiałów dydaktycznych, co z kolei zmniejsza efektywność nauki.

## 3. Wymagania funkcjonalne
1. Użytkownik może wprowadzić tekst o maksymalnej długości 10 000 znaków, z którego system wygeneruje fiszki.
2. Z jednego wprowadzonego tekstu system generuje maksymalnie 20 fiszek, każdą w formacie "definicja-pojęcie".
3. Wygenerowane fiszki są prezentowane użytkownikowi z opcjami: „akceptuj” oraz „usuń”. Po zaakceptowaniu fiszka trafia do listy umożliwiającej edycję.
4. Użytkownik ma możliwość tworzenia fiszek ręcznie, których treść przechowywana jest identycznie jak fiszek generowanych automatycznie.
5. Wszystkie fiszki są przechowywane bez dodatkowych metadanych (poza informacjami dotyczącymi źródła i statusu akceptacji).
6. Implementacja systemu autoryzacji opiera się na logowaniu przy użyciu e-maila, hasła oraz mechanizmu OAuth. Funkcja resetu hasła nie jest wdrażana w MVP.
7. Tryb nauki umożliwia losowe (sekwencyjne) wyświetlanie fiszek, bez implementacji zaawansowanego algorytmu powtórek.
8. Aplikacja ma być zbudowana głównie po stronie front-endu, z back-endem wykorzystującym hostowaną bazę danych oraz konsolę uruchomieniową.
9. System zapisuje logi generacji fiszek w bazie danych w celu monitorowania operacji.
10. System zbiera informacje o pochodzeniu fiszek (czy zostały wygenerowane przez AI, czy utworzone ręcznie) oraz statusie ich akceptacji (zaakceptowane vs. odrzucone) w celu tworzenia wykresów statystyk.
11. Testowanie MVP obejmuje manualne testy użytkownika oraz testy jednostkowe napisane przez deweloperów.

## 4. Granice produktu
Produkt w swoim MVP nie obejmuje:
1. Wdrożenia zaawansowanego algorytmu powtórek (np. SuperMemo, Anki).
2. Importu tekstu z wielu formatów (PDF, DOCX, itp.).
3. Funkcji współdzielenia zestawów fiszek między użytkownikami.
4. Integracji z innymi platformami edukacyjnymi.
5. Aplikacji mobilnych – na początek wdrożenie wyłącznie w wersji web.
6. Zbierania rozbudowanych metryk (takich jak analiza feedbacku użytkownika czy metryki poza informacjami o źródle i statusie akceptacji).

## 5. Historyjki użytkowników

### US-001
Tytuł: Generowanie fiszek z wprowadzonego tekstu  
Opis: Użytkownik wprowadza tekst o maksymalnej długości 10 000 znaków, a system generuje do 20 fiszek w formacie "definicja-pojęcie".  
Kryteria akceptacji:
- Użytkownik może wkleić tekst do pola wejściowego, a system weryfikuje limit 10 000 znaków.
- System generuje maksymalnie 20 fiszek z wprowadzonego tekstu.
- Każda fiszka posiada czytelny podział na definicję i pojęcie.

### US-002
Tytuł: Weryfikacja i akceptacja/odrzucenie wygenerowanych fiszek  
Opis: Po automatycznym wygenerowaniu fiszek użytkownik ma możliwość wyboru, które fiszki zaakceptować lub usunąć.  
Kryteria akceptacji:
- Każda wygenerowana fiszka jest prezentowana z przyciskami „akceptuj” oraz „usuń”.
- Po zatwierdzeniu fizka trafia do listy przeznaczonej do edycji.
- W systemie zapisywany jest status każdej fiszki (zaakceptowana lub odrzucona).

### US-003
Tytuł: Edycja zaakceptowanych fiszek  
Opis: Użytkownik po zaakceptowaniu fiszek może później edytować ich treść.  
Kryteria akceptacji:
- Użytkownik ma dostęp do listy zaakceptowanych fiszek.
- Istnieje możliwość modyfikacji treści fiszki poprzez prosty interfejs edycji.
- Zmiany są zapisywane w bazie danych i odzwierciedlają się w trybie nauki.

### US-004
Tytuł: Ręczne tworzenie fiszek  
Opis: Użytkownik ma możliwość samodzielnego tworzenia fiszek poprzez wprowadzenie definicji i odpowiadającego pojęcia.  
Kryteria akceptacji:
- Użytkownik może wprowadzić nową fiszkę poprzez formularz (pola na definicję i pojęcie).
- Wprowadzone fiszki są zapisywane w systemie według tych samych zasad co fiszki generowane automatycznie.
- System rozpoznaje, że fiszka została utworzona ręcznie i odpowiednio oznacza jej źródło.

### US-005
Tytuł: Logowanie i autoryzacja użytkownika  
Opis: Użytkownik uzyskuje dostęp do aplikacji poprzez logowanie za pomocą e-maila i hasła lub OAuth.  
Kryteria akceptacji:
- Ekran logowania umożliwia wpisanie e-maila i hasła.
- Umożliwione jest logowanie za pomocą mechanizmu OAuth.
- System poprawnie autoryzuje użytkownika i udziela dostępu do jego konta.
- Brak opcji resetu hasła w MVP.

### US-006
Tytuł: Tryb nauki – losowe wyświetlanie fiszek  
Opis: Użytkownik w trybie nauki przegląda fiszki wyświetlane losowo, co umożliwia efektywną naukę poprzez powtarzanie materiału.  
Kryteria akceptacji:
- Tryb nauki uruchamia losowe (sekwencyjne) wyświetlanie fiszek.
- Użytkownik może przełączać się między fiszkami bez konieczności stosowania zaawansowanego algorytmu.
- Wyświetlane fiszki odzwierciedlają aktualne dane przechowywane w systemie.

### US-007
Tytuł: Zbieranie logów generacji i metryk  
Opis: System zbiera logi związane z generowaniem fiszek oraz dane dotyczące źródła ich powstania i statusu akceptacji, co umożliwia generowanie statystyk.  
Kryteria akceptacji:
- Każda operacja generowania fiszki jest zapisywana w bazie danych.
- System rejestruje informację, czy fiszka została wygenerowana przez AI, czy utworzona ręcznie.
- Status akceptacji (zaakceptowana/odrzucona) jest zapisywany dla każdej wygenerowanej fiszki.

### US-008
Tytuł: Prezentacja statystyk użytkowania  
Opis: Użytkownik (lub administrator) może wyświetlić wykresy statystyk pokazujące liczbę fiszek wygenerowanych przez AI i utworzonych ręcznie oraz ich status akceptacji.  
Kryteria akceptacji:
- Na interfejsie dostępna jest opcja wyświetlenia statystyk.
- Statystyki zawierają dane o liczbie fiszek według źródła (AI vs. ręczne) oraz statusu (zaakceptowane vs. odrzucone).
- Wykresy prezentowane są w sposób czytelny i aktualizowane przy każdej zmianie danych.

## 6. Metryki sukcesu
1. 75% fiszek wygenerowanych przez AI musi być zaakceptowanych przez użytkownika. Monitorowane jest to na podstawie stosunku liczby zaakceptowanych fiszek do liczby wygenerowanych.
2. Co najmniej 75% fiszek tworzonych przez użytkowników powinno pochodzić z wykorzystania AI do generacji, co będzie weryfikowane na podstawie zbieranych danych dotyczących źródła powstania fiszek.
3. System zbiera dane niezbędne do wygenerowania wykresów statystyk, prezentujących m.in. liczbę fiszek wygenerowanych przez AI, utworzonych ręcznie, oraz ich status (zaakceptowane/odrzucone).

Podsumowując, dokument ten zawiera pełny zestaw wymagań funkcjonalnych oraz historyjek użytkownika, które umożliwią wdrożenie w pełni funkcjonalnego MVP. Wszystkie interakcje użytkownika zostały opisane, a kryteria akceptacji są jasne i testowalne, co zapewni możliwość kompleksowej weryfikacji poprawności działania systemu.
