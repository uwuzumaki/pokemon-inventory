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

module.exports = {
  getOnePokemon,
  getOneGen,
};
