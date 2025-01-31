const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');

router.post('/order', orderController.store);

module.exports = router;
