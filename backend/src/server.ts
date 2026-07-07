import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authenticateToken, AuthenticatedRequest } from "./auth";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing
app.use(cors({ origin: "*" }));

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
 * @desc    Create a new transaction bound dynamically to the authenticated session user
 * @access  Protected (Requires Bearer Token)
 */
app.post("/api/transactions", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type, amount, category, description } = req.body;
    
    // Extract validated user identity securely from middleware injection
    const userId = req.user?.userId;

    if (!type || !amount || !category || !userId) {
      res.status(400).json({ error: "Type, amount, and category fields are required" });
      return;
    }

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: parseFloat(amount),
        category,
        description,
        userId: userId // Securely mapped relationship block
      },
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal Server Error during creation" });
  }
});

/**
 * @route   GET /api/transactions
 * @desc    Retrieve only the transactions belonging exclusively to the logged-in user
 * @access  Protected (Requires Bearer Token)
 */
app.get("/api/transactions", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized access vector" });
      return;
    }

    // Dynamic database lookup querying logs specific to current session scope
    const transactions = await prisma.transaction.findMany({
      where: { userId: userId },
      orderBy: { date: "desc" }
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
 * @route   DELETE /api/transactions/:id
 * @desc    Delete a specific transaction securely if it belongs to the authenticated user
 * @access  Protected (Requires Bearer Token)
 */
app.delete("/api/transactions/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // এখানে id কে explicitly string হিসেবে কাস্ট করে নিলাম
    const id = req.params.id as string;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized access vector" });
      return;
    }

    // 1. Verify that the transaction exists and belongs exclusively to this user
    // FIXED: id: id as string
    const transaction = await prisma.transaction.findUnique({
      where: { id: id },
    });

    if (!transaction) {
      res.status(404).json({ error: "Transaction record not found" });
      return;
    }

    if (transaction.userId !== userId) {
      res.status(403).json({ error: "Forbidden. You do not own this financial log." });
      return;
    }

    // 2. Perform safe cascade deletion
    // FIXED: id: id as string
    await prisma.transaction.delete({
      where: { id: id },
    });

    res.status(200).json({
      success: true,
      message: "Transaction purged securely from registry",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal Server Error during deletion pipeline" });
  }
});

/**
 * @route   POST /api/users
 * @desc    Register a new user with hashed credentials and return session token
 * @access  Public
 */
app.post("/api/users", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Validation Check
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required fields" });
      return;
    }

    // 2. Check if user already exists in Neon PostgreSQL
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "A user with this email identifier already exists" });
      return;
    }

    // 3. Hash the plain text password securely using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Create user record inside database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // 5. Generate a secure JSON Web Token (JWT) for the session
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      `${process.env.JWT_SECRET}`,
      { expiresIn: "7d" } // Token valid for 7 days validation cycle
    );

    res.status(201).json({
      success: true,
      message: "User account established securely",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal Server Error during user registration" });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user credentials, verify hash, and return JWT session token
 * @access  Public
 */
app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // 1. Fetch user from database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials parsed" });
      return;
    }

    // 2. Compare incoming password with the stored secure hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials parsed" });
      return;
    }

    // 3. Generate token upon successful match validation
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      `${process.env.JWT_SECRET}`,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal Server Error during authentication" });
  }
});

// Start listening configuration
app.listen(PORT, () => {
  console.log(`[server]: Server is securely running on port ${PORT}`);
});