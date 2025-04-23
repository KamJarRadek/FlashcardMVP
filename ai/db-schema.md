1. Tables

1.1. users  
This table is managed by Supabase Auth.

id: UUID PRIMARY KEY  
email: VARCHAR(255) NOT NULL UNIQUE  
encrypted_password: VARCHAR NOT NULL  
created_at: TIMESTAMPTZ NOT NULL DEFAULT now()  
confirmed_at: TIMESTAMPTZ

1.2. flashcards

id: UUID PRIMARY KEY DEFAULT gen_random_uuid()  
user_id: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE  
definition: TEXT NOT NULL  
concept: TEXT NOT NULL  
status: VARCHAR(20) NOT NULL CHECK (status IN ('accepted', 'rejected'))  
source: VARCHAR(20) NOT NULL CHECK (source IN ('AI', 'manual'))  
created_at: TIMESTAMPTZ NOT NULL DEFAULT now()  
updated_at: TIMESTAMPTZ NOT NULL DEFAULT now()
duration: INTERVAL NOT NULL DEFAULT '0 seconds'

2. Indexes

CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);  
CREATE INDEX idx_flashcards_status ON flashcards(status);  
CREATE INDEX idx_flashcards_source ON flashcards(source);

3. PostgreSQL Policies

ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY flashcards_owner_policy ON flashcards  
USING (user_id = current_setting('jwt.claims.user_id')::UUID);

CREATE OR REPLACE FUNCTION update_updated_at_column()  
RETURNS TRIGGER AS $$  
BEGIN  
NEW.updated_at = NOW();  
RETURN NEW;  
END;  
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_flashcards_updated_at  
BEFORE UPDATE ON flashcards  
FOR EACH ROW  
EXECUTE FUNCTION update_updated_at_column();  
