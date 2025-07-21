import express from 'express';
import User from '../models/userModel.js';

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

// Get all users (for admin use)
router.get('/admins', requireAuth, async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('email _id');
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch admins' });
    }
});

// Promote existing user to admin
router.put('/admins/promote', requireAuth, async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ error: 'User is already an admin' });
        }

        user.role = 'admin';
        await user.save();

        res.json({ message: 'User promoted to admin', email: user.email });
    } catch (err) {
        res.status(500).json({ error: 'Failed to promote user' });
    }
});


// Remove admin (demote to user, do NOT delete user)
router.delete('/admins/:id', requireAuth, async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user || user.role !== 'admin') {
            return res.status(404).json({ error: 'Admin not found' });
        }

        user.role = 'user'; // demote role
        await user.save();

        res.json({ message: 'Admin demoted to user' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to demote admin' });
    }
});




export default router;
