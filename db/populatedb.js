#! /usr/bin/env node
//Creates the DBs
require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS pokemon (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS type (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS pokemon_type (
    pokemon_id INTEGER REFERENCES pokemon(id) ON DELETE CASCADE,
    type_id1 INTEGER NOT NULL REFERENCES type(id) ON DELETE CASCADE,
    type_id2 INTEGER REFERENCES type(id) ON DELETE CASCADE,
    UNIQUE (pokemon_id, type_id1, type_id2)
);

CREATE TABLE IF NOT EXISTS trainers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    fav_pokemon INTEGER 
);
`;

const main = async () => {
  const client = new Client({
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
};

main();
