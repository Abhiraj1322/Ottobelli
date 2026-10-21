const { google } = require("googleapis");

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,

  // Convert escaped \n into actual line breaks
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),

  scopes: [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
  ],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

module.exports = sheets;