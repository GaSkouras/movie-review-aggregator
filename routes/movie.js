// routes/movies.js

const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movie');

// Search Movies
router.get('/movies/tmdb', movieController.getMoviesbyTitle);

// Fetch Movie Reviews
router.get('/movies/tmdb/:id/reviews', movieController.getMovieReviews);

// View Movie Details and Reviews:
router.get('/movies/local/:id', movieController.getLocalMovieByID);

// Update Movie Reviews
router.put('/movies/local/:id/', movieController.updateLocalMovieByID);

module.exports = router;
