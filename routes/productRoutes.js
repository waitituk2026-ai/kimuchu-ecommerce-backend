// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();

const { getProducts, createProduct } = require('../controllers/productController');
const adminAuth = require('../middleware/auth'); // basic auth middleware
const upload = require('../middleware/upload'); // multer/cloudinary middleware

// Public: list products
router.get('/', getProducts);

// Admin: create product (with optional file upload)
router.post('/', adminAuth, upload.single('image'), createProduct);

module.exports = router;
