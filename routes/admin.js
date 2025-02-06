const express = require('express');
const { getUsers, updateUser, deleteUser, getTotalUsers, getActiveUsers } = require('../controllers/AuthController');
const { getUserOrders } = require('../controllers/OrderController');

const router = express.Router();

router.get('/users', getUsers); 
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/total-users', getTotalUsers);
router.get('/active-users', getActiveUsers);

router.get('/orders', getUserOrders);


module.exports = router;
