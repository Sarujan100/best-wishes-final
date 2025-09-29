const CollaborativePurchase = require('../models/CollaborativePurchase');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderSummary = require('../models/OrderSummary');
const mongoose = require('mongoose');
const { sendEmail } = require('../config/emailConfig');
const crypto = require('crypto');
require('dotenv').config();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Create collaborative purchase
const createCollaborativePurchase = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found in request' });
    }

    const { productID, productId, quantity, participants, products, isMultiProduct } = req.body;
    
    // Support both productID and productId for backward compatibility
    const finalProductId = productID || productId;

    console.log('Received collaborative purchase request:', {
      productID,
      productId,
      finalProductId,
      quantity,
      participants,
      products,
      isMultiProduct,
      productIdType: typeof finalProductId,
      productIdValid: finalProductId ? mongoose.Types.ObjectId.isValid(finalProductId) : false
    });

    // Handle multi-product vs single product
    if (isMultiProduct && products && Array.isArray(products) && products.length > 0) {
      // Multi-product collaborative purchase
      console.log('Processing multi-product collaborative purchase with', products.length, 'products');
    } else if (finalProductId) {
      // Single product collaborative purchase (legacy)
      if (!mongoose.Types.ObjectId.isValid(finalProductId)) {
        return res.status(400).json({ message: 'Invalid productId format' });
      }
    } else {
      return res.status(400).json({ message: 'Either productId or products array is required' });
    }

    if (!participants || !Array.isArray(participants) || participants.length === 0 || participants.length > 3) {
      return res.status(400).json({ message: 'Participants must be an array with 1-3 emails.' });
    }

    // Validate participant emails
    for (const email of participants) {
      if (typeof email !== 'string' || !email.includes('@') || email.trim() === '') {
        return res.status(400).json({ message: `Invalid participant email: ${email}` });
      }
    }

    let productDetails, totalAmount, shareAmount, collaborativePurchaseData, processedProducts;

    if (isMultiProduct && products && Array.isArray(products) && products.length > 0) {
      // Multi-product collaborative purchase
      console.log('Processing multi-product collaborative purchase');
      
      // Validate all products exist
      const productIds = products.map(p => p.productId || p._id);
      const existingProducts = await Product.find({ _id: { $in: productIds } });
      
      if (existingProducts.length !== products.length) {
        return res.status(404).json({ message: 'One or more products not found' });
      }

      // Calculate total amount for all products
      let subtotal = 0;
      const processedProducts = products.map(item => {
        const product = existingProducts.find(p => p._id.toString() === (item.productId || item._id).toString());
        const productPrice = product.salePrice > 0 ? product.salePrice : product.retailPrice;
        const itemTotal = productPrice * item.quantity;
        subtotal += itemTotal;
        
        return {
          product: product._id,
          productName: product.name,
          productPrice: productPrice,
          quantity: item.quantity,
          image: (product.images && (product.images[0]?.url || product.images[0])) || null
        };
      });

      const shippingCost = 10; // Fixed shipping cost
      totalAmount = subtotal + shippingCost;
      const participantCount = participants.length + 1; // +1 for the creator
      shareAmount = Math.round((totalAmount / participantCount) * 100) / 100;

      collaborativePurchaseData = {
        products: processedProducts,
        isMultiProduct: true,
        totalAmount,
        shareAmount,
        createdBy: req.user._id,
        participants: participants.map(email => ({
          email: email.trim().toLowerCase(),
          paymentLink: generatePaymentLink(),
        })),
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      };

    } else {
      // Single product collaborative purchase (legacy)
      console.log('Processing single product collaborative purchase');
      
      const product = await Product.findById(finalProductId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const productPrice = product.salePrice > 0 ? product.salePrice : product.retailPrice;
      const shippingCost = 10; // Fixed shipping cost
      totalAmount = (productPrice * quantity) + shippingCost;
      const participantCount = participants.length + 1; // +1 for the creator
      shareAmount = Math.round((totalAmount / participantCount) * 100) / 100;

      // Create processedProducts for single product (for email consistency)
      processedProducts = [{
        product: product._id,
        productName: product.name,
        productPrice: productPrice,
        quantity: quantity,
        image: (product.images && (product.images[0]?.url || product.images[0])) || null
      }];

      collaborativePurchaseData = {
        product: finalProductId,
        productName: product.name,
        productPrice: productPrice,
        quantity,
        isMultiProduct: false,
        totalAmount,
        shareAmount,
        createdBy: req.user._id,
        participants: participants.map(email => ({
          email: email.trim().toLowerCase(),
          paymentLink: generatePaymentLink(),
        })),
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      };
    }

    const collaborativePurchase = await CollaborativePurchase.create(collaborativePurchaseData);

    // Send invitation emails to participants
    for (const participant of collaborativePurchaseData.participants) {
      const emailData = {
        shareAmount,
        deadline: collaborativePurchaseData.deadline,
        createdBy: req.user,
        collaborativePurchaseId: collaborativePurchase._id,
      };

      if (isMultiProduct && products && products.length > 0) {
        // Multi-product email data
        console.log('Setting email data for multi-product:', {
          processedProducts: processedProducts,
          processedProductsLength: processedProducts?.length,
          isMultiProduct: true,
          totalAmount: totalAmount
        });
        emailData.products = processedProducts || [];
        emailData.isMultiProduct = true;
        emailData.totalAmount = totalAmount;
      } else {
        // Single product email data (legacy)
        console.log('Setting email data for single product:', {
          productName: collaborativePurchaseData.productName,
          productPrice: collaborativePurchaseData.productPrice,
          totalAmount: totalAmount,
          isMultiProduct: false
        });
        emailData.productName = collaborativePurchaseData.productName;
        emailData.productPrice = collaborativePurchaseData.productPrice;
        emailData.totalAmount = totalAmount;
        emailData.isMultiProduct = false;
        // For single product, set products to undefined explicitly
        emailData.products = undefined;
      }

      await sendInvitationEmail(participant.email, participant.paymentLink, emailData);
    }

    // Send confirmation email to creator
    const creatorEmailData = {
      shareAmount,
      deadline: collaborativePurchaseData.deadline,
      participants: collaborativePurchaseData.participants.map(p => p.email),
      collaborativePurchaseId: collaborativePurchase._id,
    };

    if (isMultiProduct && products && products.length > 0) {
      // Multi-product creator email data
      creatorEmailData.products = processedProducts;
      creatorEmailData.isMultiProduct = true;
      creatorEmailData.totalAmount = totalAmount;
    } else {
      // Single product creator email data (legacy)
      creatorEmailData.productName = collaborativePurchaseData.productName;
      creatorEmailData.productPrice = collaborativePurchaseData.productPrice;
      creatorEmailData.totalAmount = totalAmount;
      creatorEmailData.isMultiProduct = false;
      // For single product, set products to undefined explicitly
      creatorEmailData.products = undefined;
    }

    await sendCreatorConfirmationEmail(req.user.email, creatorEmailData);

    res.status(201).json({ 
      success: true, 
      collaborativePurchase,
      message: 'Collaborative purchase created successfully. Invitations sent to participants.'
    });

  } catch (err) {
    console.error('Error in createCollaborativePurchase:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Get collaborative purchase details
const getCollaborativePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const collaborativePurchase = await CollaborativePurchase.findById(id)
      .populate('product')
      .populate('createdBy', 'firstName lastName email')
      .populate('orderId');

    if (!collaborativePurchase) {
      return res.status(404).json({ message: 'Collaborative purchase not found' });
    }

    res.json({ success: true, collaborativePurchase });
  } catch (err) {
    console.error('Error in getCollaborativePurchase:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Get collaborative purchase by payment link
const getCollaborativePurchaseByPaymentLink = async (req, res) => {
  try {
    const { paymentLink } = req.params;
    const collaborativePurchase = await CollaborativePurchase.findOne({
      'participants.paymentLink': paymentLink
    })
      .populate('product')
      .populate('createdBy', 'firstName lastName email');

    if (!collaborativePurchase) {
      return res.status(404).json({ message: 'Collaborative purchase not found' });
    }

    // Find the specific participant
    const participant = collaborativePurchase.participants.find(p => p.paymentLink === paymentLink);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    res.json({ 
      success: true, 
      collaborativePurchase,
      participant,
      timeRemaining: Math.max(0, collaborativePurchase.deadline - new Date())
    });
  } catch (err) {
    console.error('Error in getCollaborativePurchaseByPaymentLink:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Process payment for a participant
const processPayment = async (req, res) => {
  try {
    const { paymentLink } = req.params;
    const { paymentIntentId, email } = req.body;

    const collaborativePurchase = await CollaborativePurchase.findOne({
      'participants.paymentLink': paymentLink
    });

    if (!collaborativePurchase) {
      return res.status(404).json({ message: 'Collaborative purchase not found' });
    }

    const participant = collaborativePurchase.participants.find(p => p.paymentLink === paymentLink);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    if (participant.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Payment already processed' });
    }

    if (collaborativePurchase.status !== 'pending' && collaborativePurchase.status !== 'completed') {
      return res.status(400).json({ message: 'Collaborative purchase is no longer active' });
    }

    // Check if deadline has passed
    if (new Date() > collaborativePurchase.deadline) {
      collaborativePurchase.status = 'expired';
      await collaborativePurchase.save();
      return res.status(400).json({ message: 'Payment deadline has passed' });
    }

    // Update participant payment status
    participant.paymentStatus = 'paid';
    participant.paidAt = new Date();
    participant.paymentIntentId = paymentIntentId;

    // Check if all participants have paid
    const allPaid = collaborativePurchase.participants.every(p => p.paymentStatus === 'paid');
    
    if (allPaid) {
      // Create the actual order
      const order = await createOrderFromCollaborativePurchase(collaborativePurchase);

      collaborativePurchase.status = 'completed'; // Mark as completed, ready for admin to move to packing

      collaborativePurchase.completedAt = new Date();
      collaborativePurchase.orderId = order._id;
      
      // Send completion notifications
      await sendCompletionNotifications(collaborativePurchase, order);
    }

    await collaborativePurchase.save();

    res.json({ 
      success: true, 
      collaborativePurchase,
      allPaid,
      message: allPaid ? 'All payments completed! Order has been placed.' : 'Payment processed successfully.'
    });

  } catch (err) {
    console.error('Error in processPayment:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Decline participation
const declineParticipation = async (req, res) => {
  try {
    const { paymentLink } = req.params;
    const { email } = req.body;

    const collaborativePurchase = await CollaborativePurchase.findOne({
      'participants.paymentLink': paymentLink
    }).populate('createdBy', 'email firstName lastName');

    if (!collaborativePurchase) {
      return res.status(404).json({ message: 'Collaborative purchase not found' });
    }

    const participant = collaborativePurchase.participants.find(p => p.paymentLink === paymentLink);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    participant.paymentStatus = 'declined';
    collaborativePurchase.status = 'cancelled';
    collaborativePurchase.cancelledAt = new Date();

    await collaborativePurchase.save();

    // Send cancellation notifications
    await sendCancellationNotifications(collaborativePurchase);

    res.json({ 
      success: true, 
      collaborativePurchase,
      message: 'Participation declined. Collaborative purchase cancelled.'
    });

  } catch (err) {
    console.error('Error in declineParticipation:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Get user's collaborative purchases
const getUserCollaborativePurchases = async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email;

    const collaborativePurchases = await CollaborativePurchase.find({
      $or: [
        { createdBy: userId },
        { 'participants.email': userEmail }
      ]
    })
      .populate('product')
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({ success: true, collaborativePurchases });
  } catch (err) {
    console.error('Error in getUserCollaborativePurchases:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Cancel collaborative purchase (creator only)
const cancelCollaborativePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const collaborativePurchase = await CollaborativePurchase.findById(id).populate('createdBy', 'email firstName lastName');
    if (!collaborativePurchase) {
      return res.status(404).json({ message: 'Collaborative purchase not found' });
    }

    if (collaborativePurchase.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only the creator can cancel this collaborative purchase' });
    }

    if (collaborativePurchase.status !== 'pending' && collaborativePurchase.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed or already cancelled purchase' });
    }

    collaborativePurchase.status = 'cancelled';
    collaborativePurchase.cancelledAt = new Date();

    await collaborativePurchase.save();

    // Process refunds for paid participants
    await processRefunds(collaborativePurchase);

    // Send cancellation notifications
    await sendCancellationNotifications(collaborativePurchase);

    res.json({ 
      success: true, 
      collaborativePurchase,
      message: 'Collaborative purchase cancelled. Refunds processed for paid participants.'
    });

  } catch (err) {
    console.error('Error in cancelCollaborativePurchase:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Helper functions
const generatePaymentLink = () => {
  return crypto.randomBytes(32).toString('hex');
};

const createOrderFromCollaborativePurchase = async (collaborativePurchase) => {
  // Prepare items based on whether it's multi-product or single product
  let orderItems = [];
  let subtotal = 0;
  
  if (collaborativePurchase.isMultiProduct && collaborativePurchase.products && collaborativePurchase.products.length > 0) {
    // Multi-product collaborative purchase
    orderItems = collaborativePurchase.products.map(item => {
      const itemTotal = item.productPrice * item.quantity;
      subtotal += itemTotal;
      return {
        product: item.product,
        name: item.productName,
        price: item.productPrice,
        quantity: item.quantity,
        image: item.image
      };
    });
  } else {
    // Single product collaborative purchase
    subtotal = collaborativePurchase.productPrice * collaborativePurchase.quantity;
    orderItems = [{
      product: collaborativePurchase.product,
      name: collaborativePurchase.productName,
      price: collaborativePurchase.productPrice,
      quantity: collaborativePurchase.quantity
    }];
  }
  
  const shippingCost = 10; // Default shipping cost
  const total = subtotal + shippingCost;
  
  const order = await Order.create({
    user: collaborativePurchase.createdBy,
    items: orderItems,
    subtotal: subtotal,
    shippingCost: shippingCost,
    total: total,
    status: 'Processing', // Use correct enum value
    // Remove invalid fields that don't exist in Order model
  });

  return order;
};

const sendInvitationEmail = async (email, paymentLink, data) => {
  const { productName, productPrice, shareAmount, deadline, createdBy, collaborativePurchaseId, products, isMultiProduct, totalAmount } = data;
  
  console.log('sendInvitationEmail received data:', {
    email,
    paymentLink,
    isMultiProduct,
    products: products,
    productsLength: products?.length,
    productName,
    productPrice,
    totalAmount
  });
  
  await sendEmail({
    to: email,
    subject: `🎁 You're Invited to a Collaborative Purchase!`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Collaborative Purchase Invitation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 30px;">
                  <tr>
                    <td align="center">
                      <h2 style="color: #6B46C1; margin: 0 0 20px;">🎁 Collaborative Purchase Invitation</h2>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 16px; color: #333;">
                      <p style="margin: 0 0 10px;">Hi there 👋,</p>
                      <p style="margin: 0 0 10px;">You've been invited by <strong>${createdBy.firstName || createdBy.email}</strong> to participate in a collaborative purchase:</p>
                      ${isMultiProduct && products && products.length > 0 ? `
                        <p style="margin: 0 0 10px;"><strong>${products.length} Products</strong></p>
                        <div style="margin: 0 0 10px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                          ${products.map(item => `
                            <p style="margin: 0 0 5px; font-size: 14px;">• ${item.productName} (Qty: ${item.quantity}) - $${(item.productPrice * item.quantity).toFixed(2)}</p>
                          `).join('')}
                        </div>
                        <p style="margin: 0 0 10px;">Total Price: <strong>$${totalAmount ? totalAmount.toFixed(2) : '0.00'}</strong></p>
                      ` : `
                        <p style="margin: 0 0 10px;"><strong>${productName || 'Product'}</strong></p>
                        <p style="margin: 0 0 10px;">Unit Price: <strong>$${productPrice ? productPrice.toFixed(2) : '0.00'}</strong></p>
                        <p style="margin: 0 0 10px;">Total Price: <strong>$${totalAmount ? totalAmount.toFixed(2) : '0.00'}</strong></p>
                      `}
                      <p style="margin: 0 0 10px;">Your Share: <strong>$${shareAmount.toFixed(2)}</strong></p>
                      <p style="margin: 0 0 20px;">Deadline: <strong>${deadline.toDateString()}</strong></p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 20px 0;">
                          <a href="${process.env.FRONTEND_URL}/collaborative-payment/${paymentLink}"
                         style="background-color: #6B46C1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; display: inline-block;">
                        💳 Pay Your Share
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 14px; color: #555; padding-top: 10px;">
                      <p style="margin: 0;">If you're unable to participate, you can decline the invitation. The purchase will only proceed if all participants pay within the deadline.</p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 30px 0 0;">
                      <hr style="border: none; border-top: 1px solid #eee; width: 100%;" />
                      <p style="color: #999; font-size: 12px; margin-top: 20px;">
                        💜 Best Wishes Team<br/>
                        <a href="${process.env.FRONTEND_URL}" style="color: #6B46C1; text-decoration: none;">Visit Our Platform</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `
  });
};

const sendCreatorConfirmationEmail = async (email, data) => {
  const { productName, productPrice, shareAmount, deadline, participants, collaborativePurchaseId, products, isMultiProduct, totalAmount } = data;
  
  await sendEmail({
    to: email,
    subject: `✅ Collaborative Purchase Created Successfully!`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Collaborative Purchase Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 30px;">
                  <tr>
                    <td align="center">
                      <h2 style="color: #6B46C1; margin: 0 0 20px;">✅ Collaborative Purchase Created</h2>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 16px; color: #333;">
                      <p style="margin: 0 0 10px;">Hello!</p>
                      <p style="margin: 0 0 10px;">Your collaborative purchase has been created successfully:</p>
                      ${isMultiProduct && products && products.length > 0 ? `
                        <p style="margin: 0 0 10px;"><strong>${products.length} Products</strong></p>
                        <div style="margin: 0 0 10px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                          ${products.map(item => `
                            <p style="margin: 0 0 5px; font-size: 14px;">• ${item.productName} (Qty: ${item.quantity}) - $${(item.productPrice * item.quantity).toFixed(2)}</p>
                          `).join('')}
                        </div>
                        <p style="margin: 0 0 10px;">Total Price: <strong>$${totalAmount ? totalAmount.toFixed(2) : '0.00'}</strong></p>
                      ` : `
                        <p style="margin: 0 0 10px;"><strong>${productName || 'Product'}</strong></p>
                        <p style="margin: 0 0 10px;">Unit Price: <strong>$${productPrice ? productPrice.toFixed(2) : '0.00'}</strong></p>
                        <p style="margin: 0 0 10px;">Total Price: <strong>$${totalAmount ? totalAmount.toFixed(2) : '0.00'}</strong></p>
                      `}
                      <p style="margin: 0 0 10px;">Your Share: <strong>$${shareAmount.toFixed(2)}</strong></p>
                      <p style="margin: 0 0 10px;">Participants: <strong>${participants.length + 1}</strong></p>
                      <p style="margin: 0 0 20px;">Deadline: <strong>${deadline.toDateString()}</strong></p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 20px 0;">
                      <a href="${process.env.FRONTEND_URL}/dashboard/collaborative-purchases"
                         style="background-color: #6B46C1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; display: inline-block;">
                        📊 Track Progress
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 14px; color: #555; padding-top: 10px;">
                      <p style="margin: 0;">You can track the progress of your collaborative purchase in your dashboard. All participants have been notified and have 3 days to complete their payments.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `
  });
};

const sendCompletionNotifications = async (collaborativePurchase, order) => {
  try {
    // Send completion email to all participants
    const creatorEmail = collaborativePurchase.createdBy?.email;
    const participantEmails = collaborativePurchase.participants.map(p => p.email).filter(email => email);
    
    const allEmails = creatorEmail ? [creatorEmail, ...participantEmails] : participantEmails;
    
    if (allEmails.length === 0) {
      console.error('No valid email addresses found for completion notifications');
      return;
    }

  for (const email of allEmails) {
    await sendEmail({
      to: email,
      subject: `🎉 Collaborative Purchase Completed!`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Purchase Completed</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9;">
            <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 30px;">
                    <tr>
                      <td align="center">
                        <h2 style="color: #6B46C1; margin: 0 0 20px;">🎉 Purchase Completed!</h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size: 16px; color: #333;">
                        <p style="margin: 0 0 10px;">Great news! All participants have completed their payments.</p>
                        <p style="margin: 0 0 10px;"><strong>${collaborativePurchase.productName}</strong> has been ordered successfully!</p>
                        <p style="margin: 0 0 10px;">Order ID: <strong>${order._id}</strong></p>
                        <p style="margin: 0 0 20px;">Thank you for participating in this collaborative purchase!</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `
    });
  }
  } catch (error) {
    console.error('Error sending completion notifications:', error);
  }
};

const sendCancellationNotifications = async (collaborativePurchase) => {
  try {
    // Send cancellation email to all participants
    const creatorEmail = collaborativePurchase.createdBy?.email;
    const participantEmails = collaborativePurchase.participants.map(p => p.email).filter(email => email);
    
    const allEmails = creatorEmail ? [creatorEmail, ...participantEmails] : participantEmails;
    
    if (allEmails.length === 0) {
      console.error('No valid email addresses found for cancellation notifications');
      return;
    }

    for (const email of allEmails) {
    await sendEmail({
      to: email,
      subject: `❌ Collaborative Purchase Cancelled`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Purchase Cancelled</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9;">
            <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 30px;">
                    <tr>
                      <td align="center">
                        <h2 style="color: #6B46C1; margin: 0 0 20px;">❌ Purchase Cancelled</h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size: 16px; color: #333;">
                        <p style="margin: 0 0 10px;">The collaborative purchase for <strong>${collaborativePurchase.productName}</strong> has been cancelled.</p>
                        <p style="margin: 0 0 10px;">If you had already paid, your refund will be processed within 5-7 business days.</p>
                        <p style="margin: 0 0 20px;">Thank you for your understanding.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `
    });
  }
  } catch (error) {
    console.error('Error sending cancellation notifications:', error);
  }
};

const processRefunds = async (collaborativePurchase) => {
  // This would integrate with your payment processor (Stripe) to process refunds
  // For now, we'll just mark the participants as refunded
  for (const participant of collaborativePurchase.participants) {
    if (participant.paymentStatus === 'paid') {
      participant.paymentStatus = 'refunded';
      participant.refundId = `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }
  
  collaborativePurchase.status = 'refunded';
  await collaborativePurchase.save();
};

// Get all collaborative purchases for admin management
const getAllCollaborativePurchases = async (req, res) => {
  try {
    const collaborativePurchases = await CollaborativePurchase.find({
      status: { $in: ['Processing', 'pending', 'completed', 'packing', 'outfordelivery', 'delivered', 'cancelled', 'refunded'] }
    })
    .populate('createdBy', 'firstName lastName email phone')
    .populate('products.product', 'name sku costPrice retailPrice salePrice stock')
    .populate('product', 'name sku costPrice retailPrice salePrice stock')
    .sort({ createdAt: -1 });

    // Transform data to match frontend expectations
    const transformedPurchases = collaborativePurchases.map(purchase => {
      const items = [];
      
      if (purchase.isMultiProduct && purchase.products && purchase.products.length > 0) {
        // Multi-product purchase
        items.push(...purchase.products.map(prod => ({
          productId: prod.product._id,
          name: prod.productName,
          price: prod.productPrice,
          quantity: prod.quantity,
          image: prod.product?.images?.[0]?.url || prod.image || '',
          stock: prod.product?.stock || 0,
          costPrice: prod.product?.costPrice || 0,
          retailPrice: prod.product?.retailPrice || 0,
          salePrice: prod.product?.salePrice || 0,
          sku: prod.product?.sku || ''
        })));
      } else if (purchase.product) {
        // Single product purchase
        items.push({
          productId: purchase.product._id,
          name: purchase.productName,
          price: purchase.productPrice,
          quantity: purchase.quantity,
          image: purchase.product.images?.[0]?.url || '',
          stock: purchase.product?.stock || 0,
          costPrice: purchase.product?.costPrice || 0,
          retailPrice: purchase.product?.retailPrice || 0,
          salePrice: purchase.product?.salePrice || 0,
          sku: purchase.product?.sku || ''
        });
      }

      return {
        _id: purchase._id,
        user: purchase.createdBy,
        recipientName: `Collaborative Gift (${purchase.participants.length} participants)`,
        recipientPhone: purchase.createdBy?.phone || 'N/A',
        shippingAddress: 'Collaborative Purchase - Multiple Recipients',
        total: purchase.totalAmount,
        status: purchase.status,
        createdAt: purchase.createdAt,
        items: items,
        participants: purchase.participants,
        isCollaborative: true
      };
    });

    res.status(200).json({
      success: true,
      data: transformedPurchases
    });

  } catch (error) {
    console.error('Error fetching collaborative purchases:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching collaborative purchases',
      error: error.message
    });
  }
};

// Start packing process for collaborative purchase
const startPacking = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.startTransaction();
    
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid collaborative purchase ID'
      });
    }

    // Find the collaborative purchase
    const collaborativePurchase = await CollaborativePurchase.findById(id)
      .populate('products.product')
      .populate('product')
      .session(session);

    if (!collaborativePurchase) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Collaborative purchase not found'
      });
    }


    // Check if all participants have paid
    const allParticipantsPaid = collaborativePurchase.participants.every(p => p.paymentStatus === 'paid');
    if (!allParticipantsPaid) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Cannot start packing. Not all participants have paid for this collaborative purchase.'
      });
    }

    // Check if status is pending or completed (ready for packing)
    if (collaborativePurchase.status !== 'pending' && collaborativePurchase.status !== 'completed') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Cannot start packing. Current status: ${collaborativePurchase.status}. Order must be in 'pending' or 'completed' status with all participants paid.`
      });
    }

    // Prepare items to process
    const itemsToProcess = [];
    
    if (collaborativePurchase.isMultiProduct && collaborativePurchase.products && collaborativePurchase.products.length > 0) {
      // Multi-product purchase
      for (const productItem of collaborativePurchase.products) {
        if (!productItem.product) {
          await session.abortTransaction();
          return res.status(404).json({
            success: false,
            message: `Product not found for item: ${productItem.productName}`
          });
        }
        
        itemsToProcess.push({
          productId: productItem.product._id,
          productName: productItem.productName,
          quantity: productItem.quantity,
          productData: productItem.product,
          price: productItem.productPrice
        });
      }
    } else if (collaborativePurchase.product) {
      // Single product purchase
      itemsToProcess.push({
        productId: collaborativePurchase.product._id,
        productName: collaborativePurchase.productName,
        quantity: collaborativePurchase.quantity,
        productData: collaborativePurchase.product,
        price: collaborativePurchase.productPrice
      });
    }

    // Check stock availability for all products
    for (const item of itemsToProcess) {
      const currentStock = item.productData.stock || 0;
      if (currentStock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${item.productName}. Available: ${currentStock}, Required: ${item.quantity}`
        });
      }
    }

    // Process each item: reduce stock and create order summary
    for (const item of itemsToProcess) {
      // Reduce stock
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { session }
      );

      // Calculate profit
      const costPrice = item.productData.costPrice || 0;
      const salePrice = item.productData.salePrice || item.price;
      const profit = salePrice - costPrice;
      const totalProfit = profit * item.quantity;

      // Create order summary entry
      const orderSummary = new OrderSummary({
        giftId: collaborativePurchase._id,
        productSKU: item.productData.sku || 'N/A',
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        costPrice: costPrice,
        retailPrice: item.productData.retailPrice || item.price,
        salePrice: salePrice,
        profit: profit,
        totalProfit: totalProfit,
        orderDate: new Date(),
        status: 'collaborative'
      });

      await orderSummary.save({ session });
    }

    // Update collaborative purchase status to packing
    collaborativePurchase.status = 'packing';
    await collaborativePurchase.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Collaborative purchase moved to packing successfully',
      data: {
        collaborativePurchaseId: collaborativePurchase._id,
        status: 'packing',
        itemsProcessed: itemsToProcess.length
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Error starting packing process:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error processing packing request',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

// Update collaborative purchase status
const updateCollaborativeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, scheduledAt } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid collaborative purchase ID'
      });
    }

    // Map frontend status to backend status
    const statusMapping = {
      'Pending': 'pending',

      'Completed': 'completed',

      'Packing': 'packing', 
      'OutForDelivery': 'outfordelivery',
      'Delivered': 'delivered',
      'Cancelled': 'cancelled'
    };

    const backendStatus = statusMapping[status] || status.toLowerCase();

    const validStatuses = ['pending', 'completed', 'packing', 'outfordelivery', 'delivered', 'cancelled'];

    
    if (!validStatuses.includes(backendStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses are: ' + Object.keys(statusMapping).join(', ')
      });
    }

    const collaborativePurchase = await CollaborativePurchase.findById(id);

    if (!collaborativePurchase) {
      return res.status(404).json({
        success: false,
        message: 'Collaborative purchase not found'
      });
    }

    // Update status
    collaborativePurchase.status = backendStatus;
    
    if (scheduledAt) {
      collaborativePurchase.scheduledAt = scheduledAt;
    }

    if (backendStatus === 'delivered') {
      collaborativePurchase.completedAt = new Date();
    }

    await collaborativePurchase.save();

    res.status(200).json({
      success: true,
      message: 'Collaborative purchase status updated successfully',
      data: {
        collaborativePurchaseId: collaborativePurchase._id,
        status: collaborativePurchase.status,
        scheduledAt: collaborativePurchase.scheduledAt,
        completedAt: collaborativePurchase.completedAt
      }
    });

  } catch (error) {
    console.error('Error updating collaborative purchase status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message
    });
  }
};

