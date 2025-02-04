const { getOnePokemon } = require("../db/queries");

const pokemonValidation = async (req, res, next) => {
  const { fav } = req.body;
  if (!fav) {
    return res.status(400).json({ error: "A pokemon is required" });
  }

  try {
    const [result] = await getOnePokemon(fav);
    if (!result) {
      return res.status(400).json({ error: "The Pokemon was not found." });
    }

    req.pokemon = result;
    next();
  } catch (error) {
    console.log("DB Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { pokemonValidation };
