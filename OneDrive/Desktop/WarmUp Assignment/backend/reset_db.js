import db from './src/db.js';
import fs from 'fs';
import path from 'path';

async function resetDb() {
    try {
        console.log("Dropping tables...");
        await db.query("DROP TABLE IF EXISTS companies CASCADE");
        await db.query("DROP TABLE IF EXISTS users CASCADE");
        console.log("Tables dropped.");

        console.log("Re-applying migrations...");
        const sqlPath = path.join(process.cwd(), "migrations", "001_create_tables.sql");
        const sql = fs.readFileSync(sqlPath, "utf8");
        await db.query(sql);
        console.log("Migrations applied.");

        console.log("Testing Insert...");
        await db.query("INSERT INTO users (email, password_hash) VALUES ('test_reset@example.com', 'hash')");
        console.log("Insert Success!");

        process.exit(0);
    } catch (error) {
        console.error("Reset Failed:", error);
        process.exit(1);
    }
}

resetDb();
