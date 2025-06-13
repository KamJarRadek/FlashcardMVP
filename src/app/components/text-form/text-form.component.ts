import { Component } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { AiService } from '../../services/ai.service';
import {MatError, MatFormField, MatHint} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {FlashcardListComponent} from "../flashcard-list/flashcard-list.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import { Router } from '@angular/router';
import {ProposalService} from "../../services/proposal.service";

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

  constructor(private aiService: AiService, private router: Router, private proposalService: ProposalService) {}

  onSubmit() {
    if (this.textControl.invalid) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;

    this.aiService.generateFlashcards(this.textControl.value || '').subscribe({
      next: (response) => {
        const proposals = (response.proposals || []).map((proposal: any) => ({
          concept: proposal.front,
          definition: proposal.back,
          isProposal: true
        })); // Przepakowanie danych z oznaczeniem isProposal
        this.isLoading = false;
        this.proposalService.setProposals(proposals);
      },
      error: (error) => {
        this.errorMessage = 'Wystąpił błąd podczas generowania fiszek.';
        console.error(error);
        this.isLoading = false;
      }
    });
  }
}
