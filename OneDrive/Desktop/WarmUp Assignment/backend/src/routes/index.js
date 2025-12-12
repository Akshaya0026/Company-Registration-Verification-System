// src/routes/index.js (ESM)
import express from "express";
const router = express.Router();

// Use .js extension on imported route files
import authRoutes from "./authRoutes.js";
import companyRoutes from "./companyRoutes.js";

router.use("/auth", authRoutes);
router.use("/companies", companyRoutes);

export default router;
