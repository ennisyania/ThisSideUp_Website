import mongoose from 'mongoose';

const discountCodeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  value: { type: Number, required: true }, // percent off
});

const settingsSchema = new mongoose.Schema({
  heroImages: [{ type: String }],
  announcement: { type: String, default: '' },
  siteDiscount: { type: Number, default: 0 }, // site-wide %
  discountCodes: [discountCodeSchema],
});

const SettingsModel = mongoose.model('Settings', settingsSchema);
export default SettingsModel;
