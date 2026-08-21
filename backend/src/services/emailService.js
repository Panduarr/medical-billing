const nodemailer = require("nodemailer");

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

async function sendEmails(booking) {
  const transporter = getTransporter();

  const common =
    `Name: ${booking.name}\n` +
    `Email: ${booking.email}\n` +
    `Phone: ${booking.phone}\n\n` +
    `Providers: ${booking.providers}\n` +
    `Practice: ${booking.practiceType}\n` +
    `Software: ${booking.softwareType}\n` +
    `Features: ${booking.features}\n` +
    `Timeline: ${booking.timeline}\n\n` +
    `Booking: ${booking.bookingDate} ${booking.bookingTime} (${booking.timezone})\n` +
    `Google Meet: ${booking.meetUrl}\n`;

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: booking.email,
    subject: "Your Medical Software Consultation",
    text:
      `Hi ${booking.name},\n\n` +
      `Your consultation has been booked successfully.\n\n` +
      common +
      `\nJoin your meeting: ${booking.meetUrl}\n\nThank you!`,
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: process.env.CLIENT_EMAIL,
    subject: `New Medical Software Booking - ${booking.name}`,
    text:
      `A new customer booking was created.\n\n` +
      common,
  });
}

module.exports = {
  sendEmails,
};
