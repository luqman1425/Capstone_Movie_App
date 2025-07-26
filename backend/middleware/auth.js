const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Bearer token

  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user id & email inside token
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
