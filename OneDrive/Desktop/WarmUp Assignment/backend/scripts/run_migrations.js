import fs from "fs";
import path from "path";
import db from "../src/db.js";

async function run() {
    try {
        const sqlPath = path.join(process.cwd(), "migrations", "001_create_tables.sql");
        const sql = fs.readFileSync(sqlPath, "utf8");

        await db.query(sql);
        console.log("Migrations applied successfully!");

        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

run();
