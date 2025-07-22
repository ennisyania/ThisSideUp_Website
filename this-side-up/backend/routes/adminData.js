// adminData.js
import express from 'express';
const router = express.Router();

import Order from '../models/orderModel.js';

router.get('/dashboard/recent-orders', async (req, res) => {
  try {
    const recentOrders = await Order.find({}, {
      firstName: 1,
      lastName: 1,
      userId: 1,
      orderStatus: 1,
      total: 1,
      placedAt: 1,
    }).sort({ placedAt: -1 }).limit(5);

    res.json(recentOrders);
  } catch (err) {
    console.error('Failed to fetch recent orders:', err);
    res.status(500).json({ error: 'Failed to fetch recent orders' });
  }
});


import User from '../models/userModel.js';



router.get('/dashboard/customers', async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const newCustomersToday = await User.countDocuments({
      createdAt: { $gte: todayStart }
    });

    res.json({ totalCustomers, newCustomersToday });
  } catch (err) {
    console.error('Failed to fetch customers from MongoDB:', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});


import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Total sales and orders (pending + shipped + delivered)
router.get('/dashboard', async (req, res) => {
  try {
    const salesOrders = await Order.find({
      orderStatus: { $in: ['pending', 'shipped', 'delivered'] }
    });

    const totalSales = salesOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = salesOrders.length;

    res.status(200).json({ totalSales, totalOrders });
  } catch (error) {
    console.error('MongoDB dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Today's sales and orders (pending + shipped + delivered placed today)
router.get('/dashboard/today', async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const todayOrders = await Order.find({
      orderStatus: { $in: ['pending', 'shipped', 'delivered'] },
      placedAt: { $gte: startOfToday }
    });

    const totalSalesToday = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrdersToday = todayOrders.length;

    res.status(200).json({ totalSalesToday, totalOrdersToday });
  } catch (error) {
    console.error('MongoDB today dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s dashboard data' });
  }
});

// Monthly revenue grouping by YYYY-MM string (pending + shipped + delivered)
router.get('/dashboard/revenue-monthly', async (req, res) => {
  try {
    const salesOrders = await Order.find({
      orderStatus: { $in: ['pending', 'shipped', 'delivered'] }
    });

    const revenueByMonth = {};

    salesOrders.forEach(order => {
      const date = new Date(order.placedAt);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

      revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + (order.total || 0);
    });

    const monthlyRevenue = Object.keys(revenueByMonth)
      .sort()
      .map(month => ({ month, revenue: revenueByMonth[month] }));

    res.json(monthlyRevenue);
  } catch (error) {
    console.error('MongoDB monthly revenue error:', error);
    res.status(500).json({ error: 'Failed to fetch monthly revenue' });
  }
});

// Total and today's refunded amounts (orderStatus: refunded only)
router.get('/dashboard/refunded', async (req, res) => {
  try {
    const refundedOrders = await Order.find({ orderStatus: 'refunded' });

    const totalRefunded = refundedOrders.reduce((sum, order) => sum + (order.total || 0), 0);

    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const refundedToday = refundedOrders
      .filter(order => new Date(order.placedAt) >= startOfToday)
      .reduce((sum, order) => sum + (order.total || 0), 0);

    res.json({ totalRefunded, refundedToday });
  } catch (error) {
    console.error('MongoDB refunds error:', error);
    res.status(500).json({ error: 'Failed to fetch refund data' });
  }
});






export default router;
