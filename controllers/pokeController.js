const db = require("../db/queries");
const { pokemonValidation } = require("../validation/validation");

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
  let pokemon;
  switch (req.params.gen) {
    case "1":
      pokemon = await db.getOneGen(1, 151);
      break;
    case "2":
      pokemon = await db.getOneGen(152, 251);
      break;
    case "3":
      pokemon = await db.getOneGen(252, 386);
      break;
    case "4":
      pokemon = await db.getOneGen(387, 493);
      break;
    case "5":
      pokemon = await db.getOneGen(494, 649);
      break;
    case "6":
      pokemon = await db.getOneGen(650, 721);
      break;
    case "7":
      pokemon = await db.getOneGen(722, 809);
      break;
    case "8":
      pokemon = await db.getOneGen(810, 905);
      break;
    case "9":
      pokemon = await db.getOneGen(906, 1025);
      break;
  }
  res.render("pokeRegionDex", {
    title: "Pokemon Search",
    pokemon: pokemon,
    gens: gens,
    image: "/pokemon",
  });
};

const pokeType = async (req, res) => {
  res.render("poketype", { title: "Pokemon Search" });
};

const pokeTypePost = async (req, res) => {
  const type1 = req.body.type1;
  const type2 = req.body.type2;
  const pokemon = await db.getPokeTypes(type1, type2);
  const trainers = await db.getTrainers();
  res.render("poketypepost", { title: "Pokemon search", pokemon: pokemon });
};

const pokeTrainer = async (req, res) => {
  const trainers = await db.getTrainers();
  res.render("poketrainer", { title: "Pokemon Search", trainers: trainers });
};

const pokeTrainerPost = [
  pokemonValidation,
  async (req, res, next) => {
    if (req.error) {
      res.render("poketrainerPost", {
        title: "Pokemon search",
        success: null,
        error: req.error.message,
      });
    } else {
      const name = req.body.name;
      const pokemon = req.pokemon;
      try {
        const result = await db.addTrainer(name, pokemon.pokemon_id);
        const trainers = await db.getTrainers();
        res.render("poketrainerPost", {
          title: "Pokemon search",
          success: "Trainer added successfully!",
          trainers: trainers,
        });
      } catch (error) {
        next(error);
      }
    }
  },
];

const pokeTrainerDelete = async (req, res) => {
  const result = await db.deleteTrainer(req.params.id);
  pokeTrainer(req, res);
};

const deleteAllPokemon = async (req, res) => {
  const result = await db.truncPokemon();
  homepage(req, res);
};

const deleteAllTrainers = async (req, res) => {
  const result = await db.truncTrainers();
  homepage(req, res);
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
  pokeTypePost,
  pokeTrainer,
  pokeTrainerPost,
  pokeTrainerDelete,
  deleteAllPokemon,
  deleteAllTrainers,
  pokeCreateGet,
  pokeCreatePost,
};
