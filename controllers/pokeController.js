const db = require("../db/queries");

// Controllers for each route
const homepage = (req, res) => {
  res.render("homepage", { title: "Pokemon Search" });
};

const pokemon = async (req, res) => {
  const [pokemon] = await db.getOnePokemon(req.body.pokename);
  console.log(pokemon);
  res.render("pokemon", { title: "Pokemon Search", pokemon: pokemon });
};

const pokeRegion = async (req, res) => {
  const gens = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };
  res.render("pokeRegion", { title: "Pokemon Search", gens: gens });
};

const pokeRegionPost = async (req, res) => {
  console.log("123");
  res.render("123");
};

const pokeType = async (req, res) => {
  res.render("poketype", { title: "Pokemon Search" });
};

const pokeTrainer = async (req, res) => {
  res.render("poketrainer", { title: "Pokemon Search" });
};

const pokeCreateGet = async (req, res) => {
  res.render("pokecreate", { title: "Pokemon Create" });
};

const pokeCreatePost = async (req, res) => {
  res.render("newpokemon", { title: "New Pokemon" });
};

module.exports = {
  homepage,
  pokemon,
  pokeRegion,
  pokeRegionPost,
  pokeType,
  pokeTrainer,
  pokeCreateGet,
  pokeCreatePost,
};
