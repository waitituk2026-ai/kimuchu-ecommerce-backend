// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder, getOrders, markOrderPaid } = require('../controllers/orderController');
const adminAuth = require('../middleware/auth');

// POST /api/orders  -> create an order (public - customer checkout)
router.post('/', createOrder);

// GET /api/orders  -> list orders (ADMIN only)
router.get('/', adminAuth, getOrders);

// PATCH /api/orders/:id/pay -> mark paid (ADMIN only)
router.patch('/:id/pay', adminAuth, markOrderPaid);

module.exports = router;
