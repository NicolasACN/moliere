const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // Pour faire les appels API vers l'application Python
const multer = require('multer'); // Permet de travailler avec des fichiers
const FormData = require('form-data');
const config = require('./config.json');

const app = express();
const upload = multer();  // Utilise multer pour gérer les fichiers
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

// Fonction pour envoyer les data file à l'API Flask
async function uploadDataFiles(project_id, files, endpoint) {
    try {
        const form = new FormData();

        // Ajouter chaque fichier dans le form-data
        files.forEach(file => {
            form.append('files', file.buffer, file.originalname);  // Ajouter les fichiers avec leur nom original
        });

        const response = await axios.post(
            `${config.api.baseUrl}/api/project/${project_id}/${endpoint}`,
            form,
            {
                headers: {
                    ...form.getHeaders() // Ajoute les headers form-data
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Erreur API Flask : ${error.response.data.error}`);
        } else {
            throw new Error(`Erreur Axios : ${error.message}`);
        }
    }
}

// Fonction pour envoyer les data role à l'API Flask
async function uploadDataFilesRole(project_id, role) {
    const jsonData = {
        role: role
    };
    try {
        const response = await axios.post(
            `${config.api.baseUrl}/api/project/${project_id}/role`,
            jsonData, 
            {
                headers: {
                    'Content-Type': 'application/json' 
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Erreur API Flask : ${error.response.data.error}`);
        } else {
            throw new Error(`Erreur Axios : ${error.message}`);
        }
    }
}

// Fonction pour créer un nouveau template
async function createNewTemplate(projectId, templateName) {
    const data = {
        templateName: templateName
    };

    try {
        const response = await axios.post(`${config.api.baseUrl}/api/projects/${projectId}/templates`, 
            data, {
            headers: {
                'Content-Type': 'application/json' 
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

// Fonction pour recuperer tout les templates d'un projet
async function getAllTemplate(projectId) {
    try {
        const response = await axios.get(`${config.api.baseUrl}/api/projects/${projectId}/templates`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Erreur API Flask : ${error.response.data.error}`);
        } else {
            throw new Error(`Erreur Axios : ${error.message}`);
        }
    }
}

// Fonction pour recuperer les detail d'un templates
async function getTemplateDetails(projectId, template_id) {
    try {
        const response = await axios.get(`${config.api.baseUrl}/api/projects/${projectId}/templates/${template_id}`);
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

// Endpoint pour recevoir les fichiers brand-knowledge et les transmettre à l'API Flask
app.post('/api/project/:project_id/brand-knowledge', upload.array('files'), async (req, res) => {
    const files = req.files;
    const { project_id } = req.params;

    if (!files || files.length === 0) {
        return res.status(400).json({ error: "Aucun fichier n'a été envoyé" });
    }

    try {
        const result = await uploadDataFiles(project_id, files, "brand-knowledge")
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de l'upload des fichiers: ${error.message}` });
    }
});

// Endpoint pour recevoir les fichiers copywriting-guidelines et les transmettre à l'API Flask
app.post('/api/project/:project_id/copywriting-guidelines', upload.array('files'), async (req, res) => {
    const files = req.files;
    const { project_id } = req.params;

    if (!files || files.length === 0) {
        return res.status(400).json({ error: "Aucun fichier n'a été envoyé" });
    }

    try {
        const result = await uploadDataFiles(project_id, files, "copywriting-guidelines")
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de l'upload des fichiers: ${error.message}` });
    }
});

// Endpoint pour recevoir les fichiers reference-examples et les transmettre à l'API Flask
app.post('/api/project/:project_id/reference-examples', upload.array('files'), async (req, res) => {
    const files = req.files;
    const { project_id } = req.params;

    if (!files || files.length === 0) {
        return res.status(400).json({ error: "Aucun fichier n'a été envoyé" });
    }

    try {
        const result = await uploadDataFiles(project_id, files, "reference-examples")
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de l'upload des fichiers: ${error.message}` });
    }
});

// Endpoint pour recevoir les role et les transmettre à l'API Flask
app.post('/api/project/:project_id/role', async (req, res) => {
    const { project_id } = req.params;
    const { role  } = req.body;
    try {
        const result = await uploadDataFilesRole(project_id, role)
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de l'upload des fichiers: ${error.message}` });
    }
});

// Endpoint pour crée les template et les transmettre à l'API Flask
app.post('/api/project/:project_id/templates', async (req, res) => {
    const { project_id } = req.params;
    const { templateName  } = req.body;

    try {
        const result = await createNewTemplate(project_id, templateName)
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la creation du template: ${error.message}` });
    }
});

// Endpoint pour recuperer tout templates d'un project
app.get('/api/project/:project_id/templates', async (req, res) => {
    const { project_id } = req.params;

    try {
        const result = await getAllTemplate(project_id)
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la recupération du template: ${error.message}` });
    }
});

// Endpoint pour recuperer les details d'un template
app.get('/api/project/:project_id/templates/:template_id', async (req, res) => {
    const { project_id } = req.params;
    const { template_id } = req.params;

    try {
        const result = await getTemplateDetails(project_id, template_id)
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de l'upload des fichiers: ${error.message}` });
    }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur Express.js lancé sur le port ${port}`);
});
