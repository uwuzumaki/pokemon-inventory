require("dotenv").config();
const { Client } = require("pg");

// Gets pokemon from PokemonAPI using pagination
const pokemon = async (limit, offset) => {
  const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
  try {
    // Gets a list of the pokemon name and their url
    const response = await fetch(url);
    const pokemonUrl = await response.json();

    // Transforms the data so that it's table ready
    const tableReady = pokemonUrl.results.map(async (pokemon) => {
      const response = await fetch(pokemon.url);
      const aPokemon = await response.json();
      const { id, name, types } = aPokemon;
      return { id, name, types };
    });
    return await Promise.all(tableReady);
  } catch (error) {
    console.log(error);
  }
};

// Gets types from PokemonAPI using pagination
const types = async () => {
  // Gets a list of types
  const url = "https://pokeapi.co/api/v2/type/";
  try {
    const response = await fetch(url);
    const types = await response.json();

    return types;
  } catch (error) {
    console.log(error);
  }
};

const fetchAndStore = async () => {
  const batchSize = 100;
  const total = 1302;

  for (let offset = 0; offset < 200; offset += batchSize) {
    console.log(`Fetching Pokemon ${offset + 1} to ${offset + batchSize}`);
    const pokeBatch = await pokemon(batchSize, offset);
    console.log(pokeBatch);
    console.log("Inserting...");
  }
};

const main = async () => {
  const wowee = await fetchAndStore();
  // const type = await types();
  // console.log(wowee);
  // console.log(type);
};

main();
