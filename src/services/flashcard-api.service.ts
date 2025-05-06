import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpService} from './http.service';
import {ApiResponseType, PaginatedResponse} from '../models/api-response.model';
import {FlashCardModel} from "../app/components/model/flash-card.model";
import {FlashcardProposalDto, GenerateFlashcardProposalsCommand} from "../models/flashcard.dto";

@Injectable({
  providedIn: 'root'
})
export class FlashCardModelApiService {
  private baseEndpoint = 'FlashCardModels';

  constructor(private httpService: HttpService) {
  }

  /**
   * Pobiera fiszki użytkownika
   * @param userId ID użytkownika
   * @param limit Limit wyników (domyślnie 100)
   * @param offset Przesunięcie wyników (domyślnie 0)
   */
  getUserFlashCardModels(userId: string, limit = 100, offset = 0): Observable<PaginatedResponse<FlashCardModel>> {
    return this.httpService.get<PaginatedResponse<FlashCardModel>>(
      `${this.baseEndpoint}/user/${userId}`,
      {limit, offset}
    );
  }

  /**
   * Pobiera pojedynczą fiszkę po ID
   * @param id ID fiszki
   */
  getFlashCardModel(id: string): Observable<FlashCardModel> {
    return this.httpService.get<ApiResponseType<FlashCardModel>>(`${this.baseEndpoint}/${id}`)
      .pipe(
        map((response: any) => {
          if (response.status === 'success') {
            return response.FlashCardModel;
          }
          throw new Error(response.message || 'Nie udało się pobrać fiszki');
        })
      );
  }

  /**
   * Tworzy nową fiszkę
   * @param FlashCardModel Dane fiszki
   */
  createFlashCardModel(FlashCardModel: Partial<FlashCardModel>): Observable<FlashCardModel> {
    return this.httpService.post<ApiResponseType<FlashCardModel>>(this.baseEndpoint, FlashCardModel)
      .pipe(
        map((response: any) => {
          if (response.status === 'success') {
            return response.FlashCardModel;
          }
          throw new Error(response.message || 'Nie udało się utworzyć fiszki');
        })
      );
  }

  /**
   * Aktualizuje fiszkę
   * @param id ID fiszki
   * @param FlashCardModel Dane do aktualizacji
   */
  updateFlashCardModel(id: string, FlashCardModel: Partial<FlashCardModel>): Observable<FlashCardModel> {
    return this.httpService.put<ApiResponseType<FlashCardModel>>(`${this.baseEndpoint}/${id}`, FlashCardModel)
      .pipe(
        map((response: any) => {
          if (response.status === 'success') {
            return response.FlashCardModel;
          }
          throw new Error(response.message || 'Nie udało się zaktualizować fiszki');
        })
      );
  }

  /**
   * Usuwa fiszkę
   * @param id ID fiszki
   */
  deleteFlashCardModel(id: string): Observable<void> {
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
