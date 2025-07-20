import express from 'express';
import Order from '../models/orderModel.js';
import requireAuth from '../middlewares/requireAuth.js';

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not found in request, authorization denied' });
    }

    const userId = req.user._id;

    const order = new Order({
      ...req.body,
      userId,
    });

    await order.save();
    res.status(201).json({ message: 'Order saved', orderId: order._id });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

export default router;
