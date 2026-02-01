import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, brand, packaging, featured, q, limit = 50 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (packaging) filter.packagingType = new RegExp(packaging, 'i');
    if (featured === 'true') filter.featured = true;
    if (q) filter.$or = [
      { name: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') },
      { tags: new RegExp(q, 'i') },
    ];
    const products = await Product.find(filter)
      .populate('brand', 'name slug logo website')
      .populate('category', 'name slug')
      .sort({ featured: -1, ecoScore: -1 })
      .limit(Number(limit));
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('brand')
      .populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
