const express = require('express');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, addProductPage } = require('../controllers/ProductController');

const router = express.Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/add', addProductPage)
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
