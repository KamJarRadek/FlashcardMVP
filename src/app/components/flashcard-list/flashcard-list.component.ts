import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-flashcard-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './flashcard-list.component.html',
  styleUrls: ['./flashcard-list.component.scss']
})
export class FlashcardListComponent {
  @Input() flashcards: any[] = [];

  constructor(private databaseService: DatabaseService) {}

  onAction(flashcard: any, action: 'accepted' | 'rejected') {
    // Zapisujemy akcję w Supabase – dane nie będą edytowane w interfejsie\
    console.log('flashcard.definicja',flashcard.definicja)
    console.log('flashcard.concept',flashcard.concept)
    this.databaseService.saveFlashcardAction({
      definition: flashcard.definition,
      concept: flashcard.concept,
      action: action,
      timestamp: new Date().toISOString()
    }).subscribe({
      next: () => {
        console.log('Akcja zapisana:', action);
      },
      error: (error) => {
        console.error('Błąd zapisu w Supabase', error);
      }
    });
  }
}
