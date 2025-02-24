const pool = require("./pool");

const getOnePokemon = async (name) => {
  const { rows } = await pool.query(
    `SELECT
   p.id AS pokemon_id,
   p.NAME AS pokemon_name,
   t1.type_name AS type1_name,
   t2.type_name AS type2_name 
FROM
   pokemon_type pt 
   JOIN
      pokemon p 
      ON pt.pokemon_id = p.id 
   JOIN
      TYPE t1 
      ON pt.type_id1 = t1.id 
   LEFT JOIN
      TYPE t2 
      ON pt.type_id2 = t2.id 
WHERE
   p.NAME = $1
 `,
    [name]
  );
  return rows;
};

const getOneGen = async (start, end) => {
  const { rows } = await pool.query(
    `SELECT
   p.id AS pokemon_id,
   p.NAME AS pokemon_name,
   t1.type_name AS type1_name,
   t2.type_name AS type2_name 
FROM
   pokemon_type pt 
   JOIN
      pokemon p 
      ON pt.pokemon_id = p.id 
   JOIN
      TYPE t1 
      ON pt.type_id1 = t1.id 
   LEFT JOIN
      TYPE t2 
      ON pt.type_id2 = t2.id 
WHERE
   p.id >= $1 AND p.id <= $2
 `,
    [start, end]
  );
  return rows;
};

const getPokeTypes = async (type1, type2) => {
  if (type2 == "null") {
    const { rows } = await pool.query(
      `SELECT
          p.id AS pokemon_id,
          p.NAME AS pokemon_name,
          t1.type_name AS type1_name,
          t2.type_name AS type2_name
        FROM
          pokemon_type pt
          JOIN pokemon p ON pt.pokemon_id = p.id
          JOIN TYPE t1 ON pt.type_id1 = t1.id
          LEFT JOIN TYPE t2 ON pt.type_id2 = t2.id
        WHERE t1.type_name = $1 AND t2.type_name IS NULL`,
      [type1]
    );
    return rows;
  }

  let rows = [];

  // First attempt: type1 + type2
  const { rows: result1 } = await pool.query(
    `SELECT DISTINCT
          p.id AS pokemon_id,
          p.NAME AS pokemon_name,
          t1.type_name AS type1_name,
          t2.type_name AS type2_name
        FROM
          pokemon_type pt
          JOIN pokemon p ON pt.pokemon_id = p.id
          JOIN TYPE t1 ON pt.type_id1 = t1.id
          LEFT JOIN TYPE t2 ON pt.type_id2 = t2.id
        WHERE t1.type_name = $1 AND t2.type_name = $2`,
    [type1, type2]
  );

  rows = result1;

  // Second attempt: type2 + type1 if `rows` is empty
  if (rows.length === 0) {
    const { rows: result2 } = await pool.query(
      `SELECT DISTINCT
            p.id AS pokemon_id,
            p.NAME AS pokemon_name,
            t1.type_name AS type1_name,
            t2.type_name AS type2_name
          FROM
            pokemon_type pt
            JOIN pokemon p ON pt.pokemon_id = p.id
            JOIN TYPE t1 ON pt.type_id1 = t1.id
            LEFT JOIN TYPE t2 ON pt.type_id2 = t2.id
          WHERE t1.type_name = $1 AND t2.type_name = $2`,
      [type2, type1]
    );
    rows = result2;
  }

  return rows;
};

const addTrainer = async (trainer, pokemon) => {
  const result = await pool.query(
    `INSERT INTO trainers (name, fav_pokemon) VALUES ($1, $2)`,
    [trainer, pokemon]
  );
  return result;
};

const getTrainers = async () => {
  const { rows } = await pool.query(
    `SELECT 
        trainers.id AS id,
        trainers.name AS name,
        pokemon.name AS pokemon
     FROM 
       trainers
     INNER JOIN 
        pokemon
     ON 
        trainers.fav_pokemon = pokemon.id
      ORDER BY id;`
  );
  return rows;
};

const deleteTrainer = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM trainers WHERE id=$1`,
    [id]
  );
  return result;
};

const truncTrainers = async () => {
  const result = await pool.query(`
    TRUNCATE TABLE trainers;`);
  return result;
};

const truncPokemon = async () => {
  const result = await pool.query(`
    TRUNCATE TABLE pokemon;`);
  return result;
};

module.exports = {
  getOnePokemon,
  getOneGen,
  getPokeTypes,
  addTrainer,
  getTrainers,
  deleteTrainer,
  truncTrainers,
  truncPokemon,
};
