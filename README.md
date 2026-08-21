# Medical Quote Booking — Next.js + Tailwind + Node.js + Express + MySQL + Google Calendar/Meet

## Architecture

Next.js/React + Tailwind
        |
        | POST /api/booking
        v
Node.js + Express
        |
        +--> MySQL (save questionnaire + booking)
        |
        +--> Google OAuth 2.0
        |       |
        |       +--> Google Calendar API
        |               |
        |               +--> Create event
        |                       |
        |                       +--> Google Meet conference
        |
        +--> Nodemailer
                |
                +--> User confirmation
                +--> Client notification

## 1. Database

Create:
CREATE DATABASE medical_quotes;

Then run:
backend/sql/schema.sql

## 2. Google Cloud

Create a Google Cloud project.

Enable:
- Google Calendar API

Create OAuth 2.0 Client ID:
- Application type: Desktop app

Download the OAuth client JSON and place it at:
backend/credentials/credentials.json

Run:
cd backend
npm install
npm run google-auth

A browser will open. Sign in to the Google account whose Calendar will create the meetings.
Approve Calendar permissions.

The script creates:
backend/token.json

Do not commit credentials.json or token.json.

For production, use a secure secret store instead of local token files.

## 3. Backend

Copy .env.example to .env and configure:
- MySQL
- client email
- SMTP email
- Google Calendar ID (usually primary)

Install:
cd backend
npm install

Run:
npm run dev

Backend:
http://localhost:5000

## 4. Frontend

Copy the frontend folder or use the included one.

Install:
cd frontend
npm install

In frontend/.env.local:
NEXT_PUBLIC_API_URL=http://localhost:5000

Run:
npm run dev

Frontend:
http://localhost:3000

## 5. Booking flow

1. User answers questionnaire.
2. User enters name/email/phone.
3. User selects date/time.
4. React POSTs to /api/booking.
5. Node validates the request.
6. Node creates Google Calendar event.
7. Google Calendar creates a Google Meet conference.
8. Node stores the booking and Meet URL in MySQL.
9. Node sends confirmation email to the user.
10. Node sends lead/booking email to the client.
11. React displays the Meet URL.

## Google Meet

This project creates a new Meet conference for each successful booking.

Use a real future date/time in the user's intended timezone. The backend currently expects:
bookingDate = YYYY-MM-DD
bookingTime = HH:mm
timezone = e.g. Asia/Kolkata

## OAuth note

The included `google-auth` script is intended for local development. For production deployment, use a secure OAuth flow/refresh-token strategy appropriate for your hosting environment. Never expose the OAuth client secret or refresh token in the browser.
