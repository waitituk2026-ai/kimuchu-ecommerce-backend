// backend/server.js
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const util = require('util');
const cors = require('cors');

dotenv.config();
const connectDB = require('./config/db'); // your DB connect file
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// admin basic-auth (if present)
let adminAuth = (req, res, next) => next();
try { adminAuth = require('./middleware/auth'); } catch (e) { /* ignore if missing */ }

// Serve admin static with auth
const adminPath = path.join(__dirname, '..', 'frontend', 'admin');
app.use('/admin', adminAuth, express.static(adminPath));

// Serve store static for convenience (so backend can serve some store assets if needed)
const storePath = path.join(__dirname, '..', 'frontend', 'store');
app.use('/store', express.static(storePath));

// Serve favicon request for backend origin
// Will return frontend/store/favicon.png if it exists
app.get('/favicon.ico', (req, res) => {
  const faviconPath = path.join(__dirname, '..', 'frontend', 'store', 'favicon.png');
  res.sendFile(faviconPath, (err) => {
    if (err) {
      // If the file is missing, just return 204 No Content to silence browser logs
      console.error('favicon sendFile error:', util.inspect(err, { depth: 2 }));
      return res.status(204).end();
    }
  });
});

// load API route files
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// simple health
app.get('/', (req, res) => res.send('API is alive'));

// global error logger
app.use((err, req, res, next) => {
  try { console.error('Unhandled error:', util.inspect(err, { depth: 6 })); } catch (e) {}
  if (res.headersSent) return next(err);
  res.status(500).json({ message: err && err.message ? err.message : 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
