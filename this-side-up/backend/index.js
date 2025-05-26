require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your real credentials or use .env
const uri = process.env.MONGO_URI || "mongodb+srv://ennisyania:<db_password>@cluster0.1bjdu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function startServer() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");

    const db = client.db("ecommerce");
    const productsCollection = db.collection("products");

    // Sample route
    app.get("/", (req, res) => {
      res.send("🚀 API is working");
    });

    // Get all products
    app.get("/products", async (req, res) => {
      const products = await productsCollection.find().toArray();
      res.json(products);
    });

    // Add a new product
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.status(201).json(result);
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
  }
}

startServer();