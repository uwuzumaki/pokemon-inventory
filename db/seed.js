//Populates the DBs
require("dotenv").config();
const format = require("pg-format");
const pool = require("./pool");

// Gets pokemon from PokemonAPI using pagination
const pokemonGet = async (limit, offset) => {
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
const typesGet = async () => {
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

// SQL for the insertion of Pokemon
const SQL = `
INSERT INTO pokemon (id, name)
VALUES %L
ON CONFLICT (id) DO NOTHING;
`;

// Takes batch data (which includes pokemon types) and transforms it into only ID and Name
// The data is placed as an array of arrays and bulk inserted into the DB.
// Also uses pg-format so that dynamic queries could be used.
const insertPokemon = async (pokeBatch) => {
  const values = pokeBatch.map((pokemon) => [pokemon.id, pokemon.name]);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const formattedQuery = format(SQL, values);

    await client.query(formattedQuery);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
  } finally {
    client.release();
  }
};

// Calls pokemonGet to fetch in batches then inserts into DB in batches
const fetchAndStore = async () => {
  const batchSize = 100;
  const total = 1302;

  for (let offset = 0; offset < 1302; offset += batchSize) {
    console.log(`Fetching Pokemon ${offset + 1} to ${offset + batchSize}`);
    const pokeBatch = await pokemonGet(batchSize, offset);
    await insertPokemon(pokeBatch);
    console.log(`Inserting pokemon ${offset + 1} - ${offset + batchSize}`);
  }
  console.log("done");
};

const insertTypes = async () => {
  const types = await typesGet();
  const values = types.results.map((type) => [type.name]);
  const client = await pool.connect();
  try {
    await client.query("Begin");
    const formattedQuery = format(
      `INSERT INTO type (type_name) VALUES %L ON CONFLICT (type_name) DO NOTHING;`,
      values
    );
    await client.query(formattedQuery);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
  } finally {
    client.release();
  }
};

const main = async () => {
  // await fetchAndStore();
  await insertTypes();
};

main();
