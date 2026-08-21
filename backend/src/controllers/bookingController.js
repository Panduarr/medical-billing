const { createMeeting } = require("../services/googleCalendarService");
const { sendEmails } = require("../services/emailService");
const { createBooking } = require("../models/bookingModel");

function validate(body) {
  const fields = [
    "name",
    "email",
    "phone",
    "providers",
    "practiceType",
    "softwareType",
    "features",
    "timeline",
    "bookingDate",
    "bookingTime",
    "timezone",
  ];

  for (const field of fields) {
    if (!body[field] || String(body[field]).trim() === "") {
      return `Missing field: ${field}`;
    }
  }

  const email = String(body.email).trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return "Invalid email address";
  }

  return null;
}

async function createBookingController(req, res) {
  try {
    const error = validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const booking = req.body;

    console.log("Booking received:", booking);

    // 1. Create Google Calendar event + Google Meet
    const meeting = await createMeeting(booking);

    if (!meeting.meetUrl) {
      throw new Error(
        "Google Calendar event was created but no Google Meet URL was returned."
      );
    }

    console.log("Google Meet created:", meeting.meetUrl);

    // 2. Save booking in MySQL
    const saved = await createBooking({
      ...booking,
      googleEventId: meeting.eventId,
      meetUrl: meeting.meetUrl,
    });

    console.log("Booking saved. ID:", saved.id);

    // 3. Send email to user and client
    await sendEmails({
      ...booking,
      meetUrl: meeting.meetUrl,
    });

    console.log("Emails sent successfully.");

    // 4. Send response to frontend
    return res.status(201).json({
      success: true,
      id: saved.id,
      message: "Booking confirmed successfully.",
      meetUrl: meeting.meetUrl,
    });
  } catch (error) {
    console.error("BOOKING ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Unable to create booking.",
    });
  }
}

module.exports = {
  createBookingController,
};