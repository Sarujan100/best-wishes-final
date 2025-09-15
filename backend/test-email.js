const { sendEmail } = require('./config/emailConfig');
require('dotenv').config();

async function testEmailConfiguration() {
  console.log('🧪 Testing email configuration...');
  
  try {
    // Test email sending with a simple message
    const result = await sendEmail({
      to: process.env.EMAIL, // Send to self for testing
      subject: 'Email Configuration Test - Best Wishes App',
      text: 'This is a test email to verify the email configuration is working correctly.',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #6a1b9a;">Email Configuration Test</h2>
          <p>This is a test email to verify that the email configuration is working correctly for the Best Wishes application.</p>
          <p><strong>✅ If you receive this email, the configuration is working!</strong></p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Sent at: ${new Date().toISOString()}</p>
        </div>
      `
    });

    console.log('✅ Email configuration test successful!');
    console.log('📧 Message ID:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Email configuration test failed:', error.message);
    return false;
  }
}

// Run the test
testEmailConfiguration()
  .then((success) => {
    if (success) {
      console.log('🎉 Email system is ready to use!');
    } else {
      console.log('🚨 Email system needs attention');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('🚨 Unexpected error:', error);
    process.exit(1);
  });