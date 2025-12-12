import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { validationResult } from 'express-validator';

// Register User
export const register = async (req, res) => {
  // Validate Input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert User
    const newUser = await db.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hashedPassword]
    );

    const user = newUser.rows[0];

    // Generate PWM
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, email: user.email }
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// Login User
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      console.log(`Login Failed: User ${email} not found`);
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const user = userResult.rows[0];

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.log(`Login Failed: Password mismatch for ${email}`);
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      message: 'Login Successful',
      token,
      user: { id: user.id, email: user.email, is_verified: user.is_verified }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get Profile (Protected)
export const getProfile = async (req, res) => {
  try {
    const userResult = await db.query('SELECT id, email, is_verified, role, created_at FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(userResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Change Password
export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, userId]);

    res.json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error("Password Update Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};
