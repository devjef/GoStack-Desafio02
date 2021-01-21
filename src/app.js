const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next) {

  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()} ${url}]`;

  console.log(logLabel);

  next();
}

app.use(logRequests);

app.get("/repositories", (request, response) => {

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newProject = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  };

  repositories.push(newProject);

  return response.json(newProject);
});

app.put("/repositories/:id", (request, response) => {

  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);
  
  const repositorie = { id, title, url, techs };

  repoIndex < 0 ? response.status(400).json({ error: 'Repositorie not found' }) : repositories[repoIndex] = repositorie;
  
  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {

  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  repoIndex < 0 ? response.status(400).json({ error: 'Repositorie not found' }) : repositories.splice(repoIndex, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {

  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  repoIndex < 0 ? response.status(400).json({ error: 'Repositorie not found' }) : repositories[repoIndex].likes += 1;;

  response.json({ message: 'Thanks for the Like!'});
});

module.exports = app;