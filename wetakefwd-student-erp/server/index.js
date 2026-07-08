import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import "./db.js"; // ensures the database is created/seeded on startup

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API
app.use("/api", authRoutes);
app.use("/api", studentRoutes);

// Frontend (static files in /public)
app.use(express.static(path.join(__dirname, "..", "public")));

app.listen(PORT, () => {
  console.log(`\n  WeTakeFwd Student ERP running`);
  console.log(`  Open  http://localhost:${PORT}\n`);
  console.log(`  Demo login  ->  username: priya   password: priya123\n`);
});
