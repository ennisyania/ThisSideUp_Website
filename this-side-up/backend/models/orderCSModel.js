// models/OrderCS.js
import mongoose from 'mongoose';

const orderCSSchema = new mongoose.Schema({
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

  // Instead of items as product list, store the form data and images
  form: {
    shape: String,
    thickness: String,
    length: Number,
    rockerProfile: String,
    deckChannels: String,
    extraDetails: String,
  },

  images: [
    {
      type: String, // URLs or file paths to the uploaded images
      required: true,
    }
  ],

  placedAt: {
    type: Date,
    default: Date.now,
  },

  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'refunded'],
    default: 'pending',
  },

  paymentIntentId: {
    type: String,
    required: false,
  },
});

const OrderCS = mongoose.model('OrderCS', orderCSSchema);
export default OrderCS;
