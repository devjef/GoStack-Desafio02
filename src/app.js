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

  const newRepository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  };

  repositories.push(newRepository);

  return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {

  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex === -1) return response.status(400).json({ error: 'Repository does not exists.' });
  
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
  };
  
  repositories[repoIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {

  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  repoIndex < 0 ? response.status(400).json({ error: 'Repository does not exists.' }) : repositories.splice(repoIndex, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {

  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  repoIndex < 0 ? response.status(400).json({ error: 'Repository does not exists.' }) : repositories[repoIndex].likes += 1;;

  response.json({ likes: repositories[repoIndex].likes });
});

module.exports = app;