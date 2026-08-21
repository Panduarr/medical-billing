const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const { getOAuthClient } = require("../config/google");

async function getAuthenticatedClient() {
  const tokenPath = path.join(__dirname, "../../token.json");

  if (!fs.existsSync(tokenPath)) {
    throw new Error(
      "Google token not found. Run: npm run google-auth"
    );
  }

  const auth = getOAuthClient();
  const token = JSON.parse(
    fs.readFileSync(tokenPath, "utf8")
  );

  auth.setCredentials(token);

  return auth;
}

async function createMeeting({
  name,
  email,
  phone,
  bookingDate,
  bookingTime,
  timezone,
}) {
  const auth = await getAuthenticatedClient();

  const calendar = google.calendar({
    version: "v3",
    auth,
  });

  const start = `${bookingDate}T${bookingTime}:00`;

  const startDate = new Date(
    new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date(`${bookingDate}T${bookingTime}:00`))
  );

  // For a practical local setup, create the event using the
  // requested local date/time and timezone directly.
  const endDate = new Date(
    new Date(`${bookingDate}T${bookingTime}:00`).getTime() +
      30 * 60 * 1000
  );

  const event = {
    summary: `Medical Software Consultation - ${name}`,
    description:
      `Customer: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n`,
    start: {
      dateTime: start,
      timeZone: timezone,
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: timezone,
    },
    attendees: [
      { email },
    ],
    conferenceData: {
      createRequest: {
        requestId:
          `medical-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`,
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    resource: event,
    conferenceDataVersion: 1,
    sendUpdates: "all",
  });

  const savedEvent = response.data;

  const meetEntry =
    savedEvent.conferenceData?.entryPoints?.find(
      (entry) => entry.entryPointType === "video"
    );

  return {
    eventId: savedEvent.id,
    meetUrl: meetEntry?.uri || null,
    htmlLink: savedEvent.htmlLink || null,
  };
}

module.exports = {
  createMeeting,
};
