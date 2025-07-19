// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // or true if every order must be linked to a user
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
    cardNumber: String,
    expiryDate: String,
    nameOnCard: String,
    discountCode: String,
    appliedDiscount: Number,
    subtotal: Number,
    shippingCost: Number,
    total: Number,
    items: [
        {
            productId: String,
            size: String
        }
    ],
    placedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
