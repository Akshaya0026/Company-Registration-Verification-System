import db from './src/db.js';

async function checkDb() {
    try {
        console.log("Testing DB connection...");
        const res = await db.query('SELECT NOW()');
        console.log("DB Connected:", res.rows[0]);

        console.log("Checking users table...");
        const table = await db.query("SELECT * FROM information_schema.tables WHERE table_name = 'users'");
        if (table.rows.length > 0) {
            console.log("Users table exists.");
        } else {
            console.error("Users table MISSING!");
        }

        console.log("Checking writable...");
        // clean up test user if exists
        await db.query("DELETE FROM users WHERE email='debug_test@example.com'");
        const insert = await db.query("INSERT INTO users (email, password_hash) VALUES ('debug_test@example.com', 'hash') RETURNING id");
        console.log("Insert successful, ID:", insert.rows[0].id);
        await db.query("DELETE FROM users WHERE email='debug_test@example.com'");
        console.log("Delete successful.");

        process.exit(0);
    } catch (error) {
        console.error("DB Verification Failed:", error);
        process.exit(1);
    }
}

checkDb();
