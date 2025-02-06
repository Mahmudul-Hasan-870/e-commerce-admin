const Order = require('../models/Order');

exports.order = async (req, res) => {
    try {
      const { items, delivery_address, delivery_option, payment_status, order_status } = req.body;

      // Validate input
      if (!items || !Array.isArray(items)) return res.status(400).json({ success: false, message: 'Invalid items.' });
      if (!delivery_address || !delivery_option || !payment_status || !order_status) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
      }
  
      // Create the order
      const order = new Order({
        items,
        delivery_address,
        delivery_option,
        payment_status,
        order_status,
        user: req.user._id,  // Associate the order with the authenticated user
      });
  
      await order.save();
  
      res.status(201).json({
        success: true,
        message: 'Order placed successfully.',
        data: order,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

exports.orders = async (req, res) => {
  try {
      const userId = req.user._id;  // Get user ID from the token

      const orders = await Order.find({ user: userId });

      if (orders.length === 0) {
          return res.status(404).json({ success: false, message: 'No orders found for this user.' });
      }

      res.status(200).json({
          success: true,
          message: 'Orders fetched successfully.',
          data: orders,
      });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Backend

exports.getUserOrders = async (req, res) => {
  try {
    // Removed userId reference, fetching all orders instead
    const orders = await Order.find();

    if (!orders.length) {
      return res.status(404).json({ success: false, message: 'No orders found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully.',
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};



  