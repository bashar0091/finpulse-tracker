import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing for frontend connectivity
app.use(cors());

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Base Health-Check Route to verify API server status
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    message: "FinPulse Backend API Server is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

// Initialize entrypoint listener for the server
app.listen(PORT, () => {
  console.log(`[server]: Server is securely running on port ${PORT}`);
});