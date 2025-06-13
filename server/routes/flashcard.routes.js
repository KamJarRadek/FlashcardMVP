import OpenAI from "openai";
import express from 'express';
import {createClient} from '@supabase/supabase-js';
import dotenv from 'dotenv';

// const axios = require('axios');
// const cors       = require('cors');
// const bodyParser = require('body-parser');

dotenv.config();

const router = express.Router();

// Konfiguracja klienta Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Endpoint do generowania propozycji fiszek
router.post('/generate-proposals', async (req, res) => {
  try {
    const {userId, text, maxCount} = req.body;

    if (!userId || !text) {
      return res.status(400).json({message: 'Brakujące dane: userId lub text'});
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
    const {error} = await supabase
      .from('generation_logs')
      .insert({
        user_id: userId,
        text,
        proposal_count: proposals.length
      });

    if (error) {
      console.error('Błąd podczas zapisywania logu:', error);
      return res.status(500).json({message: 'Błąd bazy danych', error: error.message});
    }

    // Zwrócenie wyników
    res.status(200).json({proposals});
  } catch (error) {
    console.error('Błąd podczas generowania propozycji:', error);
    res.status(500).json({message: 'Wystąpił błąd serwera', error: error.message});
  }
});

// Endpoint do pobierania fiszek użytkownika
router.get('/user/:userId', async (req, res) => {
  try {
    const {userId} = req.params;

    const {data, error} = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({message: 'Błąd bazy danych', error: error.message});
    }

    res.status(200).json({flashcards: data});
  } catch (error) {
    console.error('Błąd podczas pobierania fiszek:', error);
    res.status(500).json({message: 'Wystąpił błąd serwera', error: error.message});
  }
});

// Dodatkowe endpointy
// POST /api/flashcards - tworzenie nowej fiszki
router.post('/', async (req, res) => {
  try {
    console.log('data:', req.body);
    const {user_id, definition, concept, status, source} = req.body;
    console.log('userId:', user_id);
    console.log('definition:', definition);
    console.log('concept:', concept);
    if (!user_id || !definition || !concept) {
      return res.status(400).json({message: 'Brakujące dane: userId, front lub back'});
    }

    const {data, error} = await supabase
      .from('flashcards')
      .insert({
        user_id: user_id,
        definition: definition,
        concept: concept,
        status: status,
        source: source,
        created_at: new Date()
      })
      .select();

    if (error) {
      return res.status(500).json({message: 'Błąd bazy danych', error: error.message});
    }

    res.status(201).json({flashcard: data[0]});
  } catch (error) {
    console.error('Błąd podczas tworzenia fiszki:', error);
    res.status(500).json({message: 'Wystąpił błąd serwera', error: error.message});
  }
});

// Endpoint do edycji istniejącej fiszki
// PUT /api/flashcards/:id
router.put('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const {userId, definition, concept, status, source} = req.body;

    // Minimum: musimy wiedzieć, który user i który rekord edytujemy
    if (!userId) {
      return res.status(400).json({message: 'Brakujące dane: userId'});
    }
    // Sprawdźmy, czy przynajmniej jedno pole do aktualizacji zostało przekazane
    const updates = {};
    if (definition !== undefined) updates.definition = definition;
    if (concept !== undefined) updates.concept = concept;
    if (status !== undefined) updates.status = status;
    if (source !== undefined) updates.source = source;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({message: 'Brak pól do aktualizacji'});
    }

    // Wykonaj aktualizację w bazie
    const {data, error} = await supabase
      .from('flashcards')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)      // dodatkowe zabezpieczenie: user może edytować tylko swoje fiszki
      .select();

    if (error) {
      console.error('Błąd podczas aktualizacji fiszki:', error);
      return res.status(500).json({message: 'Błąd bazy danych', error: error.message});
    }

    if (!data || data.length === 0) {
      // albo nie istnieje fiszka o podanym id, albo nie należy do usera
      return res.status(404).json({message: 'Nie znaleziono fiszki do aktualizacji'});
    }

    // Zwracamy zaktualizowany rekord
    res.status(200).json({flashcard: data[0]});

  } catch (error) {
    console.error('Błąd serwera podczas aktualizacji fiszki:', error);
    res.status(500).json({message: 'Wystąpił błąd serwera', error: error.message});
  }
});


router.post('/generate-proposals-test', async (req, res) => {
  try {
    const {text} = req.body; // maks. 10 000 znaków
    if (!text) {
      return res.status(400).json({message: 'Brakujący parametr: text'});
    }

    // const openaiService = new OpenAIService();
    const prompt = `Z tekstu poniżej wygeneruj maksymalnie 20 fiszek w formacie JSON:\n\n${text}`;
    const messages = [{role: 'user', content: prompt}];

    const response = await completion(messages, "gpt-4", false);
    const result = response.choices[0].message.content;

    // Parsowanie odpowiedzi, jeśli jest w formacie JSON
    try {
      const parsedResult = JSON.parse(result);
      res.status(200).json({proposals: parsedResult});
    } catch (parseError) {
      console.warn('Nie udało się sparsować odpowiedzi jako JSON:', parseError.message);
      res.status(200).json({rawResponse: result});
    }
  } catch (err) {
    console.error('Błąd komunikacji z OpenAI:', err.message);
    res.status(500).json({error: 'Błąd komunikacji z OpenAI', details: err.message});
  }
});

export async function completion(
  messages,
  model = "gpt-4o-mini",
  stream = false
) {
  const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
  });
  try {
    console.log('🔍 Prompt debug (OpenAI):');
    messages.forEach((m) => {
      console.log(`> ${m.role.toUpperCase()}: ${m.content}`);
    });

    return await openai.chat.completions.create({
      messages,
      model,
      stream,
    });
  } catch (error) {
    console.error("❌ Błąd w OpenAI completion:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || error.message || 'Nieznany błąd');
  }
}

export default router;
