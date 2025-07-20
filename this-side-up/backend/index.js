import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import serverless from 'serverless-http';

import productsRoute from './routes/products.js';
import userRoute from './routes/user.js';
import orderRoute from './routes/orders.js';

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  res.send('Backend is running on Vercel and ready!');
});


app.use('/api/products', productsRoute);
app.use('/api/user', userRoute);
// app.use('/api/customSkimboard', customSkimboardRoute);
app.use('/api/orders', orderRoute); // Uncomment if you have an orders route


// local deployment
const MONGO_URI = process.env.MONGO_URI

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



// Vercel deployment

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Mongoose connected');
}).catch((err) => {
  console.error('Mongoose connection error:', err);
});

// Export handler for Vercel Serverless Function
export default serverless(app);

