const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // Pour faire les appels API vers l'application Python

const app = express();
const port = 3000; // Tu peux changer le port si nécessaire

// Middleware pour traiter les données JSON
app.use(bodyParser.json());

// Route de test
app.get('/', (req, res) => {
  res.send('Hello World from Express.js');
});

// Appel API vers l'application Python
app.get('/python-api', async (req, res) => {
  try {
    // Remplace l'URL ci-dessous par celle de ton application Python
    const pythonApiUrl = 'http://localhost:5000/api/data'; // Exemple d'URL de l'API Python

    // Faire la requête à l'API Python avec Axios
    const response = await axios.get(pythonApiUrl);

    // Envoyer la réponse obtenue depuis l'API Python au client
    res.json(response.data);
  } catch (error) {
    console.error('Erreur lors de l\'appel de l\'API Python:', error.message);
    res.status(500).send('Erreur serveur');
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur Express.js lancé sur le port ${port}`);
});
