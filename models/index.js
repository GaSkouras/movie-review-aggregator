// models/index.js

const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/movie_review_db');

const Movie = sequelize.define('movie', {
  tmdbID: {
    type: Sequelize.INTEGER,
    unique: true,
  },
  title: Sequelize.STRING,
  release_date: Sequelize.DATE,
  vote_average: Sequelize.STRING,
  imdb_id: Sequelize.STRING
});

const Review = sequelize.define('review', {
  author: Sequelize.STRING,
  content: Sequelize.TEXT,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
});

Movie.hasMany(Review);
Review.belongsTo(Movie);

module.exports = {
  sequelize,
  Movie,
  Review
};
