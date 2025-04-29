CREATE TABLE generation_logs (
                                 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                 user_id uuid NOT NULL, -- Referencja do auth.users będzie obsługiwana przez RLS
                                 proposal_count integer NOT NULL,
                                 text text NOT NULL,
                                 created_at timestamptz NOT NULL DEFAULT now()
);

-- Indeks na kolumnie user_id dla szybszych zapytań filtrowanych po użytkowniku
CREATE INDEX idx_generation_logs_user_id ON generation_logs(user_id);

-- Indeks na kolumnie created_at, który umożliwi szybkie wyszukiwanie logów w danym przedziale czasowym
CREATE INDEX idx_generation_logs_created_at ON generation_logs(created_at);

-- Włączenie Row Level Security dla tabeli
ALTER TABLE generation_logs ENABLE ROW LEVEL SECURITY;

-- Polityka RLS umożliwiająca użytkownikom dostęp tylko do swoich logów
CREATE POLICY generation_logs_user_policy
ON generation_logs
USING (user_id = auth.uid());

-- Polityka RLS umożliwiająca użytkownikom wstawianie tylko swoich logów
CREATE POLICY generation_logs_insert_policy
ON generation_logs
FOR INSERT
WITH CHECK (user_id = auth.uid());
