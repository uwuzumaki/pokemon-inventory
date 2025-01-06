const homepage = (req, res) => {
  res.render("homepage", { title: "Pokemon Search" });
};

const pokemon = async (req, res) => {
  res.render("pokemon", { title: "Pokemon Search" });
};

const pokeRegion = async (req, res) => {
  res.render("pokeRegion", { title: "Pokemon Search" });
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
  pokeType,
  pokeTrainer,
  pokeCreateGet,
  pokeCreatePost,
};
