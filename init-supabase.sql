-- Skrypt SQL do ręcznej inicjalizacji bazy danych Supabase
-- Można go uruchomić w konsoli SQL Supabase

-- Tabela flashcards
CREATE TABLE public.flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  source TEXT DEFAULT 'MANUAL',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Indeks na user_id w tabeli flashcards dla szybszego wyszukiwania
CREATE INDEX flashcards_user_id_idx ON public.flashcards (user_id);

-- Tabela dla logów generacji fiszek
CREATE TABLE public.generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  text TEXT NOT NULL,
  proposal_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indeks na user_id w tabeli generation_logs dla szybszego wyszukiwania
CREATE INDEX generation_logs_user_id_idx ON public.generation_logs (user_id);

-- Funkcje pomocnicze (opcjonalne)

-- Funkcja do tworzenia tabeli flashcards
CREATE OR REPLACE FUNCTION create_flashcards_table()
RETURNS void AS
$$
BEGIN
  CREATE TABLE IF NOT EXISTS public.flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    source TEXT DEFAULT 'MANUAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE
  );

  CREATE INDEX IF NOT EXISTS flashcards_user_id_idx ON public.flashcards (user_id);

  EXCEPTION WHEN others THEN
    RAISE NOTICE 'Błąd podczas tworzenia tabeli flashcards: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Funkcja do tworzenia tabeli generation_logs
CREATE OR REPLACE FUNCTION create_generation_logs_table()
RETURNS void AS
$$
BEGIN
  CREATE TABLE IF NOT EXISTS public.generation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    text TEXT NOT NULL,
    proposal_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS generation_logs_user_id_idx ON public.generation_logs (user_id);

  EXCEPTION WHEN others THEN
    RAISE NOTICE 'Błąd podczas tworzenia tabeli generation_logs: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Funkcja do wykonywania dowolnego SQL
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void AS
$$
BEGIN
  EXECUTE sql;

  EXCEPTION WHEN others THEN
    RAISE NOTICE 'Błąd podczas wykonywania SQL: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Przykładowe dane testowe

-- Wstawienie przykładowych fiszek
INSERT INTO public.flashcards (user_id, front, back, source, created_at)
VALUES
  ('temp-user-id', 'Algorytm', 'Skończony ciąg instrukcji realizujących określone zadanie', 'MANUAL', now()),
  ('temp-user-id', 'Rekurencja', 'Proces polegający na wywoływaniu funkcji przez samą siebie', 'AI', now()),
  ('temp-user-id', 'TypeScript', 'Typowany nadzbiór JavaScript opracowany przez Microsoft', 'AI', now()),
  ('temp-user-id', 'Angular', 'Framework do tworzenia aplikacji webowych opracowany przez Google', 'MANUAL', now());

-- Wstawienie przykładowych logów generacji
INSERT INTO public.generation_logs (user_id, text, proposal_count, created_at)
VALUES
  ('temp-user-id', 'Rekurencja to proces polegający na wywoływaniu funkcji przez samą siebie.', 3, now()),
  ('temp-user-id', 'TypeScript jest typowanym nadzbiorem języka JavaScript opracowanym przez Microsoft.', 2, now());

-- Ustawienie uprawnień
GRANT SELECT, INSERT, UPDATE, DELETE ON public.flashcards TO anon, authenticated;
GRANT SELECT, INSERT ON public.generation_logs TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
