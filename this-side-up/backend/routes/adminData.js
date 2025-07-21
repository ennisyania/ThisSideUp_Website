import express from 'express';


import User from '../models/userModel.js'; 

const router = express.Router();

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

// Get total sales and order count
router.get('/dashboard', async (req, res) => {
  try {
    const paymentIntents = await stripe.paymentIntents.list({ limit: 100 });
    const successfulPayments = paymentIntents.data.filter(pi => pi.status === 'succeeded');
    const totalSales = successfulPayments.reduce((acc, pi) => acc + (pi.amount_received ?? 0), 0) / 100;
    const totalOrders = successfulPayments.length;

    console.log('Dashboard data:', { totalSales, totalOrders });

    res.setHeader('Content-Type', 'application/json'); 
    res.status(200).json({ totalSales, totalOrders });
  } catch (error) {
    console.error('Stripe API error:', error);
    res.status(500).json({ error: 'Failed to fetch Stripe PaymentIntent data' });
  }
});

// Get today's total sales and order count
router.get('/dashboard/today', async (req, res) => {
  try {
    const startOfTodayUTC = new Date();
    startOfTodayUTC.setUTCHours(0, 0, 0, 0);

    const paymentIntents = await stripe.paymentIntents.list({ limit: 100 });
    const todayPayments = paymentIntents.data.filter(pi =>
      pi.status === 'succeeded' && new Date(pi.created * 1000) >= startOfTodayUTC
    );

    const totalSalesToday = todayPayments.reduce((acc, pi) => acc + (pi.amount_received ?? 0), 0) / 100;
    const totalOrdersToday = todayPayments.length;

    console.log('Dashboard today data:', { totalSalesToday, totalOrdersToday });

    res.setHeader('Content-Type', 'application/json'); 
    res.status(200).json({ totalSalesToday, totalOrdersToday });
  } catch (error) {
    console.error('Stripe API error:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s Stripe PaymentIntent data' });
  }
});

// Get monthly revenue
router.get('/dashboard/revenue-monthly', async (req, res) => {
  try {
    // Fetch last 100 charges (increase limit or paginate in prod)
    const charges = await stripe.charges.list({ limit: 100, expand: ['data.payment_intent'] });

    // Filter succeeded charges
    const successfulCharges = charges.data.filter(c => c.status === 'succeeded');

    // Aggregate revenue per month
    const revenueByMonth = {};

    successfulCharges.forEach(charge => {
      const date = new Date(charge.created * 1000);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // e.g., "2025-07"
      
      if (!revenueByMonth[monthKey]) {
        revenueByMonth[monthKey] = 0;
      }
      revenueByMonth[monthKey] += charge.amount; // amount in cents
    });

    // Convert to array sorted by month ascending
    const sortedMonths = Object.keys(revenueByMonth).sort();

    const monthlyRevenue = sortedMonths.map(month => ({
      month,
      revenue: revenueByMonth[month] / 100, // convert to dollars
    }));

    res.json(monthlyRevenue);
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    res.status(500).json({ error: 'Failed to fetch monthly revenue' });
  }
});

// Get total refunded amount and today's refunded amount
router.get('/dashboard/refunded', async (req, res) => {
  try {
    const refunds = await stripe.refunds.list({ limit: 100 });
    
    const totalRefundedCents = refunds.data.reduce((sum, refund) => sum + refund.amount, 0);
    
    const now = Math.floor(Date.now() / 1000);
    const startOfDay = now - (now % 86400);

    const todayRefundedCents = refunds.data
      .filter(refund => refund.created >= startOfDay)
      .reduce((sum, refund) => sum + refund.amount, 0);

    res.json({
      totalRefunded: totalRefundedCents / 100,
      refundedToday: todayRefundedCents / 100,
    });
  } catch (error) {
    console.error('Failed to fetch refunds:', error);
    res.status(500).json({ error: 'Failed to fetch refunds' });
  }
});



export default router;
