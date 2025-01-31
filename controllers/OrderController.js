const Order = require('../models/Order');

exports.store = async (req, res) => {
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
