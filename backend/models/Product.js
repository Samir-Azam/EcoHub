import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  price: { type: Number },
  currency: { type: String, default: 'USD' },
  buyUrl: { type: String }, // link to brand's product page
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  packagingType: { type: String }, // Paper, Can, Glass, Compostable, etc.
  ecoScore: { type: Number, min: 1, max: 10 }, // 1-10 sustainability score
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
