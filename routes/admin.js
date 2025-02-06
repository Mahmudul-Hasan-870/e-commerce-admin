const express = require('express');
const { getUsers, updateUser, deleteUser, getTotalUsers, getActiveUsers } = require('../controllers/AuthController');
const { getUserOrders } = require('../controllers/OrderController');
const authenticateToken = require('../middleware/authMiddleware');  // Import the middleware

const router = express.Router();

// Apply middleware to routes that need protection
router.get('/users', authenticateToken, getUsers); 
router.put('/users/:id', authenticateToken, updateUser);
router.delete('/users/:id', authenticateToken, deleteUser);

router.get('/total-users', authenticateToken, getTotalUsers);
router.get('/active-users', authenticateToken, getActiveUsers);

router.get('/orders', authenticateToken, getUserOrders);

module.exports = router;
