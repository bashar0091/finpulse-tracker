import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request interface to securely attach authenticated user payload
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Extract Authorization header string
  const authHeader = req.headers["authorization"];
  // Format target: "Bearer TOKEN_STRING"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access denied. Authentication token missing." });
    return;
  }

  try {
    // Verify token validity against runtime environment secret
    const verified = jwt.verify(token, `${process.env.JWT_SECRET}`) as {
      userId: string;
      email: string;
    };
    
    // Bind parsed identity block safely into request pipeline
    req.user = verified;
    next(); // Pass control flow to next handler function
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired session token parsed" });
  }
};