import {FlashcardsService} from './flashcards.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {environment} from '../environments/environment';

describe('FlashcardsService', () => {
  let service: FlashcardsService;
  let httpMock: HttpTestingController;

  const mockCard = {
    id: 1,
    user_id: 'user123',
    concept: 'Angular',
    definition: 'Framework do frontend',
    status: 'accepted',
    source: 'manual'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FlashcardsService]
    });
    service = TestBed.inject(FlashcardsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch user flashcards', () => {
    service.getUserFlashcards('user123').subscribe(cards => {
      expect(cards.length).toBe(1);
      expect(cards[0].concept).toBe('Angular');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/flashcards/user/user123`);
    expect(req.request.method).toBe('GET');
    req.flush({flashcards: [mockCard]});
  });

  it('should create new flashcard', () => {
    service.createFlashcard(mockCard).subscribe(card => {
      expect(card.concept).toBe('Angular');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/flashcards`);
    expect(req.request.method).toBe('POST');
    req.flush({flashcard: mockCard});
  });

  afterEach(() => {
    httpMock.verify();
  });
  it('should fetch all flashcards', () => {
    service.getFlashcards().subscribe(cards => {
      expect(cards.length).toBe(1);
      expect(cards[0].concept).toBe('Angular');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/flashcards`);
    expect(req.request.method).toBe('GET');
    req.flush([mockCard]);
  });
  it('should update an existing flashcard and update local state', () => {
    const mockCard = {
      id: 1,
      user_id: 'user123',
      concept: 'Angular',
      definition: 'Framework do frontend',
      status: 'accepted',
      source: 'manual'
    };

    // najpierw ustaw aktualny stan w signalu (symulujemy początkową listę fiszek)
    service.flashcardsSignal.set([mockCard]);

    const updatedCard = {
      ...mockCard,
      definition: 'Framework SPA',
      concept: 'Angular 19'
    };

    service.updateFlashcard(updatedCard).subscribe(result => {
      expect(result.definition).toBe('Framework SPA');
      expect(result.concept).toBe('Angular 19');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/flashcards/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({
      userId: 'user123',
      definition: 'Framework SPA',
      concept: 'Angular 19',
      status: 'accepted',
      source: 'manual'
    });

    req.flush(updatedCard);

    // sprawdzamy, czy stan lokalny został zaktualizowany
    const updated = service.flashcardsSignal();
    expect(updated[0].definition).toBe('Framework SPA');
    expect(updated[0].concept).toBe('Angular 19');
  });
});
