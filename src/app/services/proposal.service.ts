import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FlashCardModel } from '../components/model/flash-card.model';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private proposalsSubject = new BehaviorSubject<FlashCardModel[]>([]);
  public proposals$ = this.proposalsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Konstruktor z wstrzyknięciem HttpClient
  }

  setProposals(proposals: FlashCardModel[]): void {
    console.log('Ustawianie propozycji:', proposals); // Logowanie danych
    this.proposalsSubject.next(proposals);
  }

  getProposals(): FlashCardModel[] {
    return this.proposalsSubject.getValue();
  }

  saveProposalAsFlashcard(proposal: FlashCardModel): Observable<any> {
    const url = '/api/flashcards'; // Endpoint backendu do zapisu flashcarda
    return this.http.post(url, proposal);
  }
}
