const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // Pour faire les appels API vers l'application Python
const FormData = require('form-data');
const config = require('./config.json');

const app = express();
const port = 3000; // Tu peux changer le port si nécessaire

// Middleware pour traiter les données JSON
app.use(bodyParser.json());


//////////////////////////////////////
//                                  //
//            Fonctions             //
//                                  //
//////////////////////////////////////

async function createProject(projectName, projectBrief) {

    const form = new FormData();
    form.append('project_name', projectName);
    form.append('projectBrief', projectBrief);

    try {
        // Appel à l'API Flask pour créer un projet
        const response = await axios.post(`${config.api.baseUrl}/api/project`, form, {
            headers: {
                ...form.getHeaders(),
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Erreur API Flask : ${error.response.data.error}`);
        } else {
            throw new Error(`Erreur Axios : ${error.message}`);
        }
    }
  }
  
// Fonction pour appeler l'API Flask et récupérer les projets
async function getProjects() {
    try {
        // Appel à l'API Flask pour obtenir les projets
        const response = await axios.get(`${config.api.baseUrl}/api/projects`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Erreur API Flask : ${error.response.statusText}`);
        } else {
            throw new Error(`Erreur Axios : ${error.message}`);
        }
    }
}

// Fonction pour appeler l'API Flask et récupérer les détails d'un projet
async function getProjectDetails(project_id) {
    try {
        // Appel à l'API Flask pour récupérer les détails du projet
        const response = await axios.get(`${config.api.baseUrl}/api/project/${project_id}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Erreur API Flask : ${error.response.data.error}`);
        } else {
            throw new Error(`Erreur Axios : ${error.message}`);
        }
    }
}




//////////////////////////////////////
//                                  //
//            Endpoints             //
//                                  //
//////////////////////////////////////
// Route de test
app.get('/', (req, res) => {
  res.send('Hello World from Express.js');
});

// Endpoint POST pour crée un projet
app.post('/api/project', async (req, res) => {
    const { project_name, project_brief } = req.body;

    // Vérifier si les données sont présentes dans la requête
    if (!project_name || !project_brief) {
        return res.status(400).json({ error: "Les champs 'project_name' et 'project_brief' sont obligatoires." });
    }

    try {
        const result = await createProject(project_name, project_brief);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint GET pour récupérer la liste des projets
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await getProjects();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint GET pour récupérer les détails d'un projet
app.get('/api/project/:project_id', async (req, res) => {
    const { project_id } = req.params;

    // Vérifier si project_id est présent
    if (!project_id) {
        return res.status(400).json({ error: "L'ID du projet est requis." });
    }

    try {
        const projectDetails = await getProjectDetails(project_id);
        res.status(200).json(projectDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur Express.js lancé sur le port ${port}`);
});
