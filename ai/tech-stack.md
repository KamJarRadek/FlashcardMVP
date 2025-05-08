# Tech Stack

## Frontend
**Framework:** Angular 19  
**Język:** TypeScript 5  
**Biblioteka UI:** Angular Material  

**Opis:**  
Angular 19 umożliwia budowanie dynamicznych, responsywnych interfejsów użytkownika, a Angular Material dostarcza gotowe, estetyczne i funkcjonalne komponenty. Dzięki TypeScript 5 mamy wsparcie statycznego typowania, co przyspiesza wykrywanie błędów oraz poprawia jakość kodu.

---

## Backend
**Platforma:** Supabase  

**Opis:**  
Supabase to kompleksowe rozwiązanie backendowe oparte na bazie danych PostgreSQL. Umożliwia ono szybkie wdrażanie funkcji autoryzacyjnych oraz integrację z różnymi SDK. Dzięki modelowi open source, Supabase można hostować lokalnie lub na serwerach chmurowych. W fazie developmentu darmowy plan wystarcza do realizacji podstawowych funkcji MVP.

---

## AI
**Usługa:** Lokalne API AI  
**Implementacja:** Ollamama uruchomiona w kontenerze Docker  

**Opis:**  
Aby korzystać z funkcji generowania treści przy minimalnych kosztach, wybrano lokalną instancję Ollamama uruchomioną z obrazu Docker. To rozwiązanie pozwala na korzystanie z modeli AI bez konieczności używania płatnych zewnętrznych usług, co jest szczególnie korzystne na etapie developmentu.

---

## CI/CD i Hosting
**CI/CD:** GitHub Actions (darmowy plan)  
**Hosting:** Środowisko lokalne / darmowe platformy (Heroku, Vercel, Netlify)  

**Opis:**  
Procesy build, test i deploy są automatyzowane za pomocą GitHub Actions, co pozwala na sprawną integrację i ciągłą dostawę (CI/CD). W początkowej fazie developmentu aplikacja jest hostowana lokalnie, z możliwością migracji na darmowe platformy, które oferują odpowiednie zasoby dla testowego MVP.

---

## Testing
**Unit Testing**: Jest, Angular Testing Library  
**Integration Testing**: Postman/Newman, REST-assured  
**E2E Testing**: Cypress  
**Security Testing**: OWASP ZAP  
**Accessibility Testing**: axe-core, Lighthouse  

**Opis:**  
Testy jednostkowe i integracyjne zapewniają poprawność działania poszczególnych modułów, podczas gdy testy E2E weryfikują kompletne ścieżki użytkownika. Testy bezpieczeństwa i dostępności gwarantują zgodność z najlepszymi praktykami w zakresie ochrony danych i UX. Wszystkie testy są zintegrowane z CI/CD za pomocą GitHub Actions.

---

## Podsumowanie
Wybrany tech stack pozwala na szybkie i ekonomiczne rozpoczęcie prac nad MVP. Wykorzystanie darmowych narzędzi i otwartych rozwiązań, takich jak lokalna instancja Ollamama w Dockerze, Supabase, Angular oraz GitHub Actions, gwarantuje pełną funkcjonalność przy zerowych kosztach na etapie developmentu.