const printAllDeliveredCollaborativePurchases = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    // Build query for delivered collaborative purchases
    let query = { status: 'delivered' };

    // Apply date filters if provided
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) {
        query.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        query.createdAt.$lte = new Date(toDate);
      }
    } else {
      // Default: last 2 weeks
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      query.createdAt = { $gte: twoWeeksAgo };
    }

    const collaborativePurchases = await CollaborativePurchase.find(query)
      .populate('createdBy', 'firstName lastName email phone address')
      .populate('products.product', 'name sku')
      .populate('product', 'name sku')
      .sort({ createdAt: -1 });

    // Format collaborative purchases for printing
    const printData = collaborativePurchases.map(purchase => {
      const items = [];

      if (purchase.isMultiProduct && purchase.products && purchase.products.length > 0) {
        // Multi-product purchase
        items.push(...purchase.products.map(prod => ({
          name: prod.productName,
          sku: prod.product?.sku || prod.product?._id?.toString().slice(-6) || 'N/A',
          quantity: prod.quantity,
          price: prod.productPrice,
          subtotal: prod.productPrice * prod.quantity
        })));
      } else if (purchase.product) {
        // Single product purchase
        items.push({
          name: purchase.productName,
          sku: purchase.product?.sku || purchase.product?._id?.toString().slice(-6) || 'N/A',
          quantity: purchase.quantity,
          price: purchase.productPrice,
          subtotal: purchase.productPrice * purchase.quantity
        });
      }

      return {
        orderId: purchase._id.toString().slice(-8).toUpperCase(),
        orderDate: purchase.createdAt,
        status: purchase.status === 'delivered' ? 'Delivered' : purchase.status,

        sender: {
          name: `${purchase.createdBy.firstName} ${purchase.createdBy.lastName}`,
          email: purchase.createdBy.email,
          phone: purchase.createdBy.phone || 'N/A',
          address: purchase.createdBy.address || 'Address not provided'
        },

        receiver: {
          name: `Collaborative Gift (${purchase.participants.length} participants)`,
          phone: purchase.createdBy.phone || 'N/A',
          address: 'Multiple Recipients - Collaborative Purchase'
        },

        orderDetails: {
          items: items,
          total: purchase.totalAmount,
          participants: purchase.participants.length,
          shareAmount: purchase.shareAmount
        },

        delivery: {
          deliveryStaff: 'N/A', // Can be populated if you have delivery staff info
          deliveryStaffPhone: 'N/A',
          packedAt: purchase.packedAt,
          deliveredAt: purchase.deliveredAt
        }
      };
    });

    res.status(200).json({
      success: true,
      message: 'Print data for all delivered collaborative purchases retrieved successfully',
      data: {
        orders: printData,
        totalOrders: printData.length,
        printedAt: new Date(),
        printedBy: req.user ? `${req.user.firstName} ${req.user.lastName}` : 'System',
        dateRange: {
          from: fromDate || 'N/A',
          to: toDate || 'N/A'
        }
      }
    });

  } catch (error) {
    console.error('Error in printAllDeliveredCollaborativePurchases:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve print data for delivered collaborative purchases',
      error: error.message
    });
  }
};

