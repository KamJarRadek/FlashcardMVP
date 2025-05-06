import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FlashCardModel} from "../model/flash-card.model";

@Component({
  selector: 'app-edit-flashcard-dialog',
  templateUrl: './edit-flashcard-dialog.component.html',
  styleUrls: ['./edit-flashcard-dialog.component.scss'],
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
export class EditFlashcardDialogComponent {
  public readonly dialogRef = inject(MatDialogRef<EditFlashcardDialogComponent>);
  public readonly data = inject<FlashCardModel>(MAT_DIALOG_DATA);

  public readonly editForm = new FormGroup({
    concept: new FormControl(this.data.concept, Validators.required),
    definition: new FormControl(this.data.definition, Validators.required)
  });

  public save(): void {
    if (this.editForm.valid) {
      const updatedCard: FlashCardModel = {...this.data, ...this.editForm.value as Pick<FlashCardModel, 'concept' | 'definition'>};
      this.dialogRef.close(updatedCard);
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }
}
