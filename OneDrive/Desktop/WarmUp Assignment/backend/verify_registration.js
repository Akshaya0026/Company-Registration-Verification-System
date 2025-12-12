import db from './src/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

async function testRegistration() {
    try {
        console.log("Checking Env Vars...");
        if (!process.env.JWT_SECRET) throw new Error("Missing JWT_SECRET");
        console.log("JWT_SECRET is present.");

        const email = "sim_reg@example.com";
        const password = "password123";

        // Cleanup
        await db.query("DELETE FROM users WHERE email = $1", [email]);

        console.log("Hashing password...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Password hashed.");

        console.log("Inserting user...");
        const newUser = await db.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
            [email, hashedPassword]
        );
        const user = newUser.rows[0];
        console.log("User inserted:", user.id);

        console.log("Signing Token...");
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        console.log("Token generated:", token.substring(0, 10) + "...");

        console.log("Registration Logic Verified.");

        // Cleanup
        await db.query("DELETE FROM users WHERE email = $1", [email]);
        process.exit(0);

    } catch (error) {
        console.error("Registration Logic Failed:", error);
        process.exit(1);
    }
}

testRegistration();
