const express = require('express');

// Require before use
const requireAuth = require('../middlewares/requireAuth');
const { loginUser, registerUser, getCart } = require('../controllers/userController');

console.log('requireAuth:', requireAuth); // now this works fine

const router = express.Router();

// Login route
router.post('/login', loginUser);

// Register route
router.post('/register', registerUser);

// Protected route for cart
router.get('/cart', requireAuth, getCart);

module.exports = router;
