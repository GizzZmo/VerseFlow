import { Request, Response, NextFunction } from "express";

// Example JWT-based authentication middleware
export function authenticate(req: Request, res: Response, next: NextFunction) {
  // In production, verify JWT, check permissions, etc.
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  // TODO: Actually verify the token!
  req.user = { id: "demoUser" };
  next();
}