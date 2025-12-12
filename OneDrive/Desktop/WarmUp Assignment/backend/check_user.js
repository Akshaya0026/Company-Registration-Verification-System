import db from './src/db.js';

async function checkUser() {
    try {
        const email = 'test@example.com';
        console.log(`Checking for user: ${email}`);
        const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (res.rows.length === 0) {
            console.log("User NOT FOUND in database.");
        } else {
            console.log("User FOUND.");
            console.log("ID:", res.rows[0].id);
            console.log("Password Hash:", res.rows[0].password_hash.substring(0, 10) + "...");
        }
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkUser();
