const db = require('../config/db');

const Product = {
  getAll: (callback) => {
    db.query('SELECT * FROM products ORDER BY date_added DESC', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM products WHERE id = ?', [id], callback);
  },

  create: (data, callback) => {
    const { name, image_url, category, price, quantity, expiration_date } = data;
    db.query(`
      INSERT INTO products (name, image_url, category, price, quantity, expiration_date)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [name, image_url, category, price, quantity, expiration_date],
      callback
    );
  },

  update: (id, data, callback) => {
    const { name, image_url, category, price, quantity, expiration_date } = data;
    db.query(`
      UPDATE products SET 
        name = ?, 
        image_url = ?, 
        category = ?, 
        price = ?, 
        quantity = ?, 
        expiration_date = ?, 
        date_modified = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [name, image_url, category, price, quantity, expiration_date, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM products WHERE id = ?', [id], callback);
  },

  search: (term, callback) => {
    db.query('SELECT * FROM products WHERE name LIKE ?', [`%${term}%`], callback);
  },

  filterByCategory: (category, callback) => {
    db.query('SELECT * FROM products WHERE category = ?', [category], callback);
  },
};

module.exports = Product;
