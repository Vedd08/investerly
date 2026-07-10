const transporter = require("../config/mailer");

const sendEmail = async ({ to, subject, html, replyTo }) => {
  return transporter.sendMail({
    from: `"Company Website" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
    replyTo
  });
};

module.exports = sendEmail;
