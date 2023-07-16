const { searchMovieByTitle, fetchMovieReviews, searchMovieByID } = require('../services/imdbService');
const { Movie, Review, sequelize } = require('../models');
const {MovieNotFoundError, DatabaseWriteError} =  require ("../error.js")

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
    const transaction = await sequelize.transaction();

    try {
        await Promise.all(
            reviews.map(async (review) => {
                let { author, content, created_at, updated_at } = review;
                if (!created_at){
                    created_at = new Date();
                    updated_at = new Date();
                }
            
                const [rev, created]  = await Review.upsert(
                {
                    author: author,
                    content: content,
                    created_at: created_at,
                    updated_at: updated_at,
                },
                { transaction }
                );
                if (!created){
                    console.log("Review already exist")
                }
                await rev.setMovie(movieId, { transaction });
            })
        );

        await transaction.commit(); // Commit the transaction if everything is successful
    } catch (error) {
        console.log(error)
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


module.exports = {
    createOrUpdateMovie,
    saveReviews,
    getMovieWithReviews
};
  