const express = require('express');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, addProductPage } = require('../controllers/ProductController');
const upload = require('../config/multerConfig');  // Import multer middleware
const authenticateToken = require('../middleware/authMiddleware');  // Import the middleware


const router = express.Router();

router.post('/', upload.single('image'), createProduct);  // Use multer middleware for file upload
router.get('/', getAllProducts);
router.get('/add', addProductPage);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;

