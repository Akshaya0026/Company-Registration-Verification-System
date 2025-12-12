// backend/models/userModel.js
import pool from "../db.js"; // adjust path to your db/pool export

export async function getUserById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}
