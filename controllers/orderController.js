const Order = require('../models/orderModel');
const Customer = require('../models/customerModel');

exports.createOrder = async (req, res) => {
  try {
    const c = await Customer.findById(req.body.customer);
    if (!c) return res.status(404).json({ error: 'Customer not found' });
    const doc = await Order.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const doc = await Order.findById(req.params.id).populate('customer').populate('products');
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const doc = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const doc = await Order.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createDirectOrder = async (req, res) => {
  try {
    const c = await Customer.findById(req.params.customerId);
    if (!c) return res.status(404).json({ error: 'Customer not found' });
    const doc = await Order.create({
      customer: req.params.customerId,
      products: req.body.products
    });
    res.status(201).json({
      message: 'Order created successfully',
      order: doc
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
