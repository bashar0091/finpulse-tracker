import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./db";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Base Health-Check Route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    message: "FinPulse Backend API Server is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route   POST /api/transactions
 * @desc    Create a new financial transaction (Income/Expense)
 * @access  Public (Temporary, pending Auth implementation in Phase 1)
 */
app.post("/api/transactions", async (req: Request, res: Response) => {
  try {
    const { type, amount, category, description, userId } = req.body;

    // Basic Validation
    if (!type || !amount || !category) {
      res.status(400).json({ error: "Type, amount, and category fields are required" });
      return;
    }

    // Insert transaction block via Prisma ORM
    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: parseFloat(amount),
        category,
        description,
        // Since user registration API is pending, we dynamically ensure a fallback relation or require a valid string identifier
        userId: userId || "default-mock-user-id" 
      },
    });

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal Server Error during creation" });
  }
});

/**
 * @route   GET /api/transactions
 * @desc    Retrieve all financial transactions logs from database
 * @access  Public
 */
app.get("/api/transactions", async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        date: "desc" // Order logs starting from newest
      }
    });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal Server Error during data fetching" });
  }
});

/**
 * @route   POST /api/users
 * @desc    Create a new user record for testing relational data integrity
 * @access  Public
 */
app.post("/api/users", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await prisma.user.create({
      data: {
        email,
        password, // In production, this must be hashed using bcrypt/argon2
      },
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal Server Error during user creation" });
  }
});

// Start listening configuration
app.listen(PORT, () => {
  console.log(`[server]: Server is securely running on port ${PORT}`);
});