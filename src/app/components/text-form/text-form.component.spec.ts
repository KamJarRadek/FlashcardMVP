import { TestBed } from '@angular/core/testing';
import { TextFormComponent } from './text-form.component';
import { AiService } from '../../services/ai.service';
import { ProposalService } from '../../services/proposal.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('TextFormComponent', () => {
  let component: TextFormComponent;
  let aiServiceMock: jest.Mocked<AiService>;
  let proposalServiceMock: jest.Mocked<ProposalService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    aiServiceMock = {
      generateFlashcards: jest.fn()
    } as jest.Mocked<AiService>;

    proposalServiceMock = {
      setProposals: jest.fn()
    } as jest.Mocked<ProposalService>;

    routerMock = {
      navigate: jest.fn()
    } as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TextFormComponent], // Dodano TextFormComponent do imports
      providers: [
        { provide: AiService, useValue: aiServiceMock },
        { provide: ProposalService, useValue: proposalServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(TextFormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if the form is invalid', () => {
    component.textControl.setValue('');
    component.onSubmit();
    expect(aiServiceMock.generateFlashcards).not.toHaveBeenCalled();
  });

  it('should call AiService and set proposals on successful response', () => {
    const mockResponse = {
      proposals: [
        { front: 'Concept 1', back: 'Definition 1' },
        { front: 'Concept 2', back: 'Definition 2' }
      ]
    };
    aiServiceMock.generateFlashcards.mockReturnValue(of(mockResponse));

    component.textControl.setValue('Test input');
    component.onSubmit();

    expect(component.isLoading).toBe(false);
    expect(proposalServiceMock.setProposals).toHaveBeenCalledWith([
      { concept: 'Concept 1', definition: 'Definition 1', isProposal: true },
      { concept: 'Concept 2', definition: 'Definition 2', isProposal: true }
    ]);
  });

  it('should handle errors from AiService', () => {
    aiServiceMock.generateFlashcards.mockReturnValue(throwError(() => new Error('Error')));

    component.textControl.setValue('Test input');
    component.onSubmit();

    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('Wystąpił błąd podczas generowania fiszek.');
  });
});
