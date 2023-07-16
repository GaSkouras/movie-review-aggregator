const { searchMovieByTitle, fetchMovieReviews, searchMovieByID } = require('../services/imdbService');
const { Movie, Review, sequelize } = require('../models');
const pool = require('../database');
const {MovieNotFoundError, DatabaseWriteError} =  require ("../error.js")

exports.getMoviesbyTitle = async (req, res, next) => {
    try {
      const { title } = req.query;
      const movies = await searchMovieByTitle(title);

      if (!movies) {
        throw new MovieNotFoundError('Movie not found');
      }
      res.json(movies);
    } catch (error) {
      next(error);
    }
};

exports.getMovieReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movieInfo = await searchMovieByID(id);
    console.log("movieInfo is", movieInfo)
    if (!movieInfo) {
      throw new MovieNotFoundError('Movie not found');
    }
    const response = await fetchMovieReviews(id);
    const reviews = response.results;

    // Create or find the movie
    const movie = await createOrUpdateMovie(movieInfo);

    // Save reviews to the database
    await saveReviews(movie.id, reviews);

    // Retrieve the movie with associated reviews
    const movieWithReviews = await getMovieWithReviews(movie.tmdbID);

    res.json(movieWithReviews);
  } catch (error) {
    next(error);
  }
};

exports.getLocalMovieByID = async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    const movie = await Movie.findOne({
      where: { tmdbID: id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: Review,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },]
    });

    if (!movie) {
      throw new MovieNotFoundError('Movie not found');
    }
    res.json(movie);
  }

// Function to create or find the movie
const createOrUpdateMovie = async (movieInfo) => {
  const [movie] = await Movie.findOrCreate({
    where: { tmdbID: movieInfo.id },
    defaults: {
      title: movieInfo.title,
      release_date: movieInfo.release_date,
      vote_average: movieInfo.vote_average,
      imdb_id: movieInfo.imdb_id,
    },
  });
  return movie;
};

// Function to save reviews to the database
const saveReviews = async (movieId, reviews) => {
  const transaction = await sequelize.transaction(); // Assuming you have a Sequelize instance named 'sequelize'

  try {
    await Promise.all(
      reviews.map(async (review) => {
        const { author, content, created_at, updated_at } = review;
        const rev = await Review.create(
          {
            author: author,
            content: content,
            created_at: created_at,
            updated_at: updated_at,
          },
          { transaction } // Pass the transaction to the create() method
        );
        await rev.setMovie(movieId, { transaction }); // Pass the transaction to setMovie() method
      })
    );

    await transaction.commit(); // Commit the transaction if everything is successful
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction if an error occurs
    throw new DatabaseWriteError('Error occurred while saving reviews to the database.');
  }
};


// Function to retrieve the movie with associated reviews
const getMovieWithReviews = async (tmdbID) => {
  const movieWithReviews = await Movie.findOne({
    where: { tmdbID: tmdbID },
    include: Review, // Include the Review model
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  return movieWithReviews;
};
