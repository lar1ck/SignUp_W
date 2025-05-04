const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const protectRoute = require('../middleware/authMiddleware');

router.get('/', protectRoute, productController.getProducts);
router.get('/search', protectRoute, productController.searchProducts);
router.get('/filter', protectRoute, productController.filterProducts);
router.get('/:id', protectRoute, productController.getProduct);
router.post('/', protectRoute, productController.createProduct);
router.put('/:id', protectRoute, productController.updateProduct);
router.delete('/:id', protectRoute, productController.deleteProduct);

module.exports = router;
