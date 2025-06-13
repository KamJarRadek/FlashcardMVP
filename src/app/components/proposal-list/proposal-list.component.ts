import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {FlashcardsService} from '../../../services/flashcards.service';
import {MatDialog} from '@angular/material/dialog';
import {AddFlashcardDialogComponent} from '../add-flashcard-dialog/add-flashcard-dialog.component';
import {NotificationService} from '../../../services/notification.service';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {FlashcardProposalCardComponent} from '../flashcard-proposal-card/flashcard-proposal-card.component';
import {AuthService} from "../../services/auth.service";
import {Router} from '@angular/router';
import {FlashCardModel} from '../model/flash-card.model';
import {ProposalService} from "../../services/proposal.service";
import {Observable} from 'rxjs';

@Component({
  selector: 'app-proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, FlashcardProposalCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProposalListComponent implements OnInit {
  private readonly flashcardsService = inject(FlashcardsService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);
  cards = this.flashcardsService.flashcards;

  proposals$: Observable<FlashCardModel[]>; // Strumień propozycji

  constructor(private router: Router, private proposalService: ProposalService) {
    this.proposals$ = this.proposalService.proposals$; // Subskrypcja strumienia propozycji
  }

  public ngOnInit(): void {
    this.loadFlashcards()
  }

  public loadFlashcards(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.flashcardsService.getUserFlashcards(userId).subscribe();
    }
    // this.flashcardsService.getUserFlashcards('0709491b-c441-4924-bcf5-892a26bb998e').subscribe();
  }

  public addFlashcard(): void {
    const dialogRef = this.dialog.open(AddFlashcardDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result: Partial<FlashCardModel> | undefined) => {
      if (result) {
        const requiredObjectType: FlashCardModel = {
          id: 1,
          user_id: this.authService.getCurrentUser()?.id || '',
          concept: result.concept || '',
          definition: result.definition || '',
          status: 'accepted',
          source: 'manual'
        };
        this.flashcardsService.createFlashcard(requiredObjectType).subscribe({
          next: () => {
            this.notificationService.showSuccess('Flashcard został pomyślnie dodany.');
          },
          error: (err) => {
            console.log('error', err);
            this.notificationService.showError('Wystąpił błąd podczas dodawania flashcarda.');
          }
        });
      }
    });
  }

  saveAsFlashcard(proposal: any): void {
    this.proposalService.saveProposalAsFlashcard(proposal).subscribe({
      next: () => this.notificationService.showSuccess('Propozycja została zapisana jako Flashcard!'),
      error: (err) => this.notificationService.showError('Wystąpił błąd podczas zapisywania: ' + err.message)
    });
  }
}
