const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;

//La Tchim
const participants = ["Théotim", "Antonin", "Noé", "Lého", "Guillaume O", "Lucas", "Inès", "Lalie", "Guillaume D"];

//Génération paires
function generatePairs(names) {
  const shuffled = [...names];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const pairs = {};
  for (let i = 0; i < shuffled.length; i++) {
    const j = (i === shuffled.length - 1) ? 0 : i + 1;
    pairs[shuffled[i]] = shuffled[j];
  }
  return pairs;
}

// Génération initiale au démarrage et sauvegarde dans pairs.json
let pairs = generatePairs(participants);
fs.writeFileSync('pairs.json', JSON.stringify({ pairs }, null, 2));
console.log("Paires initiales générées youpi");

//GET
app.get('/pairs', (req, res) => {
  const data = JSON.parse(fs.readFileSync('pairs.json', 'utf8'));
  res.json(data);
});

//Générer à nouveau le tirage (utiliser ssi problème)
app.post('/admin/shuffle', (req, res) => {
  const newParticipants = req.body.participants || participants;
  pairs = generatePairs(newParticipants);
  fs.writeFileSync('pairs.json', JSON.stringify({ pairs }, null, 2));
  res.json({ success: true, pairs });
});

app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
