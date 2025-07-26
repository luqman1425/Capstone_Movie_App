const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { getRecommendationsFromGenres } = require('../tmdb'); // 👈 Import helper function

// ⭐ Personalized Recommendations Route
router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user || !Array.isArray(user.watchlist)) {
      return res.status(400).json({ message: 'No watchlist found for user.' });
    }

    const genreCounts = {};

    // Aggregate genre IDs from user's watchlist
    user.watchlist.forEach((movie) => {
      if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
        movie.genre_ids.forEach((genreId) => {
          genreCounts[genreId] = (genreCounts[genreId] || 0) + 1;
        });
      }
    });

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])      // sort by frequency
      .slice(0, 3)                      // take top 3 genres
      .map(([id]) => parseInt(id));     // extract genre IDs

    if (topGenres.length === 0) {
      return res.status(200).json({ recommendations: [] });
    }

    const recommendations = await getRecommendationsFromGenres(topGenres);
    res.json({ recommendations });

  } catch (err) {
    console.error('Recommendation Error:', err);
    res.status(500).json({ message: 'Failed to fetch recommendations.' });
  }
});

module.exports = router;