// Print collaborative purchase details (individual)
const printCollaborativePurchaseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const collaborativePurchase = await CollaborativePurchase.findById(id)
      .populate('createdBy', 'firstName lastName email phone address')
      .populate('products.product', 'name sku images')
      .populate('product', 'name sku images');

    if (!collaborativePurchase) {
      return res.status(404).json({
        success: false,
        message: 'Collaborative purchase not found'
      });
    }

    // Format items for printing
    const items = [];

    if (collaborativePurchase.isMultiProduct && collaborativePurchase.products && collaborativePurchase.products.length > 0) {
      // Multi-product purchase
      items.push(...collaborativePurchase.products.map(prod => ({
        name: prod.productName,
        sku: prod.product?.sku || prod.product?._id?.toString().slice(-6) || 'N/A',
        quantity: prod.quantity,
        price: prod.productPrice,
        subtotal: prod.productPrice * prod.quantity,
        image: prod.product?.images?.[0]?.url || '/placeholder.svg'
      })));
    } else if (collaborativePurchase.product) {
      // Single product purchase
      items.push({
        name: collaborativePurchase.productName,
        sku: collaborativePurchase.product?.sku || collaborativePurchase.product?._id?.toString().slice(-6) || 'N/A',
        quantity: collaborativePurchase.quantity,
        price: collaborativePurchase.productPrice,
        subtotal: collaborativePurchase.productPrice * collaborativePurchase.quantity,
        image: collaborativePurchase.product?.images?.[0]?.url || '/placeholder.svg'
      });
    }

    // Format data for printing
    const printData = {
      orderId: collaborativePurchase._id.toString().slice(-8).toUpperCase(),
      orderDate: collaborativePurchase.createdAt,
      status: collaborativePurchase.status,

      // Sender Details (Creator)
      sender: {
        name: `${collaborativePurchase.createdBy.firstName} ${collaborativePurchase.createdBy.lastName}`,
        email: collaborativePurchase.createdBy.email,
        phone: collaborativePurchase.createdBy.phone || 'N/A',
        address: collaborativePurchase.createdBy.address || 'Address not provided'
      },

      // Receiver Details (Collaborative)
      receiver: {
        name: `Collaborative Gift (${collaborativePurchase.participants.length} participants)`,
        phone: collaborativePurchase.createdBy.phone || 'N/A',
        address: 'Multiple Recipients - Collaborative Purchase'
      },

      // Order Details
      orderDetails: {
        costume: collaborativePurchase.costume || 'None',
        suggestions: collaborativePurchase.suggestions || 'None',
        scheduledAt: collaborativePurchase.scheduledAt,
        total: collaborativePurchase.totalAmount,
        shareAmount: collaborativePurchase.shareAmount,
        participants: collaborativePurchase.participants.length,
        items: items
      },

      // Participants payment status
      participants: collaborativePurchase.participants.map(p => ({
        email: p.email,
        paymentStatus: p.paymentStatus,
        amount: collaborativePurchase.shareAmount
      })),

      // Delivery Details
      delivery: {
        deliveryStaff: 'Not assigned', // Can be populated if you have delivery staff info
        deliveryStaffPhone: 'N/A',
        deliveredAt: collaborativePurchase.deliveredAt,
        packedAt: collaborativePurchase.packedAt
      },

      // Print metadata
      printedAt: new Date(),
      printedBy: req.user ? `${req.user.firstName} ${req.user.lastName}` : 'System'
    };

    res.status(200).json({
      success: true,
      message: 'Print data retrieved successfully',
      data: printData
    });

  } catch (error) {
    console.error('Error in printCollaborativePurchaseDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve print data',
      error: error.message
    });
  }
};

