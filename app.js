//App settings
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 3000;

//La Tchim
const participants = ["Théotim", "Antonin", "Noé", "Lého", "Guillaume O", "Lucas", "Inès", "Lalie", "Guillaume D"];

// 📌 Emplacement persistant sur Render
const DATA_FILE = path.join('/tmp', 'pairs.json');

//Génération paires
function generatePairs(names) {
  const shuffled = [...names];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const pairs = {};
  for (let i = 0; i < shuffled.length; i++) {
    let next = (i === shuffled.length - 1) ? shuffled[0] : shuffled[i + 1];
    pairs[shuffled[i]] = next;
  }
  return pairs;
}

// 🔥 Chargement ou création des paires (sans auto-regénération !)
let pairs = {};

if (fs.existsSync(DATA_FILE)) {
  console.log("pairs.json trouvé → chargement des paires existantes");
  pairs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')).pairs;
} else {
  console.log("pairs.json absent → génération initiale et création");
  pairs = generatePairs(participants);
  fs.writeFileSync(DATA_FILE, JSON.stringify({ pairs }, null, 2));
}

//GET - utilisé par le front
app.get('/pairs', (req, res) => {
  res.json({ pairs });
});

//ADMIN - régénérer les paires manuellement
app.post('/admin/shuffle', (req, res) => {
  const newParticipants = req.body.participants || participants;
  pairs = generatePairs(newParticipants);
  fs.writeFileSync(DATA_FILE, JSON.stringify({ pairs }, null, 2));
  console.log("Nouvelles paires générées via /admin/shuffle");
  res.json({ success: true, pairs });
});

app.listen(PORT, () => console.log(`Serveur lancé sur port ${PORT}`));
