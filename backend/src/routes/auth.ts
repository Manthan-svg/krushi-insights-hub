import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

const generateToken = (user: { id: string; email: string; role: string; name: string }) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET as string,
    { expiresIn: "30d" }
  );
};

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !role) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const validRoles = ["farmer", "worker", "equipment_owner"];
    if (!validRoles.includes(role)) {
      res.status(400).json({ error: "Invalid role. Must be farmer, worker, or equipment_owner" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    // Check existing
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, phone, password: hashedPassword, role },
    });

    // Create role-specific profile
    if (role === "worker") {
      await prisma.workerProfile.create({
        data: {
          userId: user.id,
          skills: JSON.stringify([]),
          experience: 0,
          rating: 0,
          dailyRate: 0,
          available: true,
          location: "",
        },
      });
    }

    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: "account_created",
        message: `Welcome to KrushiShetra, ${name}!`,
      },
    });

    const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (err: any) {
    console.error("Register error:", {
      message: err.message,
      code: err.code,
      meta: err.meta,
      stack: err.stack,
    });
    res.status(500).json({ error: "Registration failed: " + (err.message || "Unknown error") });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// GET /api/auth/me — Protected
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export { router as authRouter };
