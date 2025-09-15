// sendEmail.js
const { sendEmail } = require("../config/emailConfig");
require("dotenv").config();

exports.Emailhandler = async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { to, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await sendEmail({
      to,
      subject,
      text,
      html,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Email not sent",
      details: error.message,
    });
  }
};
