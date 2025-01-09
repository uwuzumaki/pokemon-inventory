const { Router } = require("express");
const pokeController = require("../controllers/pokeController");
const pokeRouter = Router();

// All the various routes for the app
pokeRouter.get("/", pokeController.homepage);
pokeRouter.post("/", pokeController.pokemon);
pokeRouter.get("/region", pokeController.pokeRegion);
pokeRouter.get("/type", pokeController.pokeType);
pokeRouter.get("/trainer", pokeController.pokeTrainer);
pokeRouter.get("/create", pokeController.pokeCreateGet);
pokeRouter.post("/create", pokeController.pokeCreatePost);

module.exports = pokeRouter;
