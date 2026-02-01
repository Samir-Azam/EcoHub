import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Product from '../models/Product.js';

dotenv.config();

const categories = [
  { name: 'Food & Beverages', slug: 'food-beverages', description: 'Eco-friendly food and drinks' },
  { name: 'Personal Care', slug: 'personal-care', description: 'Sustainable beauty and hygiene' },
  { name: 'Home & Living', slug: 'home-living', description: 'Eco-conscious home products' },
  { name: 'Fashion', slug: 'fashion', description: 'Ethical and sustainable fashion' },
  { name: 'Cleaning', slug: 'cleaning', description: 'Green cleaning supplies' },
];

const brands = [
  {
    name: 'Patagonia',
    slug: 'patagonia',
    description: 'Outdoor apparel and gear with strong environmental and social commitments.',
    website: 'https://www.patagonia.com',
    sustainabilityPractices: [
      { label: 'Fair Trade', description: 'Uses Fair Trade Certified factories' },
      { label: 'Recycled Materials', description: 'Uses recycled polyester and organic cotton' },
    ],
    packagingTypes: ['Recycled paper', 'Reusable bags'],
    carbonNeutral: true,
    certified: ['B Corp', '1% for the Planet'],
    featured: true,
  },
  {
    name: 'Lush',
    slug: 'lush',
    description: 'Fresh handmade cosmetics with minimal packaging and ethical sourcing.',
    website: 'https://www.lush.com',
    sustainabilityPractices: [
      { label: 'Naked Products', description: 'Many products sold without packaging' },
      { label: 'Recyclable Packaging', description: 'Black pots are 100% recyclable' },
    ],
    packagingTypes: ['Paper bags', 'Recyclable pots', 'Naked (no packaging)'],
    carbonNeutral: false,
    certified: ['Vegan options', 'Cruelty-free'],
    featured: true,
  },
  {
    name: 'Who Gives A Crap',
    slug: 'who-gives-a-crap',
    description: 'Toilet paper and paper towels made from recycled materials. 50% of profits go to building toilets.',
    website: 'https://us.whogivesacrap.org',
    sustainabilityPractices: [
      { label: 'Recycled Paper', description: '100% recycled or bamboo' },
      { label: 'Plastic-Free', description: 'Wrapped in paper, not plastic' },
    ],
    packagingTypes: ['Paper wrap', 'Cardboard'],
    carbonNeutral: true,
    certified: ['B Corp'],
    featured: true,
  },
  {
    name: 'Blueland',
    slug: 'blueland',
    description: 'Cleaning products in reusable bottles with dissolvable tablets. No single-use plastic.',
    website: 'https://www.blueland.com',
    sustainabilityPractices: [
      { label: 'Refill System', description: 'Reusable bottles, tablet refills' },
      { label: 'No Plastic Bottles', description: 'Eliminates single-use plastic' },
    ],
    packagingTypes: ['Compostable', 'Recyclable cardboard'],
    carbonNeutral: false,
    certified: ['Leaping Bunny'],
    featured: true,
  },
  {
    name: 'Package Free Shop',
    slug: 'package-free-shop',
    description: 'Zero-waste lifestyle products. Everything shipped plastic-free.',
    website: 'https://packagefreeshop.com',
    sustainabilityPractices: [
      { label: 'Plastic-Free Shipping', description: 'All shipments are plastic-free' },
      { label: 'Curated Sustainable Brands', description: 'Vetted for sustainability' },
    ],
    packagingTypes: ['Paper', 'Compostable', 'Reusable'],
    carbonNeutral: true,
    certified: ['B Corp'],
    featured: false,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecohub');
  await Category.deleteMany({});
  await Brand.deleteMany({});
  await Product.deleteMany({});

  const catDocs = await Category.insertMany(categories);
  const brandDocs = await Brand.insertMany(brands);

  const foodId = catDocs.find(c => c.slug === 'food-beverages')._id;
  const personalId = catDocs.find(c => c.slug === 'personal-care')._id;
  const homeId = catDocs.find(c => c.slug === 'home-living')._id;
  const fashionId = catDocs.find(c => c.slug === 'fashion')._id;
  const cleaningId = catDocs.find(c => c.slug === 'cleaning')._id;

  const patagoniaId = brandDocs.find(b => b.slug === 'patagonia')._id;
  const lushId = brandDocs.find(b => b.slug === 'lush')._id;
  const wgacId = brandDocs.find(b => b.slug === 'who-gives-a-crap')._id;
  const bluelandId = brandDocs.find(b => b.slug === 'blueland')._id;
  const pfsId = brandDocs.find(b => b.slug === 'package-free-shop')._id;

  const products = [
    { name: 'Organic Cotton T-Shirt', slug: 'patagonia-organic-tshirt', brand: patagoniaId, category: fashionId, packagingType: 'Recycled paper', ecoScore: 9, buyUrl: 'https://www.patagonia.com', featured: true },
    { name: 'Recycled Down Jacket', slug: 'patagonia-recycled-jacket', brand: patagoniaId, category: fashionId, packagingType: 'Recycled paper', ecoScore: 9, buyUrl: 'https://www.patagonia.com', featured: false },
    { name: 'Naked Shampoo Bar', slug: 'lush-naked-shampoo', brand: lushId, category: personalId, packagingType: 'Naked (no packaging)', ecoScore: 10, buyUrl: 'https://www.lush.com', featured: true },
    { name: 'Recycled Toilet Paper 24 Rolls', slug: 'wgac-toilet-paper', brand: wgacId, category: homeId, packagingType: 'Paper wrap', ecoScore: 9, buyUrl: 'https://us.whogivesacrap.org', featured: true },
    { name: 'Clean Up Kit (Tablets + Bottles)', slug: 'blueland-cleanup-kit', brand: bluelandId, category: cleaningId, packagingType: 'Compostable', ecoScore: 9, buyUrl: 'https://www.blueland.com', featured: true },
    { name: 'Bamboo Toothbrush Set', slug: 'package-free-bamboo-brush', brand: pfsId, category: personalId, packagingType: 'Paper', ecoScore: 8, buyUrl: 'https://packagefreeshop.com', featured: false },
  ];

  await Product.insertMany(products);
  console.log('Seed complete: categories, brands, and products added.');
  await mongoose.disconnect();
}

seed().catch(console.error);
