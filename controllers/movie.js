const { searchMovieByTitle, fetchMovieReviews, searchMovieByID } = require('../services/imdbService');
const { Movie, Review } = require('../models');
const {MovieNotFoundError} =  require ("../error.js")
const {createOrUpdateMovie, saveReviews, getMovieWithReviews} = require("../utils/movieUtils")

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
    console.log(error)
    next(error);
  }
};

exports.getLocalMovieByID = async (req, res, next) => {
  try {
    const { id } = req.params;

    const field = typeof id === 'number' || !isNaN(parseInt(id)) ? 'tmdbID' : 'imdb_id';

    const movie = await Movie.findOne({
      where: {[field]: id },
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
  } catch (error){
    console.log(error)
    next(error);
  }
}

exports.updateLocalMovieByID = async (req, res, next) =>{
  try {
    const { id } = req.params;
    const { reviews } = req.body;
    const field = typeof id === 'number' || !isNaN(parseInt(id)) ? 'tmdbID' : 'imdb_id';

    // Find the movie by IMDb ID
    const movie = await Movie.findOne({ where: { [field]: id} });

    if (!movie) {
      throw new MovieNotFoundError('Movie not found');
    }

    // // Create or update the reviews for the movie
    await saveReviews(movie.id, reviews);

    return res.json({ message: 'Movie reviews updated successfully' });
  } catch (error) {
    next(error);
  }
}

