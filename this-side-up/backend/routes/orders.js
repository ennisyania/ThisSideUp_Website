// routes/orders.js
import express from 'express';
import Order from '../models/orderModel.js';  // make sure path and casing match your project
import requireAuth from '../middlewares/requireAuth.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Create a new order
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

// Get all orders with optional filters
router.get('/allOrders', async (req, res) => {
  try {
    const { status, dateRange } = req.query;

    // Build filter query object
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status.toLowerCase();  // your schema enums are lowercase
    }

    if (dateRange && dateRange !== 'all') {
      let startDate;

      const now = new Date();

      if (dateRange === 'last7') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === 'last30') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateRange === 'thisMonth') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      if (startDate) {
        query.placedAt = { $gte: startDate };
      }
    }

    const orders = await Order.find(query)
      .sort({ placedAt: -1 })
      .limit(100);

    const formatted = orders.map(o => ({
      id: o._id.toString(),
      customer: `${o.firstName} ${o.lastName}`,
      date: o.placedAt.toISOString().slice(0, 10),
      status: o.orderStatus,
      total: `$${(o.total || 0).toFixed(2)}`,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
router.patch('/allOrders/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'refunded'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.orderStatus = status.toLowerCase();
    await order.save();

    res.json({ message: 'Order status updated' });
  } catch (error) {
    console.error('Failed to update order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Refund an order (mark as cancelled)
router.post('/:id/refund', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (!order.paymentIntentId) {
      return res.status(400).json({ error: 'No Stripe Payment Intent associated with this order' });
    }

    // Refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentIntentId,
    });

    // Update order status
    order.orderStatus = 'refunded';
    order.refundId = refund.id;
    await order.save();

    res.json({ message: 'Order refunded through Stripe', refundId: refund.id });
  } catch (error) {
    console.error('Failed to refund order via Stripe:', error);
    res.status(500).json({ error: 'Stripe refund failed' });
  }
});


export default router;
