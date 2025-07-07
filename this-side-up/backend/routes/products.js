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

// Get boardshorts
router.get('/boardshorts', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('products');
    const boardshorts = await collection.find({ category: 'boardshort' }).toArray();
    res.json(boardshorts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch boardshorts' });
  }
});

// Get assecsories
router.get('/accessories', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('products');
    const accessories = await collection.find({ category: 'accessory' }).toArray();
    res.json(accessories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch accessories' });
  }
});

// GET a single product by productId
router.get('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    await client.connect();
    const db = client.db(dbName);
    const product = await db.collection('products').findOne({ productId });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;