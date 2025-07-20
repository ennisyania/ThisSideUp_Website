import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const requireAuth = async (req, res, next) => {
  // Get token from header
  const { authorization } = req.headers;

  console.log("Incoming Authorization Header:", authorization);

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];
  console.log('Extracted token:', token);

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const userFromDb = await User.findById(id).select('_id');
    if (!userFromDb) {
      return res.status(401).json({ error: 'User not found, authorization denied' });
    }
    req.user = userFromDb;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ error: 'Request not authorized' });
  }

};

export default requireAuth;
