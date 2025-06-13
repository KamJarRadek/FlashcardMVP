import {TestBed} from '@angular/core/testing';
import {MatDialog} from '@angular/material/dialog';
import {of} from 'rxjs';
import {FlashcardProposalCardComponent} from './flashcard-proposal-card.component';
import {FlashcardsService} from '../../../services/flashcards.service';
import {NotificationService} from '../../../services/notification.service';
import {FlashCardModel} from '../model/flash-card.model';
import {jest} from '@jest/globals';

describe('FlashcardProposalCardComponent', () => {
  let component: FlashcardProposalCardComponent;
  let flashcardsServiceMock: any;
  let notificationServiceMock: any;
  let matDialogMock: any;

  beforeEach(async () => {
    flashcardsServiceMock = {
      createFlashCardFromProposal: jest.fn().mockReturnValue(of({})),
      updateFlashcard: jest.fn().mockReturnValue(of({})),
    };

    notificationServiceMock = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
    };

    matDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(undefined)),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [FlashcardProposalCardComponent],
      providers: [
        {provide: FlashcardsService, useValue: flashcardsServiceMock},
        {provide: NotificationService, useValue: notificationServiceMock},
        {provide: MatDialog, useValue: matDialogMock},
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlashcardProposalCardComponent);
    component = fixture.componentInstance;
    component.card = {
      id: '1',
      isProposal: true,
      user_id: 'user123',
      concept: 'Sample Concept',
      definition: 'Sample Definition',
      status: 'pending',
      source: 'manual',
    } as FlashCardModel;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createFlashCardFromProposal when editing a proposal card', () => {
    matDialogMock.open.mockReturnValueOnce({
      afterClosed: jest.fn().mockReturnValue(of({id: '1', isProposal: true})),
    });

    component.editFlashcard();

    expect(flashcardsServiceMock.createFlashCardFromProposal).toHaveBeenCalledWith(component.card);
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Flashcard został pomyślnie zaktualizowany.');
  });

  it('should call updateFlashcard when editing a non-proposal card', () => {
    component.card.isProposal = false;
    matDialogMock.open.mockReturnValueOnce({
      afterClosed: jest.fn().mockReturnValue(of({id: '1', isProposal: false})),
    });

    component.editFlashcard();

    expect(flashcardsServiceMock.updateFlashcard).toHaveBeenCalledWith(component.card);
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Flashcard został pomyślnie zaktualizowany.');
  });
});
