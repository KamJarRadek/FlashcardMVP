const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Konfiguracja klienta Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Endpoint do generowania propozycji fiszek
router.post('/generate-proposals', async (req, res) => {
  try {
    const { userId, text, maxCount } = req.body;

    if (!userId || !text) {
      return res.status(400).json({ message: 'Brakujące dane: userId lub text' });
    }

    // Generowanie fiszek (tu możnaby zaimplementować integrację z AI Service)
    // Dla przykładu, tworzymy proste propozycje na podstawie tekstu
    const words = text.split(/\s+/).filter(word => word.length > 3);
    const proposals = words.slice(0, maxCount || 5).map((word, index) => ({
      id: `prop_${index}`,
      front: word,
      back: `Definicja dla: ${word}`,
      confidence: Math.random() * 100
    }));

    // Zapisanie logu do bazy danych
    const { error } = await supabase
      .from('generation_logs')
      .insert({
        user_id: userId,
        text,
        proposal_count: proposals.length
      });

    if (error) {
      console.error('Błąd podczas zapisywania logu:', error);
      return res.status(500).json({ message: 'Błąd bazy danych', error: error.message });
    }

    // Zwrócenie wyników
    res.status(200).json({ proposals });
  } catch (error) {
    console.error('Błąd podczas generowania propozycji:', error);
    res.status(500).json({ message: 'Wystąpił błąd serwera', error: error.message });
  }
});

// Endpoint do pobierania fiszek użytkownika
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ message: 'Błąd bazy danych', error: error.message });
    }

    res.status(200).json({ flashcards: data });
  } catch (error) {
    console.error('Błąd podczas pobierania fiszek:', error);
    res.status(500).json({ message: 'Wystąpił błąd serwera', error: error.message });
  }
});

// Dodatkowe endpointy
// POST /api/flashcards - tworzenie nowej fiszki
router.post('/', async (req, res) => {
  try {
    const { userId, definition: definition, concept: concept, status,source } = req.body;

    if (!userId || !definition || !concept) {
      return res.status(400).json({ message: 'Brakujące dane: userId, front lub back' });
    }

    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        user_id: userId,
        definition: definition,
        concept: concept,
        status: status,
        source: source,
        created_at: new Date()
      })
      .select();

    if (error) {
      return res.status(500).json({ message: 'Błąd bazy danych', error: error.message });
    }

    res.status(201).json({ flashcard: data[0] });
  } catch (error) {
    console.error('Błąd podczas tworzenia fiszki:', error);
    res.status(500).json({ message: 'Wystąpił błąd serwera', error: error.message });
  }
});

module.exports = router;
