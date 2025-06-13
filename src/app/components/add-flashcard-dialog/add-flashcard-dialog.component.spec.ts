import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddFlashcardDialogComponent } from './add-flashcard-dialog.component';
import { Flashcard } from '../../../services/flashcards.service';

describe('AddFlashcardDialogComponent', () => {
  let component: AddFlashcardDialogComponent;
  let dialogRefMock: any;

  beforeEach(async () => {
    dialogRefMock = {
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AddFlashcardDialogComponent, BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AddFlashcardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with new flashcard data when save is called and form is valid', () => {
    component.addForm.setValue({ front: 'Front text', back: 'Back text' });

    component.save();

    const expectedCard: Partial<Flashcard> = {
      concept: 'Front text',
      definition: 'Back text',
      user_id: '',
      status: 'new',
      source: 'manual',
    };

    expect(dialogRefMock.close).toHaveBeenCalledWith(expectedCard);
  });

  it('should not close the dialog when save is called and form is invalid', () => {
    component.addForm.setValue({ front: '', back: '' });

    component.save();

    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should close the dialog without data when cancel is called', () => {
    component.cancel();

    expect(dialogRefMock.close).toHaveBeenCalledWith();
  });
});
