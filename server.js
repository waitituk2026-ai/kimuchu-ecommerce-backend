// backend/server.js
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const util = require('util');
const cors = require('cors');

dotenv.config();

// connectDB - keep your existing DB connector if present
let connectDB = () => {};
try {
  connectDB = require('./config/db');
  connectDB();
} catch (e) {
  console.warn('No ./config/db found or failed to load — continuing without DB (useful for local static testing).');
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routers (ensure these files exist)
try {
  const productRoutes = require('./routes/productRoutes');
  app.use('/api/products', productRoutes);
} catch (e) {
  console.warn('Product routes not found or failed to load:', e.message || e);
}
try {
  const orderRoutes = require('./routes/orderRoutes');
  app.use('/api/orders', orderRoutes);
} catch (e) {
  // optional
}

// Serve /admin and /store as static sites if those folders exist relative to backend
// Expect repo layout: /my-ecommerce-store/backend  and  /my-ecommerce-store/frontend
const adminStatic = path.join(__dirname, '..', 'frontend', 'admin');
const storeStatic = path.join(__dirname, '..', 'frontend', 'store');

// If deploy includes frontend under backend (monorepo), these will serve. If not, you can copy files (commands below).
if (require('fs').existsSync(adminStatic)) {
  app.use('/admin', express.static(adminStatic));
  console.log('✅ Serving admin static from', adminStatic);
} else {
  console.warn('⚠️ Admin static folder not found at', adminStatic);
}

if (require('fs').existsSync(storeStatic)) {
  app.use('/store', express.static(storeStatic));
  console.log('✅ Serving store static from', storeStatic);
} else {
  console.warn('⚠️ Store static folder not found at', storeStatic);
}

// Root / route for health
app.get('/', (req, res) => {
  res.send('API + static server alive');
});

// Prevent noisy favicon 404s
app.get('/favicon.ico', (req, res) => {
  const iconPath = path.join(__dirname, '..', 'frontend', 'store', 'favicon.png');
  if (require('fs').existsSync(iconPath)) return res.sendFile(iconPath);
  return res.status(204).end();
});

// Catch-all handler for single page admin/store routes (so direct urls work)
app.get(['/admin/*','/store/*'], (req, res, next) => {
  const url = req.path;
  if (url.startsWith('/admin/')) {
    const file = path.join(adminStatic, url.replace(/^\/admin\//,'')); // maps /admin/products.html -> admin/products.html
    if (require('fs').existsSync(file)) return res.sendFile(file);
  } else if (url.startsWith('/store/')) {
    const file = path.join(storeStatic, url.replace(/^\/store\//,'')); // maps /store/index.html -> store/index.html
    if (require('fs').existsSync(file)) return res.sendFile(file);
  }
  return next();
});

// Global error handler
app.use((err, req, res, next) => {
  try { console.error('Unhandled error:', util.inspect(err, { depth: 3 })); } catch {}
  if (res.headersSent) return next(err);
  res.status(500).json({ message: err && err.message ? err.message : 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} (port ${PORT})`);
});
