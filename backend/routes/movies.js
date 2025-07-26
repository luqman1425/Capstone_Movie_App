const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

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
    const { movie } = req.body; // movie = { id, title, poster_path, ... }

    if (!movie || !movie.id)
      return res.status(400).json({ message: 'Movie data is required.' });

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

module.exports = router;
