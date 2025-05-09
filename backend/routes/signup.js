const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

router.post('/', authController.signup);

module.exports = router;
