import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { jobsRouter } from "./routes/jobs";
import { workersRouter } from "./routes/workers";
import { equipmentRouter } from "./routes/equipment";
import { applicationsRouter } from "./routes/applications";
import { activityRouter } from "./routes/activity";
import { profileRouter } from "./routes/profile";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "KrushiShetra API", version: "1.0.0" });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/workers", workersRouter);
app.use("/api/equipment", equipmentRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/activity", activityRouter);
app.use("/api/profile", profileRouter);

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🌾 KrushiShetra API running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
