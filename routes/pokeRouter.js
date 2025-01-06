const { Router } = require("express");
const pokeController = require("../controllers/pokeController");
const pokeRouter = Router();

pokeRouter.get("/", pokeController.homepage);
pokeRouter.post("/", pokeController.pokemon);
pokeRouter.get("/region", pokeController.pokeRegion);
pokeRouter.get("/type", pokeController.pokeType);
pokeRouter.get("/trainer", pokeController.pokeTrainer);

module.exports = pokeRouter;
