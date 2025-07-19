// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel'); // Mongoose model

router.post('/', async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = new Order(orderData);
        await newOrder.save();

        res.status(201).json({ message: 'Order saved', orderId: newOrder._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not save order' });
    }
});

module.exports = router;
