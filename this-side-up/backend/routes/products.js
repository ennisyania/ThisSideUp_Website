require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = 'ThisSideUp';

// Get skimboards
router.get('/skimboards', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('products');
    const skimboards = await collection.find({ category: 'skimboard' }).toArray();
    res.json(skimboards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch skimboards' });
  }
});

// Get t-shirts
router.get('/tshirts', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('products');
    const tshirts = await collection.find({ category: 't-shirt' }).toArray();
    res.json(tshirts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch t-shirts' });
  }
});

// Get jackets
router.get('/jackets', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('products');
    const jackets = await collection.find({ category: 'jacket' }).toArray();
    res.json(jackets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jackets' });
  }
});

module.exports = router;
