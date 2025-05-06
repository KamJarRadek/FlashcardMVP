const express = require('express');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import konfiguracji bazy danych
testConnection = require('./server/config/database').testConnection;
// Import routerów API
const flashcardRoutes = require('./server/routes/flashcard.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Konfiguracja limitera zapytań
testConnection;
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 100, // limit każdego IP do 100 zapytań na "okno"
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
env: cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api', apiLimiter);

// Statyczne pliki (produkcyjne i deweloperskie)
app.use(express.static(path.join(__dirname, 'dist/flashcard-mvp')));

// Endpointy API
app.use('/api/flashcards', flashcardRoutes);

// Endpoint statusu serwera
app.get('/api/health', (req, res) => {
  res.status(200).json({status: 'ok', message: 'Serwer działa poprawnie'});
});

// Wszystkie pozostałe zapytania obsługuje aplikacja Angular
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/flashcard-mvp', 'index.html'));
});

// Obsługa błędów auth Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({message: 'Wystąpił błąd na serwerze', error: err.message});
});

// Uruchomienie serwera po weryfikacji połączenia z bazą danych
async function startServer() {
  try {
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

