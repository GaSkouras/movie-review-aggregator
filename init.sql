-- init.sql

CREATE TABLE IF NOT EXISTS movies (
  id SERIAL PRIMARY KEY,
  imdbId VARCHAR(255) UNIQUE,
  title VARCHAR(255),
  year INTEGER,
  genre VARCHAR(255),
  director VARCHAR(255),
  actors TEXT,
  imdbRating FLOAT
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  movieId INTEGER REFERENCES movies(id),
  author VARCHAR(255),
  content TEXT
);
