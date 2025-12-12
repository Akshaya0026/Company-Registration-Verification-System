import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

// ⭐ PUT YOUR EXACT .env PATH HERE ⭐
dotenv.config({
  path: path.resolve("C:/Users/DELL/OneDrive/Desktop/WarmUp Assignment/backend/.env")
});

console.log("Loaded secret:", process.env.JWT_SECRET || "(empty)");

const secret = process.env.JWT_SECRET;

if (!secret) {
  console.error("❌ ERROR: JWT_SECRET is missing. Check .env path");
  process.exit(1);
}

const token = jwt.sign({ id: 1 }, secret, { expiresIn: "7d" });
console.log("Generated token:\n", token);
