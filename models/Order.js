// backend/models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String },
  name: String,
  price: Number,
  qty: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  total: { type: Number, required: true },
  phone: { type: String },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  meta: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
