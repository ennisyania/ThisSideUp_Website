import express from 'express';
import OrderCS from '../models/orderCSModel.js';
import requireAuth from '../middlewares/requireAuth.js'; // if you want auth

const router = express.Router();

// POST /api/ordersCS
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      form,
      images,
      contactEmail,
      countryRegion,
      firstName,
      lastName,
      address,
      aptSuiteEtc,
      postalCode,
      phone,
      newsAndOffers,
      shippingMethod,
      discountCode,
      appliedDiscount,
      subtotal,
      shippingCost,
      total,
      paymentIntentId
    } = req.body;

    if (!form || !total || !images || images.length === 0) {
      return res.status(400).json({ message: 'Missing required order data' });
    }

    const newOrderCS = new OrderCS({
      userId: req.user._id,
      form,
      images,
      contactEmail,
      countryRegion,
      firstName,
      lastName,
      address,
      aptSuiteEtc,
      postalCode,
      phone,
      newsAndOffers,
      shippingMethod,
      discountCode,
      appliedDiscount,
      subtotal,
      shippingCost,
      total,
      paymentIntentId,
    });

    await newOrderCS.save();

    res.status(201).json({ message: 'Custom Skimboard order placed successfully' });
  } catch (err) {
    console.error('Error creating custom skimboard order:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;
