const db = require('../config/db');


const getAllUsers = async (req, res) => {
  try {
    const sql = 'SELECT id, first_name, last_name, email FROM users';
    // const [rows] = await db.query('SELECT id, first_name, last_name, email FROM users');
    db.query(sql, (err, result) => {
      if (err) return res.status(500).json({mesage: "Server Error"})
        return res.status(200).json(result);
    })
    // res.json(rows);
  } catch (err) {
    console.error('An error occurred:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers
};
