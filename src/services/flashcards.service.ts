import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from '../environments/environment';
import {FlashCardModel} from "../app/components/model/flash-card.model";
import {map} from "rxjs/operators";
import {AuthService} from "../app/services/auth.service";

export interface Flashcard {
  id: number;
  user_id: string;
  concept: string;
  definition: string;
  status: string;
  source: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlashcardsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService); // Assuming this is the correct service for auth
  private readonly apiUrl = `${environment.apiUrl}/flashcards`;

  // Signals
  public flashcardsSignal: WritableSignal<FlashCardModel[]> = signal<FlashCardModel[]>([]);
  public readonly flashcards = computed(() => this.flashcardsSignal());

  public getFlashcards(): Observable<FlashCardModel[]> {
    return this.http.get<FlashCardModel[]>(this.apiUrl).pipe(
      tap(cards => this.flashcardsSignal.set(cards))
    );
  }

  public getUserFlashcards(userId: string): Observable<FlashCardModel[]> {
    return this.http.get<{ flashcards: FlashCardModel[] }>(`${this.apiUrl}/user/${userId}`).pipe(
      map(resp => resp.flashcards),
      tap(cards => this.flashcardsSignal.set(cards))
    );
  }

  public updateFlashcard(card: FlashCardModel): Observable<FlashCardModel> {
    console.log('Updating card:', card.user_id);
    const payload = {
      userId: card.user_id,
      concept: card.concept,
      definition: card.definition,
      status: card.status,
      source: card.source
    };
    return this.http.put<FlashCardModel>(
      `${this.apiUrl}/${card.id}`,
      payload
    ).pipe(
      tap(updatedCard => {
        console.log('Card updated:', updatedCard);
        // 3. Aktualizacja stanu lokalnego
        const currentCards = this.flashcardsSignal();
        const idx = currentCards.findIndex(c => c.id === updatedCard.id);
        if (idx !== -1) {
          const updatedCards = [...currentCards];
          updatedCards[idx] = updatedCard;
          this.flashcardsSignal.set(updatedCards);
        }
      })
    );
  }

  public createFlashCardFromProposal(card: FlashCardModel): Observable<FlashCardModel> {
    console.log('Updating card:', card.user_id);
    const payload = {
      user_id: this.authService.getCurrentUserId(),
      concept: card.concept,
      definition: card.definition,
      status: 'accepted',
      source: 'ai'
    };
    console.log('Payload:', payload);
    return this.http.post<FlashCardModel>(
      `${this.apiUrl}`,
      payload
    ).pipe(
      tap(updatedCard => {
        console.log('Card updated:', updatedCard);
        // 3. Aktualizacja stanu lokalnego
        const currentCards = this.flashcardsSignal();
        const idx = currentCards.findIndex(c => c.id === updatedCard.id);
        if (idx !== -1) {
          const updatedCards = [...currentCards];
          updatedCards[idx] = updatedCard;
          this.flashcardsSignal.set(updatedCards);
        }
      })
    );
  }

  public createFlashcard(card: FlashCardModel): Observable<FlashCardModel> {
    return this.http.post<{ flashcard: FlashCardModel }>(this.apiUrl, card).pipe(
      map(response => response.flashcard),
      tap(newCard => {
        console.log('New card created:', newCard);
        // Dodanie do lokalnego stanu
        this.flashcardsSignal.update(cards => [...cards, newCard]);
        console.log('New card created:', newCard);
      })
    );
  }
}

