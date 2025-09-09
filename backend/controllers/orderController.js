const Order = require('../models/Order');

// Get order history for logged-in user
exports.getUserOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images salePrice retailPrice')
      .sort({ orderedAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch order history', error: err.message });
  }
};

// Create order (after successful payment)
exports.createOrder = async (req, res) => {
  try {
    const { items, total, status } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Items are required' });
    }
    if (typeof total !== 'number') {
      return res.status(400).json({ success: false, message: 'Total must be a number' });
    }

    const normalizedItems = items.map((i) => ({
      product: i.productId || i.product || (i.product && i.product._id),
      name: i.name || (i.product && i.product.name) || '',
      price: i.price ?? (i.product && (i.product.salePrice > 0 ? i.product.salePrice : i.product.retailPrice)) ?? 0,
      quantity: i.quantity || 1,
      image: i.image || (i.product && i.product.images && (i.product.images[0]?.url || i.product.images[0])) || ''
    }));

    const order = await Order.create({
      user: req.user._id,
      items: normalizedItems,
      total,
      status: status || 'Processing',
      orderedAt: new Date(),
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create order', error: err.message });
  }
};