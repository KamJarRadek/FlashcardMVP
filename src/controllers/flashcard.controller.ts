import { Router, Request, Response } from 'express';
import { FlashcardService } from '../services/flashcard.service';
import { GenerateProposalsRequestDto } from '../models/flashcard.dto';
import { flashcardsGenerateRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post(
  '/flashcards/generate',
  flashcardsGenerateRateLimiter,
  async (req: Request, res: Response) => {
    // Zakładamy, że middleware autoryzacyjne Supabase ustawia użytkownika w res.locals.user
    const userId: string | undefined = res.locals?.['user']?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Użytkownik nieautoryzowany' });
    }

    const { text, maxCount } = req.body as GenerateProposalsRequestDto;

    // Walidacja danych wejściowych
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Pole "text" jest wymagane.' });
    }
    if (text.length > 10000) {
      return res
        .status(400)
        .json({ error: 'Pole "text" nie może przekraczać 10 000 znaków.' });
    }
    if (typeof maxCount !== 'number' || maxCount < 1 || maxCount > 20) {
      return res.status(400).json({
        error: 'Pole "maxCount" musi być liczbą w zakresie od 1 do 20.'
      });
    }

    try {
      const response = await FlashcardService.generateProposals({
        userId,
        text,
        maxCount
      });
      return res.status(200).json(response);
    } catch (error) {
      console.error(
        '[FlashcardController] Błąd podczas generowania propozycji:',
        error
      );
      return res
        .status(500)
        .json({ error: 'Nie udało się wygenerować propozycji fiszek.' });
    }
  }
);

export default router;
