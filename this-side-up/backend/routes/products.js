import dotenv from 'dotenv';
import express from 'express';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

dotenv.config();

const router = express.Router();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = 'ThisSideUp';


// Helper function to get collection
export async function getCollection() {
  if (!client.isConnected?.()) {
    await client.connect();
  }
  const db = client.db(dbName);
  return db.collection('products');
}

// Get all products
router.get('/all', async (req, res) => {
  try {
    const collection = await getCollection();
    const allProducts = await collection.find({}).toArray();
    res.json(allProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});


// Get skimboards
router.get('/skimboards', async (req, res) => {
  try {
    const collection = await getCollection();
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
    const collection = await getCollection();
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
    const collection = await getCollection();
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
    const collection = await getCollection();
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
    const collection = await getCollection();
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
    const collection = await getCollection();
    const product = await collection.findOne({ productId });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    category,
    description,
    sizes,
    price,
    quantities,
    imageurl,
    details = [],      // <-- add details here
  } = req.body;

  // Basic validation example
  if (!name || !category || !description || !Array.isArray(sizes) || !Array.isArray(price) || !Array.isArray(quantities) || !Array.isArray(details)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    const collection = await getCollection();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        name,
        category,
        description,
        sizes,
        price,
        quantities,
        imageurl,
        details,       // <-- include details in update
      },
    };

    const result = await collection.updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});


import { nanoid } from 'nanoid'; // for generating unique productId strings (install with `npm i nanoid`)

router.post('/', async (req, res) => {
  const {
    name,
    category,
    description,
    sizes,
    price,
    quantities,
    imageurl,
    details = [], // optional details field you mentioned
  } = req.body;

  if (!name || !category || !description || !Array.isArray(sizes) || !Array.isArray(price) || !Array.isArray(quantities)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    const collection = await getCollection();

    // Generate a unique productId, e.g., 'bs001' or any custom scheme
    // Here, using nanoid for simplicity
    const productId = nanoid(6);

    const newProduct = {
      productId,
      name,
      category,
      description,
      sizes,
      price,
      quantities,
      imageurl,
      details,
    };

    const result = await collection.insertOne(newProduct);

    res.status(201).json({ message: 'Product created', productId: newProduct.productId, _id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});


export default router;
