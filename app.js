const express = require('express');
require('dotenv').config(); 
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// Connexion PostgreSQL via Render
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: { rejectUnauthorized: false }
});

//Tchim
const participants = [
  "Théotim", "Antonin", "Noé", "Lého", 
  "Guillaume O", "Lucas", "Inès", "Lalie", "Guillaume D"
];

//Paires aléatoires
function generatePairs(names) {
  const shuffled = [...names];
  //Meilleur shuffle de la vie
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const pairs = {};
  for (let i = 0; i < shuffled.length; i++) {
    const next = (i === shuffled.length - 1) ? shuffled[0] : shuffled[i + 1];
    pairs[shuffled[i]] = next;
  }
  return pairs;
}

// Initialisation : créer la table si elle n'existe pas
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pairs (
      participant TEXT PRIMARY KEY,
      target TEXT NOT NULL
    )
  `);

  const result = await pool.query('SELECT COUNT(*) FROM pairs');
  if (parseInt(result.rows[0].count) === 0) {
    const initialPairs = generatePairs(participants);
    for (const p of participants) {
      await pool.query(
        'INSERT INTO pairs(participant, target) VALUES($1, $2)',
        [p, initialPairs[p]]
      );
    }
    console.log("Paires initiales insérées dans la DB");
  } else {
    console.log("Paires existantes dans la DB, chargées");
  }
}

//Endpoint pour récupérer les paires
app.get('/pairs', async (req, res) => {
  try {
    const result = await pool.query('SELECT participant, target FROM pairs');
    const pairs = {};
    result.rows.forEach(row => pairs[row.participant] = row.target);
    res.json({ pairs });
  } catch (err) {
    console.error("Erreur récupération paires :", err);
    res.status(500).json({ error: "Impossible de récupérer les paires" });
  }
});

//Endpoint admin pour régénérer les paires
app.post('/admin/shuffle', async (req, res) => {
  try {
    const newPairs = generatePairs(participants);
    for (const p of participants) {
      await pool.query(
        'UPDATE pairs SET target = $1 WHERE participant = $2',
        [newPairs[p], p]
      );
    }
    console.log("Paires régénérées via /admin/shuffle");
    res.json({ success: true, pairs: newPairs });
  } catch (err) {
    console.error("Erreur shuffle :", err);
    res.status(500).json({ error: "Impossible de régénérer les paires" });
  }
});

//Démarrage du serveur
initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Serveur lancé sur port ${PORT}`));
  })
  .catch(err => console.error("Erreur DB :", err));
