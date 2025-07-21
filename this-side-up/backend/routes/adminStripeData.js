import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
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


export default router;
