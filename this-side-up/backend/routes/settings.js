import express from 'express';
import SettingsModel from '../models/settingsModel.js'; // adjust path
import requireAuth from '../middlewares/requireAuth.js'; // protect endpoints if needed

const router = express.Router();

// GET current homepage + discount settings
router.get('/', async (req, res) => {
  try {
    let settings = await SettingsModel.findOne({});
    if (!settings) {
      settings = { heroImages: [], announcement: '', siteDiscount: 0, discountCodes: [] };
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// POST update homepage content
router.post('/', requireAuth, async (req, res) => {
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

// GET discounts only
router.get('/discounts', async (req, res) => {
  try {
    let settings = await SettingsModel.findOne({});
    if (!settings) {
      return res.json({ siteDiscount: 0, codes: [] });
    }
    res.json({
      siteDiscount: settings.siteDiscount || 0,
      codes: settings.discountCodes || []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch discounts' });
  }
});

// POST update sitewide discount value
router.post('/discounts', requireAuth, async (req, res) => {
  try {
    const { siteDiscount } = req.body;
    let settings = await SettingsModel.findOne({});
    if (!settings) {
      settings = new SettingsModel();
    }
    settings.siteDiscount = siteDiscount;
    await settings.save();
    res.json({ message: 'Sitewide discount saved', siteDiscount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save discount' });
  }
});

// POST add new discount code
router.post('/discount-codes', requireAuth, async (req, res) => {
  try {
    const { code, value } = req.body;
    let settings = await SettingsModel.findOne({});
    if (!settings) {
      settings = new SettingsModel();
    }

    // prevent duplicates
    if (settings.discountCodes.find(c => c.code === code)) {
      return res.status(400).json({ error: 'Code already exists' });
    }

    settings.discountCodes.push({ code, value });
    await settings.save();
    res.json({ message: 'Code added', code, value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add code' });
  }
});

// DELETE remove discount code
router.delete('/discount-codes/:code', requireAuth, async (req, res) => {
  try {
    const { code } = req.params;
    let settings = await SettingsModel.findOne({});
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    settings.discountCodes = settings.discountCodes.filter(c => c.code !== code);
    await settings.save();
    res.json({ message: 'Code removed', code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete code' });
  }
});

export default router;
