const { Router } = require("express");
const pokeController = require("../controllers/pokeController");
const pokeRouter = Router();

// All the various routes for the app
pokeRouter.get("/", pokeController.homepage);
pokeRouter.post("/", pokeController.pokemon);
pokeRouter.get("/region", pokeController.pokeRegion);
pokeRouter.get("/region/:gen", pokeController.pokeRegionPost);
pokeRouter.get("/type", pokeController.pokeType);
pokeRouter.post("/type", pokeController.pokeTypePost);
pokeRouter.get("/trainer", pokeController.pokeTrainer);
pokeRouter.post("/trainer", pokeController.pokeTrainerPost);
pokeRouter.post("/trainer/delete/:id", pokeController.pokeTrainerDelete);
pokeRouter.post("/pokemon/delete", pokeController.deleteAllPokemon);
pokeRouter.post("/trainer/delete", pokeController.deleteAllTrainers);
pokeRouter.post("/pokemon/addAll", pokeController.addAllPokemon);

module.exports = pokeRouter;
