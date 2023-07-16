// services/imdbService.js
require('dotenv').config();
const axios = require('axios');
const {ClientError} =  require ("../error.js")

const API_KEY = process.env.API_KEY;
const TMDB_BASIC_URL = process.env.TMDB_BASIC_URL


const options = {
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
};


async function searchMovieByTitle(title) {
    try {
        const response = await axios.get(`${TMDB_BASIC_URL}/search/movie?query=${title}`, options);
        return response.data.results;
    } catch (error) {
        // console.error(error);
        throw new ClientError('Failed to fetch movie data from TMDB API');
    }

}

async function searchMovieByID(movieID) {
  try {
      const response = await axios.get(`${TMDB_BASIC_URL}/movie/${movieID}`, options);
      return response.data;
  } catch (error) {
      // console.error(error);
      throw new ClientError('Failed to fetch movie data from TMDB API');
  }

}

async function fetchMovieReviews(movieID) {
  try {
    const response = await axios.get(`${TMDB_BASIC_URL}/movie/${movieID}/reviews`, options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new ClientError('Failed to fetch movie reviews from TMDB API');
  }
}

module.exports = {
  searchMovieByTitle,
  searchMovieByID,
  fetchMovieReviews
};