// Get collaborative purchases for delivery staff
const getDeliveryCollaborativePurchases = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, query } = req.query;

    console.log('getDeliveryCollaborativePurchases called with:', { page, limit, status, query });

    // Build match criteria for delivery-ready collaborative purchases
    let matchCriteria = {}; // Temporarily remove status filter to debug

    // If a specific status is requested and it matches our delivery status
    if (status && status === 'outfordelivery') {
      matchCriteria.status = status;
    } else {
      // Default to outfordelivery if no status specified
      matchCriteria.status = 'outfordelivery';
    }

    console.log('Match criteria:', matchCriteria);

    // Add search functionality
    if (query) {
      matchCriteria.$or = [
        { 'createdBy.firstName': { $regex: query, $options: 'i' } },
        { 'createdBy.lastName': { $regex: query, $options: 'i' } },
        { 'createdBy.email': { $regex: query, $options: 'i' } }
      ];
    }

    const collaborativePurchases = await CollaborativePurchase.find(matchCriteria)
      .populate('createdBy', 'firstName lastName email phone address')
      .populate('products.product', 'name images salePrice retailPrice')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    console.log('Found collaborative purchases:', collaborativePurchases.length);

    const total = await CollaborativePurchase.countDocuments(matchCriteria);

    console.log('Total count:', total);

    res.status(200).json({
      success: true,
      collaborativeGifts: collaborativePurchases,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching delivery collaborative purchases:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get delivery stats for collaborative purchases
const getDeliveryStats = async (req, res) => {
  try {
    console.log('getDeliveryStats called for collaborative purchases');

    const stats = {
      total: 0,
      pending: 0,
      outForDelivery: 0,
      delivered: 0
    };

    // Count collaborative purchases by status
    const statusCounts = await CollaborativePurchase.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('Status counts:', statusCounts);

    // Process the counts
    statusCounts.forEach(statusCount => {
      switch (statusCount._id) {
        case 'outfordelivery':
          stats.outForDelivery = statusCount.count;
          stats.total += statusCount.count;
          break;
        case 'delivered':
          stats.delivered = statusCount.count;
          stats.total += statusCount.count;
          break;
        case 'pending':
        case 'processing':
          stats.pending += statusCount.count;
          stats.total += statusCount.count;
          break;
        default:
          stats.total += statusCount.count;
      }
    });

    console.log('Final stats:', stats);

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching delivery stats for collaborative purchases:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update delivery status for collaborative purchases
const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, deliveryStaffId } = req.body;

    console.log('updateDeliveryStatus called:', { id, status, notes, deliveryStaffId });

    // Validate status - delivery staff can only update to 'delivered'
    if (status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Delivery staff can only mark orders as delivered'
      });
    }

    const collaborativePurchase = await CollaborativePurchase.findById(id);

    if (!collaborativePurchase) {
      return res.status(404).json({
        success: false,
        message: 'Collaborative purchase not found'
      });
    }

    // Check if the current status allows delivery update
    if (!['outfordelivery', 'shipped'].includes(collaborativePurchase.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order status does not allow delivery update'
      });
    }

    // Update the status and delivery staff ID
    collaborativePurchase.status = status;
    collaborativePurchase.deliveryStaffId = deliveryStaffId || req.user._id;
    collaborativePurchase.deliveredAt = new Date();

    // Add status history
    if (!collaborativePurchase.statusHistory) {
      collaborativePurchase.statusHistory = [];
    }

    collaborativePurchase.statusHistory.push({
      status: status,
      updatedAt: new Date(),
      updatedBy: req.user._id,
      notes: notes || 'Marked as delivered by delivery staff'
    });

    await collaborativePurchase.save();

    res.status(200).json({
      success: true,
      message: 'Collaborative purchase status updated successfully',
      collaborativePurchase
    });

  } catch (error) {
    console.error('Error updating delivery status for collaborative purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createCollaborativePurchase,
  getCollaborativePurchase,
  getCollaborativePurchaseByPaymentLink,
  processPayment,
  declineParticipation,
  getUserCollaborativePurchases,
  cancelCollaborativePurchase,
  getAllCollaborativePurchases,
  startPacking,
  updateCollaborativeStatus,
  printAllDeliveredCollaborativePurchases,
  printCollaborativePurchaseDetails,
  getDeliveryCollaborativePurchases,
  getDeliveryStats,
  updateDeliveryStatus,
};
