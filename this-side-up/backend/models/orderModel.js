// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, 
    },
    contactEmail: String,
    countryRegion: String,
    firstName: String,
    lastName: String,
    address: String,
    aptSuiteEtc: String,
    postalCode: String,
    phone: String,
    newsAndOffers: Boolean,
    shippingMethod: String,
    discountCode: String,
    appliedDiscount: Number,
    subtotal: Number,
    shippingCost: Number,
    total: Number,
    items: [
        {
            productId: String,
            size: String,
            quantity: Number,
            _id: false
        }
    ],
    placedAt: {
        type: Date,
        default: Date.now
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }
});

module.exports = mongoose.model('Order', orderSchema);
