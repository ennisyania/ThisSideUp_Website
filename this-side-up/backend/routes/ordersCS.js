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

// GET /api/ordersCS/myorders
router.get('/myorders', requireAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.user._id;

    const orders = await OrderCS.find({ userId }).sort({ placedAt: -1 }).limit(100);

    const formatted = orders.map(o => ({
      id: o._id.toString(),
      date: o.placedAt.toISOString().slice(0, 10),
      status: o.orderStatus,
      total: `$${(o.total || 0).toFixed(2)}`,
      shape: o.form.shape,
      thickness: o.form.thickness,
      length: o.form.length,
      rockerProfile: o.form.rockerProfile,
      deckChannels: o.form.deckChannels,
      extraDetails: o.form.extraDetails,
      images: o.images,

    }));

    res.json(formatted);
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});




export default router;
