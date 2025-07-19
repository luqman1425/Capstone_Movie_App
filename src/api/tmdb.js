import axios from 'axios';

const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.REACT_APP_TMDB_API_KEY,
  },
  timeout: 10000,
});

export async function searchMovies(query) {
  try {
    const response = await tmdbClient.get('/search/movie', {
      params: { query },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`TMDB API error: ${error.response.status} ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('No response received from TMDB API');
    } else {
      throw new Error(`Failed to fetch movies: ${error.message}`);
    }
  }
}
