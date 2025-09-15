const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a centralized email transporter configuration
const createTransporter = () => {
  // Validate environment variables
  if (!process.env.EMAIL || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error('EMAIL and EMAIL_APP_PASSWORD must be set in environment variables');
  }

  console.log('📧 Configuring email transporter...');
  console.log('Email user:', process.env.EMAIL);
  console.log('App password length:', process.env.EMAIL_APP_PASSWORD?.length);

  // Clean the app password - remove any spaces or special characters
  const cleanPassword = process.env.EMAIL_APP_PASSWORD.replace(/\s/g, '');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: cleanPassword,
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: true, // Enable debug mode
    logger: true // Enable logging
  });

  // Verify transporter configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email transporter verification failed:', error);
    } else {
      console.log('✅ Email transporter is ready to send messages');
    }
  });

  return transporter;
};

// Function to send email with error handling
const sendEmail = async (mailOptions) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"BEST WISHES" <${process.env.EMAIL}>`,
      ...mailOptions
    });
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

module.exports = {
  createTransporter,
  sendEmail
};