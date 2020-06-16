const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

const projects = [];

// Middleware
function logResquests(request, response, next) {
	const { method, url  } = request;

	const logLabel = `[${method.toUpperCase()}] ${url}`;
	
	console.log(logLabel);

	return next();
}

// Middleware 
function validateProjectid(request, response, next) {
	 const { id } = request.params;

	 if (!isUuid(id)) {
		return response.status(400).json({ error: 'Invalid project ID.'});
	 }

	 return next();
}
 
app.use(logResquests);

// List
app.get('/projects', (request, response) => {
	const { title  } = request.query;

	const results = title 
		? projects.filter(project => project.title.includes(title))
		: projects;

	return response.json(results);
});

// Create
app.post('/projects', (request, response) => {
	const { title, owner }  = request.body;

	const project = { id: uuid(), title, owner };

	projects.push( project );

	return response.json(project);
});

// Update
app.put('/projects/:id', validateProjectid, (request, response) => {
	const { id } = request.params;
	const { title, owner }  = request.body;

	const projectIndex = projects.findIndex(project => project.id == id);

	if (projectIndex < 0) {
		return response.status(400).json({ error: 'Project not found.'});
	}

	const project = {
		id,
		title, 
		owner
	};

	projects[projectIndex] = project;

	return response.json(project);
});

// Delete
app.delete('/projects/:id', validateProjectid, (request, response) => {
	const { id } = request.params;

	const projectIndex = projects.findIndex(project => project.id == id);

	if (projectIndex < 0) {
		return response.status(400).json({ error: 'Project not found.'});
	}

	projects.splice(projectIndex, 1);
	
	return response.status(204).send();
});


// Start server...
app.listen(3333, () => {
	console.log('🚀 Backend started on port 3333.');
});