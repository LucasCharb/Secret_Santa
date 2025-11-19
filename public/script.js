//Sons de con
const clickSound = new Audio('sons/countryDuTexas.mp3');

//préloads
const endSound = new Audio('sons/fin.mp3');
clickSound.preload = "auto";
clickSound.load();


const imagesToPreload = [
  "images/cat1.jpg",
  "images/cat2.gif",
  "images/cat3.jpg",
  "images/Théotim.jpg",
  "images/Antonin.jpg",
  "images/Noé.jpg",
  "images/Lého.jpg",
  "images/Guillaume O.jpg",
  "images/Guillaume D.jpg",
  "images/Lucas.jpg",
  "images/Lalie.jpg",
  "images/Inès.jpg"
];

//Fct préload
function preloadImages(imagePaths) {
  return Promise.all(
    imagePaths.map(src => {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve({ src, status: "ok" });
        img.onerror = () => resolve({ src, status: "error" });
        img.src = src;
      });
    })
  );
}

//On lance le préload dès le chargement du site
preloadImages(imagesToPreload).then(results => {
  console.log("Toutes les images sont préchargées :", results);
  window.imagesReady = true;
});

//La tchim
const participants = ["Théotim", "Antonin", "Noé", "Lého", "Guillaume O", "Lucas", "Inès", "Lalie", "Guillaume D"];

const messagesPerso = {
  "Théotim": "Choisis sagement son cadeau, mais petite indication : il n'a pas besoin de peigne ni de gel...",
  "Antonin": "J'espère que ton cadeau lui plaira sinon gare à toi, son coup de front fait des ravages",
  "Noé": "Offre lui un joli cadeau il le mérite, regarde comme il est beau avec ses tresses (il pense ressembler à Gazo mais il ressemble à M2LT)",
  "Lého": "Il a déjà eu la chance de rencontrer Chap dans la vraie vie !!!!! J'espère que ton cadeau saura lui procurer autant de bonheur",
  "Guillaume O": "Regarde comme il est séduisant, à ta place je choisirais attentivement son cadeau pour avoir une chance avec lui",
  "Lucas": "Choisis bien son cadeau ou tu devras affronter son regard...",
  "Inès": "Regarde ce grand sourire, j'espère que ton cadeau saura lui procurer autant d'émotions",
  "Lalie": "Mdr tu dois offrir un cadeau à Sid de l'âge de glace ou quoi ? Je crois qu'il aime bien les pissenlits dans le film",
  "Guillaume D": "J'espère que ton cadeau saura autant le décoiffer que ce jour là, (il se pensait séduisant, il ressemble juste à Sonic)"
};


//Lien backend frontend
let pairs = {};
fetch('/pairs')
  .then(res => res.json())
  .then(data => {
    pairs = data.pairs;
  });

  
