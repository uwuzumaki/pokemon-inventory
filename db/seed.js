//Populates the DBs
require("dotenv").config();
const format = require("pg-format");
const pool = require("./pool");
const fs = require("node:fs");
const path = require("node:path");
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");

//Downloads the image based on the url given.
//The fetch API provides a web-standard Readable stream.
//It is then converted into a stream nodejs recognizes.
//It is then piped into a filestream that can be written to file.
const downloadImage = async (url) => {
  try {
    const imageName = path.basename(url);
    const imagePath = path.join(__dirname, "../public/pokemon", imageName);
    const response = await fetch(url);
    const webStream = response.body;
    const nodeStream = Readable.fromWeb(webStream);
    const fileStream = fs.createWriteStream(imagePath, { flags: "wx" });
    await pipeline(nodeStream, fileStream);
  } catch (error) {
    console.log(error);
  }
};

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
      const image = aPokemon.sprites.other["official-artwork"].front_default;
      await downloadImage(image);
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

// Gets batch array of pokemon and types array.
// Checks each pokemon's type name and checks it against type name. If they match, put the type ID into an array.
// After checking 1 or both types, returns an array containing the pokemon id and the 1 or 2 type ids. The array is pushed into the db.
const insertPokemonTypes = async (pokemon, types) => {
  const values = pokemon.map((pokemon) => {
    const arr = [];
    arr.push(pokemon.id);
    pokemon.types.forEach((poketype) => {
      types.forEach((typetable) => {
        if (typetable[1] == poketype.type.name) {
          arr.push(typetable[0]);
        }
      });
    });
    if (arr.length < 3) {
      arr.push(null);
    }
    return arr;
  });
  const client = await pool.connect();
  try {
    await client.query("Begin");
    const formattedQuery = format(
      `INSERT INTO pokemon_type (pokemon_id, type_id1, type_id2) VALUES %L ON CONFLICT (pokemon_id, type_id1, type_id2) DO NOTHING;`,
      values,
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

// Calls pokemonGet to fetch in batches then inserts into DB in batches
// Calls insertPokemonTypes to match type names with type IDs and is inserted into pokemon_types table.
const fetchAndStore = async (types) => {
  const batchSize = 100;
  const total = 1302;

  for (let offset = 0; offset < total; offset += batchSize) {
    console.log(`Fetching Pokemon ${offset + 1} to ${offset + batchSize}`);
    const pokeBatch = await pokemonGet(batchSize, offset);
    await insertPokemon(pokeBatch);
    await insertPokemonTypes(pokeBatch, types);
    console.log(`Inserting pokemon ${offset + 1} - ${offset + batchSize}`);
  }
  console.log("done");
};

// Gets all types and their name, assigns them an ID, and places them inside an array.
// The array is inserted into the DB.
// This function returns the types array which will be used in setting up the pokemon_types table.
const insertTypes = async () => {
  const types = await typesGet();
  const values = types.results.map((type, index) => [index + 1, type.name]);
  const client = await pool.connect();
  try {
    await client.query("Begin");
    const formattedQuery = format(
      `INSERT INTO type (id, type_name) VALUES %L ON CONFLICT (type_name) DO NOTHING;`,
      values,
    );
    await client.query(formattedQuery);
    await client.query("COMMIT");
    return values;
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
  } finally {
    client.release();
  }
};

const databaseCheck = async () => {
  const SQL = `SELECT * FROM pokemon WHERE id=1;`;
  const { rows } = await pool.query(SQL);
  return rows;
};

const main = async () => {
  const types = await insertTypes(); // types is an array of arrays with each type having an id
  const exists = await databaseCheck();
  if (!exists) {
    await fetchAndStore(types);
  }
};

main();

module.exports = main;
