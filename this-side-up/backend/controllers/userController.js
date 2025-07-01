const User = require('../models/userModel');


const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}


const validatePassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
}


const loginUser = async (req, res) => {
    res.json({ mssg: 'login user' })
}

// register user
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  console.log('Register data:', { email, password });

  // Validate email and password BEFORE creating user
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

    res.status(200).json({
      email: user.email,
      user: {
        id: user._id,
        email: user.email,
      }
    });
  } catch (error) {
    console.log('Signup error:', error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser }
