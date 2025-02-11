const { getOnePokemon } = require("../db/queries");

const pokemonValidation = async (req, res, next) => {
  const { fav } = req.body;
  if (!fav) {
    const error = new Error("A pokemon is required");
    error.status = 400;
    return next(error);
  }

  try {
    const [result] = await getOnePokemon(fav);
    if (!result) {
      const error = new Error("The Pokemon was not found");
      error.status = 404;
      return next(error);
    }

    req.pokemon = result;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { pokemonValidation };
