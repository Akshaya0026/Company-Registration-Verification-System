import db from "../src/db.js";
import bcrypt from "bcrypt";

async function run() {
    try {
        const password = "password";
        const hash = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO users (email, full_name, password)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password`,
            ["test@example.com", "Test User", hash]
        );

        console.log("Test user inserted/updated");
        process.exit(0);
    } catch (err) {
        console.error("Test user seed failed:", err);
        process.exit(1);
    }
}

run();
