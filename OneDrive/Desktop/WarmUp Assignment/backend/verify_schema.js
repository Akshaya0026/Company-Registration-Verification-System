import db from './src/db.js';

async function checkDb() {
    try {
        console.log("Testing DB connection...");
        const res = await db.query('SELECT NOW()');
        console.log("DB Connected.");

        console.log("Checking schema for 'users':");
        const columns = await db.query(`
            SELECT column_name, data_type, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'users'
        `);
        console.table(columns.rows);

        if (columns.rows.length === 0) {
            console.error("Users table appears to be missing columns or does not exist.");
        } else {
            // Try check UUID
            console.log("Checking UUID extension...");
            try {
                await db.query('SELECT uuid_generate_v4()');
                console.log("UUID extension working.");
            } catch (e) {
                console.error("UUID extension NOT working:", e.message);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error("DB Verification Failed:", error);
        process.exit(1);
    }
}

checkDb();
