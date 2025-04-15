import {ChangeDetectionStrategy, Component, Input, signal} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlashcardComponent {
  @Input() question!: string;
  @Input() answer!: string;
  private showAnswerSignal = signal(false);

  showAnswer = this.showAnswerSignal.asReadonly();

  toggleAnswer() {
    this.showAnswerSignal.set(!this.showAnswerSignal());
  }
}
