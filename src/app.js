const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid, v4, validate } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequest(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method}] ${url}`;
  console.time(logLabel);
  
  next();
  console.timeEnd(logLabel);
}

function verifyRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).send({error: "Invalid Id"});
  }

  return next();
}

app.use(logRequest);

app.get("/repositories", (request, response) => {
  return response.status(200).json( repositories );
});

app.post("/repositories", (request, response) => {
  const {id} = v4;
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", verifyRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoriesIndex < 0){
    return status(400).json({ error: "Invalid Id"});
  }

  repositories[repositoriesIndex].title = title;
  repositories[repositoriesIndex].url = url;
  repositories[repositoriesIndex].techs = techs;

  return response.status(200).send(repositories[repositoriesIndex]);
});

app.delete("/repositories/:id", verifyRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoriesIndex < 0){
    return status(400).json({ error: "Invalid Id"});
  }

  repositories.splice(repositoriesIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", verifyRepositoryId, (request, response) => {
  // TODO
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  /* if (repositoriesIndex < 0){
    return status(400).json({ error: "Invalid Id"});
  } */

  // repositories[repositoriesIndex].likes ++;
  repository.likes ++;
  
  return response.status(200).json({ likes: repository.likes });
});

module.exports = app;
