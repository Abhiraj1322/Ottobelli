const { google } = require("googleapis");

const privateKey = process.env.GOOGLE_PRIVATE_KEY
  ?.replace(/^"|"$/g, "")
  .replace(/\\n/g, "\n");

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: privateKey,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
  ],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

module.exports = sheets;