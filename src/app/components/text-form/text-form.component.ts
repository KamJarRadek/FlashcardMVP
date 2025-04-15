import { Component } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { AiService } from '../../services/ai.service';
import {MatError, MatFormField, MatHint} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {FlashcardListComponent} from "../flashcard-list/flashcard-list.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-text-form',
  templateUrl: './text-form.component.html',
  styleUrls: ['./text-form.component.scss'],
  imports: [
    MatHint,
    MatError,
    MatFormField,
    FormsModule,
    MatInput,
    NgIf,
    ReactiveFormsModule,
    MatButton,
    FlashcardListComponent,
    MatProgressSpinner
  ],

  standalone: true
})
export class TextFormComponent {
  maxLength = 10000;
  textControl = new FormControl('', [Validators.required, Validators.maxLength(this.maxLength)]);
  flashcards: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private aiService: AiService) {}

  onSubmit() {
    if (this.textControl.invalid) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    const textInput = this.textControl.value;
    this.aiService.generateFlashcards(textInput|| '')
      .subscribe({
        next: (response: any) => {
          // Otrzymujemy mock dane i przypisujemy je do listy fiszek
          this.flashcards = response.flashcards;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Błąd API AI', error);
          this.errorMessage = 'Wystąpił błąd podczas komunikacji z API AI';
          this.isLoading = false;
        }
      });
  }
}
