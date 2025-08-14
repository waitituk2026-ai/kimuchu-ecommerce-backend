// backend/controllers/orderController.js
const Order = require('../models/Order');

// Create an order
const createOrder = async (req, res) => {
  try {
    const { items, total, phone, meta } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item.' });
    }
    if (typeof total !== 'number' || total <= 0) {
      return res.status(400).json({ message: 'Invalid total amount.' });
    }

    const order = new Order({ items, total, phone, meta, isPaid: false });
    await order.save();
    res.status(201).json({ message: 'Order created', orderId: order._id, order });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('getOrders error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Mark order as paid
const markOrderPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isPaid = true;
    order.paidAt = new Date();
    await order.save();

    res.json({ message: 'Order marked as paid', order });
  } catch (error) {
    console.error('markOrderPaid error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrders, markOrderPaid };
