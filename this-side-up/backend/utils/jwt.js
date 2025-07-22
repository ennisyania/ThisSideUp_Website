import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' }); // token valid for 3 days
};

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id).select('_id');
    next();
  } catch (err) {
    res.status(401).json({ error: 'Request not authorized' });
  }
};

export { requireAuth, createToken, maxAge };
