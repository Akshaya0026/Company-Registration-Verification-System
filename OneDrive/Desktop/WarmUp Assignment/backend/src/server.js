// src/server.js
import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import morgan from "morgan";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => res.send("OK"));
app.use("/api", routes);
app.use(errorHandler);
export default app;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
    const listener = app.listen(PORT, HOST, () => {
        console.log(`Server running on http://localhost:${PORT} (bound to ${HOST})`);
    });

    listener.on("error", (err) => {
        console.error("Server failed to start:", err && err.message ? err.message : err);
        process.exit(1);
    });
}
  
// --- added health check (auto-inserted) ---
app.get('/api/health', (req, res) => res.json({ ok: true }));
// --- end health check ---
