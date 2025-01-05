const { Router } = require("express");
const pokeController = require("../controllers/pokeController");
const pokeRouter = Router();

pokeRouter.get("/", pokeController.homepage);

module.exports = pokeRouter;
