import { TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditFlashcardDialogComponent } from './edit-flashcard-dialog.component';
import { FlashCardModel } from '../model/flash-card.model';

describe('EditFlashcardDialogComponent', () => {
  let component: EditFlashcardDialogComponent;
  let dialogRefMock: any;
  let dialogDataMock: FlashCardModel;

  beforeEach(async () => {
    dialogRefMock = {
      close: jest.fn(),
    };

    dialogDataMock = {
      id: '1',
      concept: 'Initial Concept',
      definition: 'Initial Definition',
      user_id: 'user123',
      status: 'pending',
      source: 'manual',
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EditFlashcardDialogComponent, BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: dialogDataMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(EditFlashcardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with provided data', () => {
    expect(component.editForm.value).toEqual({
      concept: dialogDataMock.concept,
      definition: dialogDataMock.definition,
    });
  });

  it('should close the dialog with updated data when save is called and form is valid', () => {
    component.editForm.setValue({ concept: 'Updated Concept', definition: 'Updated Definition' });

    component.save();

    const expectedCard: FlashCardModel = {
      ...dialogDataMock,
      concept: 'Updated Concept',
      definition: 'Updated Definition',
    };

    expect(dialogRefMock.close).toHaveBeenCalledWith(expectedCard);
  });

  it('should not close the dialog when save is called and form is invalid', () => {
    component.editForm.setValue({ concept: '', definition: '' });

    component.save();

    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should close the dialog without data when cancel is called', () => {
    component.cancel();

    expect(dialogRefMock.close).toHaveBeenCalledWith();
  });
});
