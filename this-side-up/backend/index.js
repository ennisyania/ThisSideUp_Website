const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

app.use(cors());

// Connect to MongoDB once and reuse the client
async function startServer() {
  try {
    await client.connect();
    console.log('Connected to MongoDB!');
    db = client.db('ThisSideUp'); // explicitly specify your database name

    // Helper function to create routes for each collection
    function createCategoryRoutes(categoryName) {
      // Get all items in category
      app.get(`/${categoryName}`, async (req, res) => {
        try {
          const items = await db.collection(categoryName).find().toArray();
          res.json(items);
        } catch (err) {
          res.status(500).json({ error: `Failed to fetch ${categoryName}` });
        }
      });

      // Get item by ID in category
      app.get(`/${categoryName}/:id`, async (req, res) => {
        try {
          const item = await db.collection(categoryName).findOne({ id: req.params.id });
          if (!item) return res.status(404).json({ error: `${categoryName} item not found` });
          res.json(item);
        } catch (err) {
          res.status(500).json({ error: `Failed to fetch ${categoryName} item` });
        }
      });
    }

    // Create routes for all categories
    const categories = ['boardshorts', 'jackets', 'accessories', 'skimboards', 'tshirts'];
    categories.forEach(createCategoryRoutes);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Connection error:', err);
  }
}

startServer();
