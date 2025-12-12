import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";
const DAYS = Number(process.env.JWT_EXPIRES_DAYS || 90);

export const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: `${DAYS}d` });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

