let pairs = {};

fetch('http://localhost:3000/pairs')
  .then(res => res.json())
  .then(data => {
    pairs = data.pairs;
    console.log('Tirage récupéré :', pairs);
  });
