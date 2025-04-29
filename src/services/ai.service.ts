import { FlashcardProposalDto } from '../models/flashcard.dto';

export class AIService {
  /**
   * Generuje propozycje fiszek na podstawie dostarczonego tekstu
   * @param text Tekst wejściowy
   * @param maxCount Maksymalna liczba propozycji do wygenerowania
   * @returns Promise z tablicą propozycji fiszek
   */
  static async generate(
    text: string,
    maxCount: number
  ): Promise<FlashcardProposalDto[]> {
    try {
      // Tutaj byłaby faktyczna integracja z modelem AI (np. Ollamama)
      // W celach demonstracyjnych zwracamy mocowane dane

      // Symulacja opóźnienia odpowiedzi z API AI
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Symulacja odpowiedzi z AI - w rzeczywistej implementacji tutaj byłoby wywołanie API
      const mockProposals: FlashcardProposalDto[] = [];

      // Generujemy przykładowe propozycje fiszek (maksymalnie maxCount)
      const actualCount = Math.min(maxCount, 5); // Dla uproszczenia generujemy max 5 propozycji

      for (let i = 0; i < actualCount; i++) {
        mockProposals.push({
          definition: `Definicja wygenerowana z tekstu #${i + 1}`,
          concept: `Pojęcie #${i + 1} pochodzące z tekstu`
        });
      }

      return mockProposals;
    } catch (error) {
      console.error('[AIService] Błąd podczas generowania propozycji:', error);
      throw new Error('Nie udało się wygenerować propozycji fiszek');
    }
  }
}
