import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  // Zaktualizuj URL do swojego lokalnego API AI (np. instancja Ollamama)
  private apiUrl = 'http://localhost:11434/api/flashcards';

  constructor(private http: HttpClient) {}

  generateFlashcards(text: string): Observable<any> {
    // Wywołanie rzeczywistego API zamiast zwracania danych mock
    return this.http.post<any>(this.apiUrl, { text });
  }
}
