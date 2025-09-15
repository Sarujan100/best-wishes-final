// sendEmail.js
const { sendEmail } = require("../config/emailConfig");
require("dotenv").config(); // Ensure .env variables are loaded

exports.Emailhandler = async function (req, res) {
  console.log("Email handler called with method:", req.method);
  console.log("Request body:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { to, subject, text, html } = req.body;
  console.log("Email parameters:", { to, subject, hasText: !!text, hasHtml: !!html });

  if (!to || !subject || (!text && !html)) {
    console.log("Missing required fields");
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    console.log("Sending email with centralized config...");

    const result = await sendEmail({
      to,
      subject,
      text,
      html,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Detailed email send error:", error);
    return res.status(500).json({
      success: false,
      error: "Email not sent",
      details: error.message,
    });
  }
};
