const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepoId(request, response, next) {
  const { id } = request.params;

  if ( !isUuid(id) ) return response.status(400).json({ error: 'Invalid repository ID.' });

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(repo);
  return response.json(repo);
});

app.put("/repositories/:id", validateRepoId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const index = repositories.findIndex(repo => repo.id === id);

  if ( index < 0 ) return response.status(400).json({ error: 'Repository not found.'} );

  const repo = {
    id,
    title,
    url: url,
    techs,
    likes: repositories[index].likes
  };
  repositories[index] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", validateRepoId, (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repo => repo.id === id);

  if ( index < 0 ) return response.status(400).json({ error: 'Repository not found.'} );

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepoId, (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repo => repo.id === id);

  if ( index < 0 ) return response.status(400).json({ error: 'Repository not found.'} );

  const repo = repositories[index];
  repo.likes += 1;
  repositories[index] = repo;

  return response.json({ likes: repo.likes });
});

module.exports = app;
