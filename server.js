const axios = require('express');

async function getPopularMovies(apiKey) {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
}

// Menggunakan fungsi untuk mendapatkan data film terpopuler
const apiKey = 'YOUR_API_KEY';
getPopularMovies(apiKey)
  .then(movies => console.log('Popular Movies:', movies))
  .catch(error => console.error('Error:', error));
