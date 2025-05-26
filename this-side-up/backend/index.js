require('dotenv').config(); // Load environment variables from .env
const mongoose = require('mongoose');

const username = process.env.MONGO_USER;
const password = encodeURIComponent(process.env.MONGO_PASS); // encode to safely handle special chars
const cluster = process.env.MONGO_CLUSTER;
const dbName = process.env.MONGO_DB;

const uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));
