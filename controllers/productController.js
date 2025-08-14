// backend/controllers/productController.js
const Product = require('../models/Product');
const util = require('util');

// Get all products
async function getProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('getProducts error:', util.inspect(err, { depth: 4 }));
    res.status(500).json({ message: 'Failed to fetch products', error: String(err) });
  }
}

// Create a product (supports file upload via multer-storage-cloudinary)
async function createProduct(req, res) {
  try {
    const { name, price, description, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    // Multer-storage-cloudinary typically sets uploaded file URL in req.file.path
    // but we defensively check several common properties.
    let imageUrl = '';
    if (req.file) {
      // req.file may be an object with different shapes depending on storage
      imageUrl = req.file.path || req.file.secure_url || req.file.url || req.file.location || '';
    }

    const product = new Product({
      name,
      price: Number(price),
      description,
      category,
      image: imageUrl
    });

    await product.save();

    // Return predictable shape: { message, product }
    return res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    // Print a full, readable error in the server terminal
    console.error('createProduct error:', util.inspect(err, { depth: 6 }));
    // Return a simple JSON error to the client
    const message = (err && err.message) ? err.message : 'Internal server error';
    return res.status(500).json({ message: message });
  }
}

module.exports = { getProducts, createProduct };
