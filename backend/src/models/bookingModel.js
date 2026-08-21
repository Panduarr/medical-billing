const pool = require("../config/db");

async function createBooking(booking) {
  const sql = `
    INSERT INTO bookings
    (
      name, email, phone, providers, practice_type,
      software_type, features, timeline,
      booking_date, booking_time, timezone,
      google_event_id, meet_url
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    booking.name,
    booking.email,
    booking.phone,
    booking.providers,
    booking.practiceType,
    booking.softwareType,
    booking.features,
    booking.timeline,
    booking.bookingDate,
    booking.bookingTime,
    booking.timezone,
    booking.googleEventId,
    booking.meetUrl,
  ];

  const [result] = await pool.execute(sql, values);

  return {
    id: result.insertId,
  };
}

module.exports = {
  createBooking,
};
