const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // Pour faire les appels API vers l'application Python
const multer = require('multer'); // Permet de travailler avec des fichiers
const FormData = require('form-data');
const config = require('./config.json');
const cors = require('cors');
const fs = require('fs');  // File system module to work with file streams


const app = express();
const upload = multer();  // Utilise multer pour gérer les fichiers
const port = 3000; // Tu peux changer le port si nécessaire

// Middleware pour traiter les données JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // To parse URL-encoded bodies
// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur Express.js lancé sur le port ${port}`);
});

app.use(cors());


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

// Fonction pour créer un content structure
async function createContentStructure(projectId, template_id, contentStructure) {
    const data = {
        contentStructure: contentStructure
    };

    try {
        const response = await axios.post(`${config.api.baseUrl}/api/projects/${projectId}/templates/${template_id}/structure`,
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

// Fonction pour recuperer un content structure d'un template
async function getContentStructure(projectId, template_id) {
    try {
        const response = await axios.get(`${config.api.baseUrl}/api/projects/${projectId}/templates/${template_id}/structure`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Erreur API Flask : ${error.response.data.error}`);
        } else {
            throw new Error(`Erreur Axios : ${error.message}`);
        }
    }
}

// Fonction pour save des datas
async function saveData(projectId, template_id, dataObject) {
    const json = {
        data: dataObject
    };

    try {
        const response = await axios.post(`${config.api.baseUrl}/api/projects/${projectId}/templates/${template_id}/data`,
            json, {
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

// Fonction pour recuperer des datas d'un template
async function getData(projectId, template_id) {
    try {
        const response = await axios.get(`${config.api.baseUrl}/api/projects/${projectId}/templates/${template_id}/data`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Erreur API Flask : ${error.response.data.error}`);
        } else {
            throw new Error(`Erreur Axios : ${error.message}`);
        }
    }
}

// Function to call the Flask API and generate content
async function generateContent(projectId, templateId) {
    try {
        // Call the Flask API using Axios
        const response = await axios.post(`${config.api.baseUrl}/api/projects/${projectId}/templates/${templateId}/generate`);

        // Return the Flask API response
        return {
            success: true,
            message: 'Content generation initiated via Flask API.',
            data: response.data,
        };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // Handle Flask API returning a 404 error
            return {
                success: false,
                error: 'Project or template not found.',
            };
        } else {
            // Handle general errors
            return {
                success: false,
                error: `Failed to call Flask API: ${error.message}`,
            };
        }
    }
}

// Function to handle project content digest and forward data to Flask API
async function digestContent(projectName, label, urls, files, projectSource) {
    const result = {};

    // Create a FormData object to send data to the Flask API
    const formData = new FormData();

    // Add URLs to the formData
    if (urls.length > 0) {
        formData.append('urls', JSON.stringify(urls));
    }

    // Add files to the formData (either from disk or from memory)
    if (files.length > 0) {
        files.forEach(file => {
            if (file.path) {
                // If the file has a 'path' (stored on disk)
                formData.append('files', fs.createReadStream(file.path));  // Stream the file content from disk
            } else if (file.buffer) {
                // If the file is stored in memory (no path, but has a buffer)
                formData.append('files', file.buffer, file.originalname);  // Directly send the buffer content with original name
            }
        });
    }

    // Add the project source ID to the formData
    if (projectSource) {
        formData.append('projectSource', projectSource);
    }

    try {
        // Send the formData to the Flask API
        const flaskResponse = await axios.post(
            `${config.api.baseUrl}/api/project/${projectName}/${label}/digest-content`,
            formData,
            {
                headers: {
                    ...formData.getHeaders()  // Ensure proper headers for multipart/form-data
                }
            }
        );

        // Process the response from Flask API
        result.message = `Updated ${label} for project ${projectName}`;
        result.flaskData = flaskResponse.data;

        return result;
    } catch (error) {
        if (error.response) {
            throw new Error(`Erreur API Flask lors de la mise à jour de ${label} : ${error.response.data.error}`);
        } else {
            throw new Error(`Erreur Axios lors de la mise à jour de ${label} : ${error.message}`);
        }
    }
}

// Fonction pour mettre à jour un projet et vérifier les modifications
async function updateProject(projectName, label, value) {
    try {
        const response = await axios.post(`${config.api.baseUrl}/api/project/${projectName}/${label}/update`, {
            data: value
        });
        return response.data;

    } catch (error) {
        if (error.response) {
            throw new Error(`Erreur API Flask lors de la mise à jour de ${label} : ${error.response.data.error}`);
        } else {
            throw new Error(`Erreur Axios lors de la mise à jour de ${label} : ${error.message}`);
        }
    }
}

// Fonction pour recuperer le contenu généré
async function getContent(projectId, template_id) {
    try {
        const response = await axios.get(`${config.api.baseUrl}/api/projects/${projectId}/content`, {
            params: { template_id }
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


//////////////////////////////////////
//                                  //
//            Endpoints             //
//                                  //
//////////////////////////////////////

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

// Endpoint pour crée les template et les transmettre à l'API Flask
app.post('/api/project/:project_id/templates', async (req, res) => {
    const { project_id } = req.params;
    const { templateName } = req.body;

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
        res.status(500).json({ error: `Erreur lors de la recupération des templates: ${error.message}` });
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
        res.status(500).json({ error: `Erreur lors de la récupération des detailles du template: ${error.message}` });
    }
});

// Endpoint pour recuperer tout templates d'un project
app.get('/api/project/:project_id/templates', async (req, res) => {
    const { project_id } = req.params;

    try {
        const result = await getAllTemplate(project_id)

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la recupération des templates: ${error.message}` });
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
        res.status(500).json({ error: `Erreur lors de la récupération des detailles du template: ${error.message}` });
    }
});

// Endpoint pour crée un content structure
app.post('/api/project/:project_id/templates/:template_id/structure', async (req, res) => {
    const { project_id } = req.params;
    const { template_id } = req.params;
    const { contentStructure } = req.body;

    try {
        const result = await createContentStructure(project_id, template_id, contentStructure)

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la création du content structure: ${error.message}` });
    }
});

// Endpoint pour recuperer un content structure d'un template
app.get('/api/project/:project_id/templates/:template_id/structure', async (req, res) => {
    const { project_id } = req.params;
    const { template_id } = req.params;

    try {
        const result = await getContentStructure(project_id, template_id)

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la récupération du content structure: ${error.message}` });
    }
});

// Endpoint pour save des datas
app.post('/api/project/:project_id/templates/:template_id/data', async (req, res) => {
    const { project_id } = req.params;
    const { template_id } = req.params;
    const { data } = req.body;

    try {
        const result = await saveData(project_id, template_id, data)

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la sauvegarde des data: ${error.message}` });
    }
});

