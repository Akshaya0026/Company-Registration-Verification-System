/**
 * Initialize firebase-admin using either FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON
 */
const admin = require("firebase-admin");
const fs = require("fs");

if (admin.apps.length === 0) {
  const p = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (p && fs.existsSync(p)) {
    const serviceAccount = require(p);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log("✔ firebase-admin initialized from file");
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      console.log("✔ firebase-admin initialized from env JSON");
    } catch (err) {
      console.warn("Invalid FIREBASE_SERVICE_ACCOUNT_JSON:", err.message);
    }
  } else {
    console.warn("firebase-admin not configured. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON in backend/.env");
  }
}

module.exports = admin;
