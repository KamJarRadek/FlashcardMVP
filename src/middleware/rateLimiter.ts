import rateLimit from 'express-rate-limit';

export const flashcardsGenerateRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuta
  max: 100, // maksymalnie 100 żądań na minutę
  keyGenerator: (req, res) => {
    // Używamy identyfikatora użytkownika, o ile jest dostępny, w przeciwnym razie adres IP
    const userId = res.locals?.['user']?.id;
    return userId ? userId : req.ip;
  },
  handler: (req, res) => {
    return res.status(429).json({
      error: 'Przekroczono limit wywołań. Spróbuj ponownie później.'
    });
  }
});
