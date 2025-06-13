import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FlashcardsService} from '../../../services/flashcards.service';
import {NotificationService} from '../../../services/notification.service';
import {EditFlashcardDialogComponent} from '../edit-flashcard-dialog/edit-flashcard-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import {FlashCardModel} from "../model/flash-card.model";

@Component({
  selector: 'app-flashcard-proposal-card',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './flashcard-proposal-card.component.html',
  styleUrl: './flashcard-proposal-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlashcardProposalCardComponent {
  @Input({required: true}) public card!: FlashCardModel;

  private readonly dialog = inject(MatDialog);
  private readonly flashcardsService = inject(FlashcardsService);
  private readonly notificationService = inject(NotificationService);

  public editFlashcard(): void {
    const dialogRef = this.dialog.open(EditFlashcardDialogComponent, {
      width: '400px',
      data: {...this.card}
    });

    dialogRef.afterClosed().subscribe((result: FlashCardModel | undefined) => {
        if (result) {
          Object.assign(this.card, result);
          if (result.isProposal) {
            this.flashcardsService.createFlashCardFromProposal(this.card).subscribe({
              next: updatedFields => {
                // Nałożenie tylko zmienionych pól na istniejącą kartę

                // Object.assign(this.card, updatedFields);
                this.notificationService.showSuccess('Flashcard został pomyślnie zaktualizowany.');
              },
              error: () => {
                this.notificationService.showError('Wystąpił błąd podczas aktualizacji flashcarda.');
              }
            });
          } else {
            this.flashcardsService.updateFlashcard(this.card).subscribe({
              next: updatedFields => {
                // Nałożenie tylko zmienionych pól na istniejącą kartę

                // Object.assign(this.card, updatedFields);
                this.notificationService.showSuccess('Flashcard został pomyślnie zaktualizowany.');
              },
              error: () => {
                this.notificationService.showError('Wystąpił błąd podczas aktualizacji flashcarda.');
              }
            });
          }


        }
      }
    );
  }
}