// Endpoint pour recuperer des data d'un template
app.get('/api/project/:project_id/templates/:template_id/data', async (req, res) => {
    const { project_id } = req.params;
    const { template_id } = req.params;

    try {
        const result = await getData(project_id, template_id)

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la récupération des data: ${error.message}` });
    }
});

// API endpoint to trigger content generation
app.post('/api/project/:projectId/templates/:templateId/generate', async (req, res) => {
    const { projectId, templateId } = req.params;

    // Call the generateContent function
    const result = await generateContent(projectId, templateId);

    if (result.success) {
        // Send the success response back to the client
        res.status(200).json(result);
    } else {
        // Send the error response back to the client
        res.status(500).json(result);
    }
});


// Endpoint POST to update content for a label
app.post('/api/project/:projectName/:label/digest-content', upload.array('files'), async (req, res) => {
    const { projectName, label } = req.params;  // Get projectName and label from the URL params
    const files = req.files;  // Multer will handle the uploaded files
    const urls = req.body.urls ? JSON.parse(req.body.urls) : [];  // Parse the URLs sent in the request
    const projectSource = req.body.projectSource;  // Get the project source ID from the request body

    try {
        // Call the digestContent function to process and forward the request to the Flask API
        const result = await digestContent(projectName, label, urls, files, projectSource);
        res.status(200).json(result);  // Send back the updated data in JSON format
    } catch (error) {
        res.status(500).json({ error: `Error during project update: ${error.message}` });
    }
});

// Endpoint POST pour mettre à jour les champs modifiés d'un projet
app.post('/api/project/:projectName/:label/update', async (req, res) => {
    const { projectName, label } = req.params; // Récupère le nom du projet depuis les paramètres d'URL
    const value = req.body;
    try {
        // Appel de la fonction pour mettre à jour le projet avec les champs modifiés
        const result = await updateProject(projectName, label, value);
        res.status(200).json(result); // Retourne une réponse JSON avec les données mises à jour
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la mise à jour du projet : ${error.message}` });
    }
});

// Endpoint pour recuperer le contenu généré 
app.get('/api/project/:project_id/content', async (req, res) => {
    const { project_id } = req.params;
    const template_id = req.body;
    try {
        const result = await getContent(project_id, template_id)

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la récupération de contenu: ${error.message}` });
    }
});

