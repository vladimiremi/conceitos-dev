const express = require("express");
const { uuid, isUuid } = require('uuidv4');
//teste
const app = express();

app.use(express.json());

const projects = [];
//meddleware
function logRequests(request, response, next){
	const {method, url} = request;
	const logLabel = `[${method.toUpperCase()}] ${url}`;
    console.time(logLabel);
    
    next();
    
    console.timeEnd(logLabel);
}
//outra meddleware
function validateProjectId(request, response, next) {
    const { id } = request.params;
    if(!isUuid(id)) {
        return response.status(400).json({error: "Invalid project id!"});
    }
    return next();
}
//
//1ª forma de usar meddleware
app.use(logRequests);
app.use('/projects/:id', validateProjectId);//2ª forma de usar meddleware
//3ª forma é colocar direto na rota
app.get('/projects', (request, response) => {
    const { title } = request.query;

    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects;

    return response.json(results);
});

app.post('/projects', (request, response) => {
    const {title, owner} = request.body;
    const project = {
        id: uuid(), 
        title, 
        owner
    };

    projects.push(project);

    return response.json(project);
});

app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body;
    const projectIndex = projects.findIndex(project => project.id == id);
    console.log(projectIndex);
    if (projectIndex < 0){
        return response.status(400).json({error: 'Not found project.'});
    };

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id == id);
    console.log(projectIndex);

    if (projectIndex < 0){
        return response.status(400).json({error: "Not found project"});
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send({accept: "Deletado!"});
});

app.listen(3333, () => {
    console.log('✔ Back-end Started!');
});
