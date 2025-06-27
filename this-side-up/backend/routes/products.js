require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = 'ThisSideUp';

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

module.exports = router;
