import React, { useState } from 'react';
import { searchMovies } from '../api/tmdb';
import ReviewForm from '../components/ReviewForm'; // ✅ Import the ReviewForm

export default function SearchMovies() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await searchMovies(query);
      setResults(data.results);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    // Placeholder — you could reload reviews if you choose to show them here
    console.log('Review submitted!');
  };

  return (
    <div>
      <h2>Search Movies</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {results.length === 0 && !loading && <p>No results found</p>}
        {results.map((movie) => (
          <div key={movie.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h4>{movie.title}</h4>
            <p>{movie.overview || 'No description available.'}</p>

            {/* ✅ Add ReviewForm for each movie */}
            <ReviewForm movieId={movie.id} onReviewSubmitted={handleReviewSubmitted} />
          </div>
        ))}
      </div>
    </div>
  );
}
