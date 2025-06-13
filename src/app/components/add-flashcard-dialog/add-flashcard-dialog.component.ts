import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import {Flashcard} from '../../../services/flashcards.service';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-add-flashcard-dialog',
  templateUrl: './add-flashcard-dialog.component.html',
  styleUrls: ['./add-flashcard-dialog.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFlashcardDialogComponent {
  public readonly dialogRef = inject(MatDialogRef<AddFlashcardDialogComponent>);

  public readonly addForm = new FormGroup({
    front: new FormControl('', Validators.required),
    back: new FormControl('', Validators.required)
  });

  public save(): void {
    if (this.addForm.valid) {
      const formValue = this.addForm.value;
      const newCard: Partial<Flashcard> = {
        concept: formValue.front as string,
        definition: formValue.back as string,
        user_id: '', // Wartość do uzupełnienia w innym miejscu
        status: 'new',
        source: 'manual'
      };

      this.dialogRef.close(newCard);
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }
}
