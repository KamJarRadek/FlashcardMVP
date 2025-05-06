// const express    = require('express');
// const axios      = require('axios');
// // const cors       = require('cors');
// // const bodyParser = require('body-parser');
// const router = express.Router();
// // const { createClient } = require('@supabase/supabase-js');
// require('dotenv').config();
//
//
// const app = express();
// const PORT = 3000;

// app.use(cors({ origin: 'http://localhost:4200' }));
// app.use(bodyParser.json());

// router.post('/api/x', async (req, res) => {
//   const text = req.body.text; // maks. 10 000 znaków
//   try {
//     const response = await axios.post(
//       'http://host.docker.internal:11434/v1/completions',
//       {
//         model: 'tinyllama:1.1b',
//         prompt: `Z tekstu poniżej wygeneruj maksymalnie 20 fiszek w formacie JSON:\n\n${text}`,
//         max_tokens: 512
//       },
//       { headers: { 'Content-Type': 'application/json' } }
//     );
//     res.json(response.data.choices[0].text);
//   } catch (err) {
//     console.error('Błąd kommunacji z Ollama:', err.message);
//     res.status(500).json({ error: 'Błąd komunikacji z Ollama' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Backend działa na http://localhost:${PORT}`);
// });

// module.exports = router;
