require('dotenv').config(); // If you're using .envimport React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // Main component that includes Router, Navbar, Routes, etc.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// index.js

const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
app.use(express.json());

// MongoDB connection string (replace password or use dotenv)
const uri = process.env.MONGO_URI || "mongodb+srv://ennisyania:<db_password>@cluster0.1bjdu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function startServer() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");

    const db = client.db("ecommerce"); // You can change this to your actual DB name
    const products = db.collection("products");

    // Example route to get products
    app.get('/products', async (req, res) => {
      const allProducts = await products.find().toArray();
      res.json(allProducts);
    });

    // Example route to add a product
    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      const result = await products.insertOne(newProduct);
      res.status(201).json(result);
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

startServer();
