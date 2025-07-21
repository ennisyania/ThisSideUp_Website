import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import serverless from 'serverless-http';
import Stripe from 'stripe';

import productsRoute from './routes/products.js';
import userRoute from './routes/user.js';
import orderRoute from './routes/orders.js';
import adminStripeDataRoutes from './routes/adminStripeData.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 
const app = express();

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Stripe Payment Intent Route
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // Amount in cents

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'sgd', 
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).send({ error: err.message });
  }
});

// Default test route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// API routes
app.use('/api/products', productsRoute);
app.use('/api/user', userRoute);
app.use('/api/orders', orderRoute);
app.use('/api/admin', adminStripeDataRoutes);


const MONGO_URI = process.env.MONGO_URI;

// Local deployment
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Mongoose connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Mongoose connection error:', err);
  });

// // Vercel deployment connection 
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('Mongoose connected');
// }).catch((err) => {
//   console.error('Mongoose connection error:', err);
// });

// // Export handler for Vercel
// export default serverless(app);
