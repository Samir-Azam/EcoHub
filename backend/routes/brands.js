import express from 'express';
import Brand from '../models/Brand.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { featured, q } = req.query;
    const filter = {};
    if (featured === 'true') filter.featured = true;
    if (q) filter.$or = [
      { name: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') },
    ];
    const brands = await Brand.find(filter).sort({ featured: -1, name: 1 });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug });
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
