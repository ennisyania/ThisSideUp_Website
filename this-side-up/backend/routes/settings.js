import express from 'express';
import SettingsModel from '../models/settingsModel.js'; // adjust path

const router = express.Router();

// GET current settings
router.get('/', async (req, res) => {
  try {
    let settings = await SettingsModel.findOne({});
    if (!settings) {
      settings = { heroImages: [], announcement: '' }; // defaults
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// POST update settings
router.post('/', async (req, res) => {
  try {
    const { heroImages, announcement } = req.body;
    let settings = await SettingsModel.findOne({});
    if (!settings) {
      settings = new SettingsModel();
    }
    settings.heroImages = heroImages;
    settings.announcement = announcement;
    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;
