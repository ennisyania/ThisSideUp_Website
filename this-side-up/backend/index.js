import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import serverless from 'serverless-http';
import Stripe from 'stripe';
import { fileURLToPath } from 'url';

import productsRoute from './routes/products.js';
import userRoute from './routes/user.js';
import orderRoute from './routes/orders.js';
import adminStripeDataRoutes from './routes/adminData.js';
import settingsRoute from './routes/settings.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Configure multer to store files locally (in 'uploads' folder)
const upload = multer({ dest: path.join(__dirname, 'uploads') });

// Serve the uploads folder statically so uploaded images can be accessed by URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Upload route
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Stripe Payment Intent Route
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount, email } = req.body;

  try {
    const customer = await stripe.customers.create({ email });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'sgd',
      customer: customer.id,
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
app.use('/api/settings', settingsRoute);

const MONGO_URI = process.env.MONGO_URI;
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
