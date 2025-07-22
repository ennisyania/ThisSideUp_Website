import mongoose from 'mongoose';

const heroImageSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  imageUrl: { type: String, required: true },
}, { _id: false }); // Disable auto _id for subdocs

const discountCodeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  value: { type: Number, required: true }, // percent off
});

const settingsSchema = new mongoose.Schema({
  heroImages: [heroImageSchema],
  announcement: { type: String, default: '' },
  siteDiscount: { type: Number, default: 0 }, // site-wide %
  discountCodes: [discountCodeSchema],
});

const SettingsModel = mongoose.model('Settings', settingsSchema);
export default SettingsModel;
