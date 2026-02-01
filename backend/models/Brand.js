import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  logo: { type: String },
  website: { type: String },
  sustainabilityPractices: [{
    label: String,
    description: String,
  }],
  packagingTypes: [{ type: String }], // e.g. "Paper bags", "Recyclable cans", "Compostable"
  carbonNeutral: { type: Boolean, default: false },
  certified: [{ type: String }], // e.g. "B Corp", "Fair Trade"
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Brand', brandSchema);
