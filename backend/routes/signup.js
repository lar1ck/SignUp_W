const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { first_Name, last_Name, email, password } = req.body;

  const sql = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
  const values = [first_Name, last_Name, email, password];

  db.query(sql, values, (err, result) => {
    if (err) {  
      console.error('Database insert error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(201).json({ message: 'User registered successfully!' });
  });
});

module.exports = router;
