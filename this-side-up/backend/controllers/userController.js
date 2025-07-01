const User = require('../models/userModel');

// login user
const loginUser = async (req, res) => {
    res.json({ mssg: 'login user' })
}

// register user
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);

    res.status(200).json({email, password });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser }
