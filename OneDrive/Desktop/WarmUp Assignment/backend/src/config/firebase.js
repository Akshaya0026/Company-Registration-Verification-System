import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin
// Expects GOOGLE_APPLICATION_CREDENTIALS in .env pointing to json file
// OR params in .env
if (!admin.apps.length) {
    try {
        // If using a service account file path
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            admin.initializeApp({
                credential: admin.credential.applicationDefault()
            });
        } else {
            // Fallback or specific env vars (User might have set these)
            // For now, we'll try applicationDefault or standard init
            admin.initializeApp();
        }
        console.log("✅ Firebase Admin Initialized");
    } catch (error) {
        console.error("Firebase Admin Init Error:", error);
    }
}

export default admin;
