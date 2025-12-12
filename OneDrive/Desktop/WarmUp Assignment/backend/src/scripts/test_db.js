// scripts/test_db.js
import db from '../db.js';

async function test() {
  try {
    const { rows } = await db.query('SELECT NOW() as now');
    console.log('DB connected, now =', rows[0].now);
    process.exit(0);
  } catch (err) {
    console.error('DB connection failed:', err.message || err);
    process.exit(1);
  }
}

test();
