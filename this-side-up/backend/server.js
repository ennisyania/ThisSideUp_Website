const express = require('express');
const cors = require('cors');
const productsRoute = require('./routes/products');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productsRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
