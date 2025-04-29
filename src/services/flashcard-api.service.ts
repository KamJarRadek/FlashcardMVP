import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';
import {
  Flashcard,
  FlashcardProposalDto,
  GenerateFlashcardProposalsCommand
} from '../models/flashcard.dto';
import { ApiResponseType, PaginatedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class FlashcardApiService {
  private baseEndpoint = 'flashcards';

  constructor(private httpService: HttpService) {}

  /**
   * Pobiera fiszki użytkownika
   * @param userId ID użytkownika
   * @param limit Limit wyników (domyślnie 100)
   * @param offset Przesunięcie wyników (domyślnie 0)
   */
  getUserFlashcards(userId: string, limit = 100, offset = 0): Observable<PaginatedResponse<Flashcard>> {
    return this.httpService.get<PaginatedResponse<Flashcard>>(
      `${this.baseEndpoint}/user/${userId}`,
      { limit, offset }
    );
  }

  /**
   * Pobiera pojedynczą fiszkę po ID
   * @param id ID fiszki
   */
  getFlashcard(id: string): Observable<Flashcard> {
    return this.httpService.get<ApiResponseType<Flashcard>>(`${this.baseEndpoint}/${id}`)
      .pipe(
        map((response: any) => {
          if (response.status === 'success') {
            return response.flashcard;
          }
          throw new Error(response.message || 'Nie udało się pobrać fiszki');
        })
      );
  }

  /**
   * Tworzy nową fiszkę
   * @param flashcard Dane fiszki
   */
  createFlashcard(flashcard: Partial<Flashcard>): Observable<Flashcard> {
    return this.httpService.post<ApiResponseType<Flashcard>>(this.baseEndpoint, flashcard)
      .pipe(
        map((response: any) => {
          if (response.status === 'success') {
            return response.flashcard;
          }
          throw new Error(response.message || 'Nie udało się utworzyć fiszki');
        })
      );
  }

  /**
   * Aktualizuje fiszkę
   * @param id ID fiszki
   * @param flashcard Dane do aktualizacji
   */
  updateFlashcard(id: string, flashcard: Partial<Flashcard>): Observable<Flashcard> {
    return this.httpService.put<ApiResponseType<Flashcard>>(`${this.baseEndpoint}/${id}`, flashcard)
      .pipe(
        map((response: any) => {
          if (response.status === 'success') {
            return response.flashcard;
          }
          throw new Error(response.message || 'Nie udało się zaktualizować fiszki');
        })
      );
  }

  /**
   * Usuwa fiszkę
   * @param id ID fiszki
   */
  deleteFlashcard(id: string): Observable<void> {
    return this.httpService.delete<ApiResponseType<void>>(`${this.baseEndpoint}/${id}`)
      .pipe(
        map((response: any) => {
          if (response.status === 'success') {
            return;
          }
          throw new Error(response.message || 'Nie udało się usunąć fiszki');
        })
      );
  }

  /**
   * Generuje propozycje fiszek
   * @param command Komenda z danymi do generowania propozycji
   */
  generateProposals(command: GenerateFlashcardProposalsCommand): Observable<FlashcardProposalDto[]> {
    return this.httpService.post<ApiResponseType<FlashcardProposalDto[]>>(
      `${this.baseEndpoint}/generate-proposals`,
      command
    ).pipe(
      map((response: any) => {
        if (response.status === 'success') {
          return response.proposals;
        }
        throw new Error(response.message || 'Nie udało się wygenerować propozycji');
      })
    );
  }

  /**
   * Pobiera statystyki fiszek użytkownika
   * @param userId ID użytkownika
   */
  getUserStatistics(userId: string): Observable<any> {
    return this.httpService.get<ApiResponseType<any>>(`${this.baseEndpoint}/statistics/${userId}`)
      .pipe(
        map((response: any) => {
          if (response.status === 'success') {
            return response.statistics;
          }
          throw new Error(response.message || 'Nie udało się pobrać statystyk');
        })
      );
  }
}
