const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port : process.env.EMAIL_PORT,
  secure : false,
  auth : {
    user : process.env.EMAIL_USER,
    pass : process.env.EMAIL_PASS
  },
  family : 4
});

// Verify the connection configuration
transporter.verify((error) => {
  if(error){
    console.log("Email server connection failed: ",error);
  } else {
    console.log("Email server is ready ");
  }
});

// Function to send email
const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"FinTrace" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

async function sendRegistrationEmail(userEmail, name) {
  await sendEmail({
    to: userEmail,
    subject: 'Welcome to FinTrace!',
    html: `
      <h2>Welcome to FinTrace, ${name}!</h2>
      <p>Your account has been created successfully.</p>
      <p>You can now create accounts and start making transactions.</p>
      <p>Best regards,<br>The FinTrace Team</p>
    `,
  });
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  await sendEmail({
    to: userEmail,
    subject: 'Transaction Successful!',
    html: `
      <h2>Transaction Successful</h2>
      <p>Hello ${name},</p>
      <p>Your transaction of <strong>₹${amount}</strong> to account <strong>${toAccount}</strong> was completed successfully.</p>
      <p>Best regards,<br>The FinTrace Team</p>
    `,
  });
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
  await sendEmail({
    to: userEmail,
    subject: 'Transaction Failed',
    html: `
      <h2>Transaction Failed</h2>
      <p>Hello ${name},</p>
      <p>Your transaction of <strong>₹${amount}</strong> to account <strong>${toAccount}</strong> failed. Please try again.</p>
      <p>Best regards,<br>The FinTrace Team</p>
    `,
  });
}
  
module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
}