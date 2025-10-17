const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmail = async (to, subject, text, html = null) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"MediBook" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(" Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error(" Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendEmail };
