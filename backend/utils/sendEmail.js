const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"Auth App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html
    });
  } catch (err) {
    console.error('Failed to send email:', err && err.message ? err.message : err);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;
