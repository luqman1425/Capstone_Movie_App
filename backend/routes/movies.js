const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { getRecommendationsFromGenres } = require('../tmdb');

// Get user watchlist
router.get('/watchlist', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Add movie to watchlist
router.post('/watchlist', auth, async (req, res) => {
  try {
    const { movie } = req.body; // movie object with id, title, etc.
    if (!movie || !movie.id) return res.status(400).json({ message: 'Movie data is required.' });

    const user = await User.findByPk(req.user.id);
    const alreadyInList = user.watchlist.find(m => m.id === movie.id);

    if (alreadyInList)
      return res.status(400).json({ message: 'Movie already in watchlist.' });

    user.watchlist.push(movie);
    await user.save();
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Remove movie from watchlist
router.delete('/watchlist/:movieId', auth, async (req, res) => {
  try {
    const movieId = parseInt(req.params.movieId, 10);
    const user = await User.findByPk(req.user.id);

    user.watchlist = user.watchlist.filter(m => m.id !== movieId);
    await user.save();
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Personalized Recommendations based on watchlist genres
router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !Array.isArray(user.watchlist)) {
      return res.status(400).json({ message: 'No watchlist found for user.' });
    }

    const genreCounts = {};
    user.watchlist.forEach((movie) => {
      if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
        movie.genre_ids.forEach((genreId) => {
          genreCounts[genreId] = (genreCounts[genreId] || 0) + 1;
        });
      }
    });

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => parseInt(id));

    if (topGenres.length === 0) {
      return res.status(200).json({ recommendations: [] });
    }

    const recommendations = await getRecommendationsFromGenres(topGenres);
    res.json({ recommendations });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recommendations.' });
  }
});

// Add a review to a movie
router.post('/review/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const user = await User.findByPk(req.user.id);

    if (!user.reviews) user.reviews = [];

    // Add or update review for this movie
    const existingReviewIndex = user.reviews.findIndex(r => r.movieId === parseInt(movieId));
    if (existingReviewIndex >= 0) {
      user.reviews[existingReviewIndex] = { movieId: parseInt(movieId), rating, comment };
    } else {
      user.reviews.push({ movieId: parseInt(movieId), rating, comment });
    }

    await user.save();
    res.json({ reviews: user.reviews });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add review.' });
  }
});

// Get reviews for a movie
router.get('/review/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const users = await User.findAll({
      where: {},
      attributes: ['id', 'username', 'reviews']
    });

    const reviews = users
      .flatMap(user => (user.reviews || []))
      .filter(review => review.movieId === parseInt(movieId));

    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews.' });
  }
});

module.exports = router;
