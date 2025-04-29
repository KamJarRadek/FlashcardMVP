-- Tworzenie tabeli flashcards dla przechowywania fiszek użytkowników
CREATE TABLE flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, -- Referencja do auth.users będzie obsługiwana przez RLS
  definition text NOT NULL,
  concept text NOT NULL,
  status varchar(20) NOT NULL CHECK (status IN ('accepted', 'rejected')),
  source varchar(20) NOT NULL CHECK (source IN ('AI', 'manual')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indeksy dla szybszego wyszukiwania
CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX idx_flashcards_status ON flashcards(status);
CREATE INDEX idx_flashcards_source ON flashcards(source);

-- Funkcja do automatycznej aktualizacji pola updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger dla automatycznej aktualizacji pola updated_at
CREATE TRIGGER update_flashcards_updated_at
BEFORE UPDATE ON flashcards
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Włączenie Row Level Security dla tabeli flashcards
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Polityka RLS umożliwiająca użytkownikom dostęp tylko do swoich fiszek
CREATE POLICY flashcards_user_policy
ON flashcards
USING (user_id = auth.uid());

-- Polityka RLS umożliwiająca użytkownikom wstawianie tylko swoich fiszek
CREATE POLICY flashcards_insert_policy
ON flashcards
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Polityka RLS umożliwiająca użytkownikom aktualizowanie tylko swoich fiszek
CREATE POLICY flashcards_update_policy
ON flashcards
FOR UPDATE
USING (user_id = auth.uid());

-- Polityka RLS umożliwiająca użytkownikom usuwanie tylko swoich fiszek
CREATE POLICY flashcards_delete_policy
ON flashcards
FOR DELETE
USING (user_id = auth.uid());
