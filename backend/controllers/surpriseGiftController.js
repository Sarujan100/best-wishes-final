const SurpriseGift = require('../models/SurpriseGift');

exports.createSurpriseGift = async (req, res) => {
  try {
    const { recipientName, recipientPhone, shippingAddress, costume = 'none', suggestions = '', items, total, scheduledAt } = req.body;
    if (!recipientName || !recipientPhone || !shippingAddress) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Items are required' });
    }
    if (typeof total !== 'number') {
      return res.status(400).json({ success: false, message: 'Total must be a number' });
    }

    const normalizedItems = items.map(i => ({
      product: i.productId || i.product,
      name: i.name,
      price: i.price,
      quantity: i.quantity || 1,
      image: i.image || '',
    }));

    const doc = await SurpriseGift.create({
      user: req.user._id,
      recipientName,
      recipientPhone,
      shippingAddress,
      costume,
      suggestions,
      items: normalizedItems,
      total,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
    });

    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create surprise gift', error: err.message });
  }
};

exports.getMySurpriseGifts = async (req, res) => {
  try {
    const docs = await SurpriseGift.find({ user: req.user._id })
      .populate('items.product', 'name images retailPrice salePrice')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch surprise gifts', error: err.message });
  }
};


