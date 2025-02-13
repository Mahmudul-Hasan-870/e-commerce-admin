const express = require('express');
const { getUsers, updateUser, deleteUser, getTotalUsers, getActiveUsers } = require('../controllers/AuthController');
const { getUserOrders, getTotalRevenue, getOrderStatus, getTotalOrders, updateOrderStatus, addOrder } = require('../controllers/OrderController');
const authenticateToken = require('../middleware/authMiddleware');  // Import the middleware
const { getProducts } = require('../controllers/ProductController');

const router = express.Router();

// Apply middleware to routes that need protection
router.get('/users', authenticateToken, getUsers); 
router.put('/users/:id', authenticateToken, updateUser);
router.delete('/users/:id', authenticateToken, deleteUser);

router.get('/total-users', authenticateToken, getTotalUsers);
router.get('/active-users', authenticateToken, getActiveUsers);
router.get('/total-revenue', authenticateToken, getTotalRevenue);

router.get('/order-status', authenticateToken, getOrderStatus);

// Route for getting Total Orders
router.get('/total-orders', authenticateToken, getTotalOrders);

router.get('/orders', authenticateToken, getUserOrders);

router.patch('/orders/:id/status', authenticateToken, updateOrderStatus);

router.post('/orders/add', authenticateToken, addOrder);

router.get('/products', authenticateToken, getProducts);

module.exports = router;
