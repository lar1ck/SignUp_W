const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const protectRoute = require('../middleware/authMiddleware');

router.get('/',protectRoute, getAllUsers);

module.exports = router;
