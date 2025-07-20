import express from 'express';

// Require before use

import requireAuth from '../middlewares/requireAuth.js';

import { loginUser, registerUser, getCart } from '../controllers/userController.js';

console.log('requireAuth:', requireAuth); // now this works fine

const router = express.Router();

// Login route
router.post('/login', loginUser);

// Register route
router.post('/register', registerUser);

// Protected route for cart
router.get('/cart', requireAuth, getCart);

export default router;
