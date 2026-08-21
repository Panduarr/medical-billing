const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
];

function getOAuthClient() {
  const credentialsPath = path.join(
    __dirname,
    "../../credentials/credentials.json"
  );

  if (!fs.existsSync(credentialsPath)) {
    throw new Error(
      "Google OAuth credentials not found. Put credentials.json in backend/credentials/"
    );
  }

  const credentials = JSON.parse(
    fs.readFileSync(credentialsPath, "utf8")
  );

  const installed =
    credentials.installed || credentials.web;

  if (!installed) {
    throw new Error(
      "Invalid Google OAuth credentials.json"
    );
  }

  const redirectUri =
    "http://localhost:3000/oauth2callback";

  return new google.auth.OAuth2(
    installed.client_id,
    installed.client_secret,
    redirectUri
  );
}

function getScopes() {
  return SCOPES;
}

module.exports = {
  getOAuthClient,
  getScopes,
};