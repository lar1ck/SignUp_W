const Product = require('../models/productModel');

exports.getProducts = (req, res) => {
  Product.getAll((err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to get products', error: err.message });
    res.json(results);
  });
};

exports.getProduct = (req, res) => {
  Product.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching product', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(results[0]);
  });
};

exports.createProduct = (req, res) => {
  Product.create(req.body, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to create product', error: err.message });
    res.status(201).json(results[0]);
  });
};

exports.updateProduct = (req, res) => {
  Product.update(req.params.id, req.body, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to update product', error: err.message });
    res.json(results[0]);
  });
};

exports.deleteProduct = (req, res) => {
  Product.delete(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to delete product', error: err.message });
    res.json(results[0]);
  });
};

exports.searchProducts = (req, res) => {
  const { q } = req.query;
  Product.search(q, (err, results) => {
    if (err) return res.status(500).json({ message: 'Search failed', error: err.message });
    res.json(results);
  });
};

exports.filterProducts = (req, res) => {
  const { category } = req.query;
  Product.filterByCategory(category, (err, results) => {
    if (err) return res.status(500).json({ message: 'Filtering failed', error: err.message });
    res.json(results);
  });
};
