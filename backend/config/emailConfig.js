const nodemailer = require('nodemailer');
require('dotenv').config();

// Suppress nodemailer debug logs
process.env.NODE_DEBUG = '';

// Create a centralized email transporter configuration
const createTransporter = () => {
  // Validate environment variables
  if (!process.env.EMAIL || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error('EMAIL and EMAIL_APP_PASSWORD must be set in environment variables');
  }

  // Clean the app password - remove any spaces or special characters
  const cleanPassword = process.env.EMAIL_APP_PASSWORD.replace(/\s/g, '');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: cleanPassword,
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: false,
    logger: false
  });

  return transporter;
};

// Function to send email with minimal logging
const sendEmail = async (mailOptions) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"BEST WISHES" <${process.env.EMAIL}>`,
      ...mailOptions
    });
    console.log('✅ Email sent successfully');
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw error;
  }
};

module.exports = {
  createTransporter,
  sendEmail
};