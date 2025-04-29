#!/bin/bash

# Skrypt do sprawdzania i inicjalizacji bazy danych
# Uruchomienie: ./startdb.sh

echo "Sprawdzanie konfiguracji Supabase..."

# Sprawdzenie czy plik .env istnieje
if [ ! -f .env ]; then
  echo "BŁĄD: Plik .env nie istnieje!"
  echo "Utwórz plik .env na podstawie .env.example i uzupełnij dane Supabase."
  exit 1
fi

# Pobranie zmiennych z pliku .env
source .env

# Sprawdzenie czy zmienne środowiskowe są ustawione
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "BŁĄD: Brak wymaganych zmiennych środowiskowych SUPABASE_URL lub SUPABASE_ANON_KEY w pliku .env"
  exit 1
fi

echo "Konfiguracja Supabase znaleziona."
echo "Inicjalizacja bazy danych..."

# Uruchomienie skryptu inicjalizacyjnego
node scripts/setup-db.js

# Sprawdzenie kodu wyjścia
if [ $? -eq 0 ]; then
  echo "Baza danych zainicjalizowana pomyślnie."
  echo "Uruchamianie serwera..."
  node server.js
else
  echo "BŁĄD: Inicjalizacja bazy danych nie powiodła się."
  echo "Sprawdź logi powyżej dla szczegółów."
  exit 1
fi
