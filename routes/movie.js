// routes/movies.js

const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movie');

const { searchMovieByTitle, fetchMovieReviews } = require('../services/imdbService');
const { Movie, Review } = require('../models');
const pool = require('../database');

// Search Movies
router.get('/movies', movieController.getMoviesbyTitle);

// Fetch Movie Reviews
router.get('/movies/:id/reviews', movieController.getMovieReviews);

router.get('/movies/local/:id/', movieController.getLocalMovieByID);

module.exports = router;
