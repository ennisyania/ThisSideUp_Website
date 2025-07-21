import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  heroImages: [
    {
      id: Number,
      imageUrl: String,
      _id: false,
    },
  ],
  announcement: String,
});

const SettingsModel = mongoose.model('Settings', SettingsSchema);

export default SettingsModel;