//Confettis de con
function crazyConfetti() {
  const duration = 1000; // 3 secondes de folie
  const end = Date.now() + duration;

  (function frame() {
    // explosion de confettis à chaque frame
    confetti({
      particleCount: 400,   // 🔥 beaucoup de confettis
      spread: 180,          // couvre tout l'écran
      startVelocity: 60,    // vitesse initiale
      origin: {
        x: Math.random(),   // position horizontale aléatoire
        y: Math.random() - 0.2 // légèrement au-dessus de l'écran
      }
    });
    // continue jusqu’à la fin de la durée
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}


//Roue rigolote
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const radius = canvas.width / 2;

function drawWheel(names, rotation = 0) {
  const slice = (2 * Math.PI) / names.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate(rotation);

  const colors = ["#58be30ff", "#d11818ff", "#ffffffff"]
  
  for (let i = 0; i < names.length; i++) {
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.fillStyle = colors[i % 3];
    ctx.arc(0,0,radius,i*slice,(i+1)*slice);
    ctx.fill();

    ctx.save();
    ctx.rotate(i*slice + slice/2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#333";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(names[i], radius-10,5);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2*Math.PI);
  ctx.lineWidth = 5;          // épaisseur de la bordure
  ctx.strokeStyle = "black";  // couleur de la bordure
  ctx.stroke();
  
  ctx.restore();
}
drawWheel(participants);

// --- Animation roue ---
function spinWheel(targetName, onFinish) {
  const slice = (2 * Math.PI) / participants.length;
  const targetIndex = participants.indexOf(targetName);
  const extraTurns = 80; // plus de tours pour effet visuel
  const targetAngle = (Math.PI*3/2) - (targetIndex*slice + slice/2) + 2*Math.PI*extraTurns;

  let start = null;
  const duration = 40000; // 6 sec
  function animate(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed/duration,1);
    const eased = 1 - Math.pow(1-progress,3); // deceleration
    drawWheel(participants, eased*targetAngle);

    if(progress < 1){
      requestAnimationFrame(animate);
    } else {
      drawWheel(participants, targetAngle);
      onFinish();
    }
  }
  requestAnimationFrame(animate);
}

//Boutton u know
document.getElementById("btnReveal").addEventListener("click", () => {
  const name = document.getElementById("nameInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (!participants.includes(name)) {
    resultDiv.textContent = "Pitié un effort, écris bien ton prénom le 100";
    return; // stoppe tout ici
  }

  clickSound.currentTime = 0;
  clickSound.play().catch(err => console.log("Erreur lecture audio :", err));

  resultDiv.textContent = "Waouh quel lancer !";

  const msg1 = setTimeout(()=>resultDiv.textContent="Aïe ça va être long...", 2000);
  const msg2 = setTimeout(()=>resultDiv.textContent="Tout vient à point à qui sait attendre.", 4000);
  const msg3 = setTimeout(()=>resultDiv.textContent="Patience est mère de toutes les surprises.", 6000);
  const msg4 = setTimeout(()=>resultDiv.textContent="Les cadeaux, c’est comme le fromage : ça se mérite.", 8000);
  const msg5 = setTimeout(()=>resultDiv.textContent="Attention, révélation imminente (ou pas).", 10000);
  const msg6 = setTimeout(() => resultDiv.innerHTML = "<img src='images/cat1.jpg' width='200'>", 12000);
  const msg7 = setTimeout(() => resultDiv.innerHTML = "<img src='images/cat2.gif' width='200'>", 14000);
  const msg8 = setTimeout(() => resultDiv.innerHTML = "<img src='images/cat3.jpg' width='200'>", 16000);
  const msg9 = setTimeout(()=>resultDiv.textContent="Sur qui vas tu tomber ???", 18000);
  const msg10 = setTimeout(() => resultDiv.innerHTML = "<img src='images/Théotim.jpg' width='200'>", 20000);
  const msg11 = setTimeout(() => resultDiv.innerHTML = "<img src='images/Antonin.jpg' width='200'>", 20400);
  const msg12 = setTimeout(() => resultDiv.innerHTML = "<img src='images/Lého.jpg' width='200'>", 20800);
  const msg13 = setTimeout(() => resultDiv.innerHTML = "<img src='images/Inès.jpg' width='200'>", 21200);
  const msg14 = setTimeout(() => resultDiv.innerHTML = "<img src='images/Guillaume O.jpg' width='200'>", 21600);
  const msg15 = setTimeout(() => resultDiv.innerHTML = "<img src='images/Lucas.jpg' width='200'>", 22000);
  const msg16 = setTimeout(() => resultDiv.innerHTML = "<img src='images/Noé.jpg' width='200'>", 22400);
  const msg17 = setTimeout(() => resultDiv.innerHTML = "<img src='images/Lalie.jpg' width='200'>", 22800);
  const msg18 = setTimeout(() => resultDiv.innerHTML = "<img src='images/Guillaume D.jpg' width='200'>", 23200);
  const msg19 = setTimeout(()=>resultDiv.textContent="Le suspens est insoutenable...", 23600);



  spinWheel(pairs[name], () => {
    clearTimeout(msg1);
    clearTimeout(msg2);
    clearTimeout(msg3);
    clearTimeout(msg4);
    clearTimeout(msg5);
    clearTimeout(msg6);
    clearTimeout(msg7);
    clearTimeout(msg8);
    clearTimeout(msg9);
    clearTimeout(msg10);
    clearTimeout(msg11);
    clearTimeout(msg12);
    clearTimeout(msg13);
    clearTimeout(msg14);
    clearTimeout(msg15);
    clearTimeout(msg16);
    clearTimeout(msg17);
    clearTimeout(msg18);
    clearTimeout(msg19);

    endSound.currentTime = 0;
    endSound.play().catch(err => console.log("Erreur lecture audio :", err));
    crazyConfetti();
    
    resultDiv.textContent = `Tu dois offrir un cadeau à ${pairs[name]} !`;

        // AJOUT : affichage de la photo
    const photo = document.createElement("img");
    photo.src = `images/${pairs[name]}.jpg`;  // chemin vers tes photos
    photo.width = 250;                           // taille personnalisable
    photo.style.display = "block";
    photo.style.margin = "1em auto";

    // Ajout dans la div
    resultDiv.appendChild(photo);

    // Message personnalisé
    const message = document.createElement("p");
    message.textContent = messagesPerso[pairs[name]];
    message.classList.add("result-message");
    resultDiv.appendChild(message);
  });
});



//Bouton bonus
const btnMusic = document.getElementById("shimmy");
const secretAudio = document.getElementById("shimmySong");

btnMusic.addEventListener("click", () => {
    secretAudio.play();
});
