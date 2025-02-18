const Customer = require('../models/customerModel');

exports.createCustomer = async (req, res) => {
  try {
    const doc = await Customer.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const docs = await Customer.find();
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
