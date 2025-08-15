// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../middleware/upload'); // multer+cloudinary

// Create product (supports multipart/form-data with "image" file, or JSON body with image URL)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const payload = req.body || {};
    // if file was uploaded via multer-storage-cloudinary, multer sets req.file and req.file.path contains URL
    if (req.file && req.file.path) {
      payload.image = req.file.path;
    } else if (req.body && req.body.image) {
      // allow client to pass image URL directly (optional)
      payload.image = req.body.image;
    }

    // convert numeric fields if needed
    if (payload.price) payload.price = Number(payload.price);

    const product = new Product(payload);
    await product.save();

    return res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    console.error('Create product error', err);
    return res.status(500).json({ message: 'Failed to create product', error: err && err.message ? err.message : err });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get products error', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

module.exports = router;
