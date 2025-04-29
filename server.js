const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import konfiguracji bazy danych
const { testConnection } = require('./server/config/database');

// Inicjalizacja Express
const app = express();
const PORT = process.env.PORT || 3000;

// Konfiguracja limitera zapytań
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 100, // limit każdego IP do 100 zapytań na "okno"
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Zastosuj limit zapytań do wszystkich endpointów API
app.use('/api', apiLimiter);

// Import routerów API
const flashcardRouter = require('./server/routes/flashcard.routes');

// Użycie routerów
app.use('/api/flashcards', flashcardRouter);

// Dodanie endpointu do sprawdzania statusu
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Serwer działa poprawnie' });
});

// Serwowanie plików statycznych w produkcji
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist/flashcard-mvp')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/flashcard-mvp', 'index.html'));
  });
}

// Obsługa błędów
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Wystąpił błąd na serwerze', error: err.message });
});

// Uruchomienie serwera
async function startServer() {
  try {
    // Testowanie połączenia z bazą danych przed uruchomieniem serwera
    const connectionSuccess = await testConnection();

    if (!connectionSuccess) {
      console.warn('Ostrzeżenie: Nie można ustanowić połączenia z bazą danych Supabase.');
      console.warn('Serwer będzie uruchomiony, ale funkcje wymagające bazy danych mogą nie działać.');
    }

    app.listen(PORT, () => {
      console.log(`Serwer działa na porcie ${PORT}`);
      console.log(`Adres health check: http://localhost:${PORT}/api/health`);
      console.log(`Tryb: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Błąd podczas uruchamiania serwera:', error);
    process.exit(1);
  }
}

startServer();
