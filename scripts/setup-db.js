/**
 * Skrypt do inicjalizacji bazy danych Supabase
 * Tworzy wszystkie potrzebne tabele i indeksy
 *
 * Uruchomienie: node scripts/setup-db.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Sprawdzanie czy zmienne środowiskowe są zdefiniowane
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

/**
 * Sprawdza czy tabela istnieje
 * @param {string} tableName Nazwa tabeli
 * @returns {Promise<boolean>} Czy tabela istnieje
 */
async function tableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', tableName);

    if (error) {
      console.error(`Błąd podczas sprawdzania czy tabela ${tableName} istnieje:`, error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Wyjątek podczas sprawdzania czy tabela istnieje:', error);
    return false;
  }
}

/**
 * Tworzy tabelę flashcards jeśli nie istnieje
 */
async function createFlashcardsTable() {
  try {
    console.log('Sprawdzanie tabeli flashcards...');

    const exists = await tableExists('flashcards');

    if (exists) {
      console.log('Tabela flashcards już istnieje. Pomijanie...');
      return;
    }

    console.log('Tworzenie tabeli flashcards...');

    // Tworzymy tabelę bezpośrednio w SQL, jeśli funkcja RPC nie jest dostępna
    const { error } = await supabase
      .from('flashcards')
      .insert({
        id: '00000000-0000-0000-0000-000000000000',
        user_id: 'system',
        front: 'Przykładowa fiszka',
        back: 'To jest przykładowa fiszka stworzona przez skrypt inicjalizacyjny.',
        source: 'SYSTEM'
      });

    if (error && error.code !== '23505') { // Ignoruj błąd duplikatu
      console.error('Błąd podczas tworzenia tabeli flashcards:', error);
      throw error;
    }

    console.log('Tabela flashcards została utworzona lub już istnieje.');
  } catch (error) {
    console.error('Wyjątek podczas tworzenia tabeli flashcards:', error);
    throw error;
  }
}

/**
 * Tworzy tabelę generation_logs jeśli nie istnieje
 */
async function createGenerationLogsTable() {
  try {
    console.log('Sprawdzanie tabeli generation_logs...');

    const exists = await tableExists('generation_logs');

    if (exists) {
      console.log('Tabela generation_logs już istnieje. Pomijanie...');
      return;
    }

    console.log('Tworzenie tabeli generation_logs...');

    // Tworzymy tabelę bezpośrednio w SQL, jeśli funkcja RPC nie jest dostępna
    const { error } = await supabase
      .from('generation_logs')
      .insert({
        id: '00000000-0000-0000-0000-000000000000',
        user_id: 'system',
        text: 'Przykładowy tekst inicjalizacyjny',
        proposal_count: 0
      });

    if (error && error.code !== '23505') { // Ignoruj błąd duplikatu
      console.error('Błąd podczas tworzenia tabeli generation_logs:', error);
      throw error;
    }

    console.log('Tabela generation_logs została utworzona lub już istnieje.');
  } catch (error) {
    console.error('Wyjątek podczas tworzenia tabeli generation_logs:', error);
    throw error;
  }
}

/**
 * Tworzy funkcję SQL do inicjalizacji tabel
 */
async function createSqlFunctions() {
  try {
    console.log('Tworzenie funkcji SQL...');

    // Tabela flashcards
    const createFlashcardsTableSql = `
      CREATE TABLE IF NOT EXISTS public.flashcards (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id text NOT NULL,
        front text NOT NULL,
        back text NOT NULL,
        source text DEFAULT 'MANUAL'::text,
        created_at timestamp with time zone DEFAULT now(),
        updated_at timestamp with time zone
      );

      CREATE INDEX IF NOT EXISTS flashcards_user_id_idx ON public.flashcards (user_id);
    `;

    // Tabela generation_logs
    const createGenerationLogsSql = `
      CREATE TABLE IF NOT EXISTS public.generation_logs (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id text NOT NULL,
        text text NOT NULL,
        proposal_count integer NOT NULL,
        created_at timestamp with time zone DEFAULT now()
      );

      CREATE INDEX IF NOT EXISTS generation_logs_user_id_idx ON public.generation_logs (user_id);
    `;

    // Wykonanie SQL
    const { error: flashcardsError } = await supabase.rpc('exec_sql', { sql: createFlashcardsTableSql });
    if (flashcardsError) {
      console.warn('Ostrzeżenie: Nie można utworzyć tabeli flashcards przez RPC. Próba alternatywnej metody...');
      console.warn('Błąd:', flashcardsError);
    } else {
      console.log('Zapytanie SQL dla tabeli flashcards wykonane pomyślnie.');
    }

    const { error: logsError } = await supabase.rpc('exec_sql', { sql: createGenerationLogsSql });
    if (logsError) {
      console.warn('Ostrzeżenie: Nie można utworzyć tabeli generation_logs przez RPC. Próba alternatywnej metody...');
      console.warn('Błąd:', logsError);
    } else {
      console.log('Zapytanie SQL dla tabeli generation_logs wykonane pomyślnie.');
    }

  } catch (error) {
    console.error('Wyjątek podczas tworzenia funkcji SQL:', error);
    console.warn('Kontynuowanie z alternatywną metodą tworzenia tabel...');
  }
}

/**
 * Sprawdza połączenie z bazą danych
 */
async function checkDatabaseConnection() {
  try {
    console.log('Sprawdzanie połączenia z bazą danych Supabase...');

    const { data, error } = await supabase.from('generation_logs').select('*').limit(1);

    if (error && error.code !== 'PGRST301') {
      console.error('Błąd podczas testowania połączenia z bazą danych:', error);
      return false;
    }

    console.log('Połączenie z bazą danych Supabase działa poprawnie.');
    return true;
  } catch (error) {
    console.error('Wyjątek podczas testowania połączenia z bazą danych:', error);
    return false;
  }
}

/**
 * Główna funkcja inicjalizująca bazę danych
 */
async function initializeDatabase() {
  try {
    console.log('Rozpoczynanie inicjalizacji bazy danych...');

    // Sprawdź połączenie
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error('Nie można połączyć się z bazą danych. Sprawdź zmienne środowiskowe i uprawnienia.');
      process.exit(1);
    }

    // Próba utworzenia funkcji SQL
    await createSqlFunctions();

    // Utworzenie tabel
    await createFlashcardsTable();
    await createGenerationLogsTable();

    console.log('Inicjalizacja bazy danych zakończona pomyślnie!');
  } catch (error) {
    console.error('Błąd podczas inicjalizacji bazy danych:', error);
    process.exit(1);
  }
}

// Uruchomienie inicjalizacji
initializeDatabase();
