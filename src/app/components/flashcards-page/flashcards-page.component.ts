import {Component, inject, OnInit} from '@angular/core';
import {FlashcardComponent} from "../flashcard/flashcard.component";
import {FlashcardsService} from "../../../services/flashcards.service";
import {AuthService} from "../../services/auth.service";

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
  private authService = inject(AuthService);
  cards = this.flashcardsService.flashcards;

  ngOnInit() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      console.log('userId', userId);
      this.flashcardsService.getUserFlashcards(userId).subscribe();
    }
  };
}
