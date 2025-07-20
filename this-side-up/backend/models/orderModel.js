// models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
      type: String,    
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

const Order = mongoose.model('Order', orderSchema);
export default Order;
