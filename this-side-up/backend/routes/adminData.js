import express from 'express';
const router = express.Router();

import Order from '../models/orderModel.js';
import OrderCS from '../models/orderCSModel.js';
import User from '../models/userModel.js';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Recent orders (only from normal Order collection for now)
router.get('/dashboard/recent-orders', async (req, res) => {
  try {
    const [recentNormalOrders, recentCustomOrders] = await Promise.all([
      Order.find({}, {
        firstName: 1,
        lastName: 1,
        userId: 1,
        orderStatus: 1,
        total: 1,
        placedAt: 1,
      }),
      OrderCS.find({}, {
        firstName: 1,
        lastName: 1,
        userId: 1,
        orderStatus: 1,
        total: 1,
        placedAt: 1,
      })
    ]);

    const allOrders = [...recentNormalOrders, ...recentCustomOrders];

    // Sort by placedAt descending
    allOrders.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));

    // Take top 5
    const recentOrders = allOrders.slice(0, 5);
    
    res.json(recentOrders);
  } catch (err) {
    console.error('Failed to fetch recent orders:', err);
    res.status(500).json({ error: 'Failed to fetch recent orders' });
  }
});


// Customers count
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

// Total sales & order count (Order + OrderCS, filtered)
router.get('/dashboard', async (req, res) => {
  try {
    const statuses = ['pending', 'shipped', 'delivered'];

    const [orders, ordersCS] = await Promise.all([
      Order.find({ orderStatus: { $in: statuses } }),
      OrderCS.find({ orderStatus: { $in: statuses } })
    ]);

    const totalSales = [...orders, ...ordersCS].reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length + ordersCS.length;

    res.status(200).json({ totalSales, totalOrders });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Today's sales & orders (Order + OrderCS placed today)
router.get('/dashboard/today', async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const statuses = ['pending', 'shipped', 'delivered'];

    const [todayOrders, todayOrdersCS] = await Promise.all([
      Order.find({
        orderStatus: { $in: statuses },
        placedAt: { $gte: startOfToday }
      }),
      OrderCS.find({
        orderStatus: { $in: statuses },
        placedAt: { $gte: startOfToday }
      })
    ]);

    const totalSalesToday = [...todayOrders, ...todayOrdersCS].reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrdersToday = todayOrders.length + todayOrdersCS.length;

    res.status(200).json({ totalSalesToday, totalOrdersToday });
  } catch (error) {
    console.error('Today dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s dashboard data' });
  }
});

// Monthly revenue (Order + OrderCS)
router.get('/dashboard/revenue-monthly', async (req, res) => {
  try {
    const statuses = ['pending', 'shipped', 'delivered'];

    const [orders, ordersCS] = await Promise.all([
      Order.find({ orderStatus: { $in: statuses } }),
      OrderCS.find({ orderStatus: { $in: statuses } })
    ]);

    const allOrders = [...orders, ...ordersCS];

    const revenueByMonth = {};

    allOrders.forEach(order => {
      const date = new Date(order.placedAt);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + (order.total || 0);
    });

    const monthlyRevenue = Object.keys(revenueByMonth)
      .sort()
      .map(month => ({ month, revenue: revenueByMonth[month] }));

    res.json(monthlyRevenue);
  } catch (error) {
    console.error('Monthly revenue error:', error);
    res.status(500).json({ error: 'Failed to fetch monthly revenue' });
  }
});

// Refunded totals (Order + OrderCS)
router.get('/dashboard/refunded', async (req, res) => {
  try {
    const [refundedOrders, refundedOrdersCS] = await Promise.all([
      Order.find({ orderStatus: 'refunded' }),
      OrderCS.find({ orderStatus: 'refunded' })
    ]);

    const allRefunds = [...refundedOrders, ...refundedOrdersCS];

    const totalRefunded = allRefunds.reduce((sum, o) => sum + (o.total || 0), 0);

    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const refundedToday = allRefunds
      .filter(o => new Date(o.placedAt) >= startOfToday)
      .reduce((sum, o) => sum + (o.total || 0), 0);

    res.json({ totalRefunded, refundedToday });
  } catch (error) {
    console.error('Refunds error:', error);
    res.status(500).json({ error: 'Failed to fetch refund data' });
  }
});

export default router;
