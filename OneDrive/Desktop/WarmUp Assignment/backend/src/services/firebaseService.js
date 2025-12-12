import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

const svcPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!svcPath) {
  console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT_PATH not set; Firebase will not be initialized");
} else {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(require(path.resolve(svcPath))),
    });
    console.log("✅ Firebase admin initialized");
  } catch (err) {
    console.error("Firebase init error", err.message || err);
  }
}

export default admin;
