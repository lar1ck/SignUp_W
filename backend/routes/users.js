const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  const sql = "SELECT id, first_name, last_name, email FROM users";

  db.query(sql, (err, result) => {
    if (err) {
      console.log("An error occured", err);
      res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

module.exports = router;