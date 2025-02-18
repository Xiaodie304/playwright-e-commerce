const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();
async function sendMail() {
  let transporter = nodemailer.createTransport({
    service: "gmail", // Gmail SMTP service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const filePath = path.join(__dirname, "../playwright-report.zip");
  const fileName = "playwright-report.zip";
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.MAIL_TO,
    subject: "Playwright Test Report",
    text: "Here is the Playwright test report.",
    attachments: [
      {
        filename: fileName,
        path: filePath,
      },
    ],
  };

  // Gửi email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.log("Error sending email:", error);
  }
}
sendMail();
