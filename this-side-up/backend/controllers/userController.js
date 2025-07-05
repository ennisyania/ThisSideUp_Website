const User = require('../models/userModel');
const { createToken, maxAge } = require('../utils/jwt'); // import JWT helper

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
};

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  console.log('Register data:', { email, password });

  if (!email || !validateEmail(email)) {
    console.log('Invalid email');
    return res.status(400).json({ error: 'Invalid or missing email.' });
  }

  if (!password || !validatePassword(password)) {
    console.log('Invalid password');
    return res.status(400).json({
      error: 'Password must be at least 8 characters long and contain at least one letter and one number.'
    });
  }

  try {
    const user = await User.register(email, password);
    console.log('New user:', user);

    // Generate JWT token here
    const token = createToken(user._id);

    res.status(200).json({
      email: user.email,
      user: {
        id: user._id,
        email: user.email,
      },
      token,
      expiresIn: maxAge
    });
  } catch (error) {
    console.log('Signup error:', error);
    res.status(400).json({ error: error.message });
  }
};

const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate inputs first (optional, but recommended)
  if (!email || !validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid or missing email.' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Missing password.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Generate token
    const token = createToken(user._id);

    res.status(200).json({
      email: user.email,
      user: {
        id: user._id,
        email: user.email,
        role: user.role, 
      },
      token,
      expiresIn: maxAge
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user._id; // You get this from JWT middleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { registerUser, loginUser, getCart };
