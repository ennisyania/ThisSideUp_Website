const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const productsRoute = require('./routes/products');
const userRoute = require('./routes/user');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRoute);
app.use('/api/user', userRoute);

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
