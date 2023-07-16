// database.js
require('dotenv').config();

const DB_PASSWORD = process.env.DATABASE_PASSWORD;

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'movie_review_db',
  password: DB_PASSWORD,
  port: 5432
});

module.exports = pool;