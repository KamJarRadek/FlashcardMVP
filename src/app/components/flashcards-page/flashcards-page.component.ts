import { Component } from '@angular/core';
import {FlashcardComponent} from "../flashcard/flashcard.component";

@Component({
  selector: 'app-flashcards-page',
  standalone: true,
  imports: [
    FlashcardComponent
  ],
  templateUrl: './flashcards-page.component.html',
  styleUrl: './flashcards-page.component.scss'
})
export class FlashcardsPageComponent {

}
