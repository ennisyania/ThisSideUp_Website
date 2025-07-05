const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const productsRoute = require('./routes/products');
const userRoute = require('./routes/user');
const MONGO_URI = process.env.MONGO_URI;

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.use('/api/products', productsRoute);
app.use('/api/user', userRoute);
// app.use('/api/customSkimboard', customSkimboardRoute);
// app.use('/api/orders', ordersRoute); // Uncomment if you have an orders route


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
