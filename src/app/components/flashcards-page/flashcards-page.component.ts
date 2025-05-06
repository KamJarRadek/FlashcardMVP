import {Component, inject, OnInit} from '@angular/core';
import {FlashcardComponent} from "../flashcard/flashcard.component";
import {FlashcardsService} from "../../../services/flashcards.service";

@Component({
  selector: 'app-flashcards-page',
  standalone: true,
  imports: [
    FlashcardComponent
  ],
  templateUrl: './flashcards-page.component.html',
  styleUrl: './flashcards-page.component.scss'
})
export class FlashcardsPageComponent implements OnInit {
  private flashcardsService = inject(FlashcardsService);

  cards = this.flashcardsService.flashcards;

  ngOnInit() {
    this.flashcardsService.getUserFlashcards('0709491b-c441-4924-bcf5-892a26bb998e')
      .subscribe();
  };
}
