import { createClient } from '@supabase/supabase-js';
import { AIService } from './ai.service';
import {
  GenerateFlashcardProposalsCommand,
  GenerateProposalsResponseDto,
  FlashcardProposalDto
} from '../models/flashcard.dto';
import { environment } from '../environments/environment';

export class FlashcardService {
  private static supabase = createClient(
    environment.supabaseUrl,
    environment.supabaseAnonKey
  );

  /**
   * Generuje propozycje fiszek i zapisuje log operacji
   * @param command Obiekt zawierający dane potrzebne do generowania propozycji
   * @returns Promise z obiektem zawierającym propozycje fiszek
   */
  static async generateProposals(
    command: GenerateFlashcardProposalsCommand
  ): Promise<GenerateProposalsResponseDto> {
    try {
      // 1. Wywołanie AIService do generowania propozycji
      const proposals = await AIService.generate(command.text, command.maxCount);

      // 2. Zapis logu generacji do bazy danych
      await this.logGeneration(
        command.userId,
        command.text,
        proposals.length
      );

      // 3. Zwrócenie odpowiedzi
      return {
        proposals
      };
    } catch (error) {
      console.error('[FlashcardService] Błąd podczas generowania propozycji:', error);
      throw error;
    }
  }

  /**
   * Zapisuje log operacji generowania propozycji
   * @param userId ID użytkownika
   * @param text Tekst wejściowy
   * @param proposalCount Liczba wygenerowanych propozycji
   */
  private static async logGeneration(
    userId: string,
    text: string,
    proposalCount: number
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('generation_logs')
        .insert({
          user_id: userId,
          text,
          proposal_count: proposalCount
        });

      if (error) {
        console.error('[FlashcardService] Błąd podczas zapisywania logu:', error);
        throw error;
      }
    } catch (error) {
      console.error('[FlashcardService] Błąd podczas zapisywania logu:', error);
      throw new Error('Nie udało się zapisać logu generacji');
    }
  }
}
