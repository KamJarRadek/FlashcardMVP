const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Sprawdzenie, czy zmienne środowiskowe są zdefiniowane
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('BŁĄD: Brak wymaganych zmiennych środowiskowych SUPABASE_URL lub SUPABASE_ANON_KEY');
  console.error('Utwórz plik .env w głównym katalogu projektu i dodaj wymagane zmienne.');
  process.exit(1);
}

// Inicjalizacja klienta Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Testowanie połączenia z bazą danych
async function testConnection() {
  try {
    const { data, error } = await supabase.from('flashcards').select('count', { count: 'exact' }).limit(1);

    if (error) {
      console.error('Błąd podczas testowania połączenia z Supabase:', error);
      return false;
    }

    console.log('Połączenie z Supabase ustanowione pomyślnie');
    return true;
  } catch (error) {
    console.error('Wyjątek podczas testowania połączenia z Supabase:', error);
    return false;
  }
}

module.exports = {
  supabase,
  testConnection
};
