const mysql = require('mysql2');

// Update credentials for your MySQL server
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'social_media'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});

module.exports = db;
