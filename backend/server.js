import dotenv from 'dotenv';
dotenv.config(); // Must run BEFORE other imports that use process.env

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import brandRoutes from './routes/brands.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import authRoutes from './routes/auth.js';
import carbonRoutes from './routes/carbon.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecohub';
const FRONTEND_URL = process.env.FRONTEND_URL; // e.g. https://yourapp.vercel.app (for CORS in production)

// Allow multiple origins in dev (3000, 3001 when 3000 is in use)
const allowedOrigins = FRONTEND_URL
  ? [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001']
  : true;
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/carbon', carbonRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Error handling middleware (must be after routes)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: err.message || 'Server error' });
});

// Start server so the app runs even without MongoDB (e.g. you'll add Atlas later)
app.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('API endpoints available at http://localhost:' + PORT + '/api');
});

// Connect to MongoDB (non-blocking)
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.log('\n--- To fix: use MongoDB Atlas (free) ---');
    console.log('1. Go to https://www.mongodb.com/cloud/atlas and create a free account.');
    console.log('2. Create a free cluster, add a database user, and allow access from anywhere (0.0.0.0/0).');
    console.log('3. Get your connection string (Connect -> Drivers -> copy URI).');
    console.log('4. In backend folder, create .env with: MONGODB_URI=your_connection_string');
    console.log('5. Run: npm run seed   then restart the server.\n');
    console.log('Note: Server will continue running, but database features will not work until MongoDB is connected.');
  });
