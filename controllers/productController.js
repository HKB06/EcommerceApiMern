const Product = require('../models/productModel');

exports.createProduct = async (req, res) => {
  try {
    const doc = await Product.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';

    const query = {
      name: { $regex: search, $options: 'i' }
    };

    const totalDocs = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    const docs = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      currentPage: page,
      totalPages,
      totalDocs,
      docs
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const doc = await Product.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const doc = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const doc = await Product.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
