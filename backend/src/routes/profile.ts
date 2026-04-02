import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// GET /api/profile — full profile for current user
router.get(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        include: {
          workerProfile: true,
          equipmentItems: true,
          postedJobs: {
            select: { id: true, title: true, status: true, createdAt: true },
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const base = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      };

      if (user.role === "worker" && user.workerProfile) {
        res.json({
          ...base,
          workerProfile: {
            skills: JSON.parse(user.workerProfile.skills as string),
            experience: user.workerProfile.experience,
            rating: user.workerProfile.rating,
            dailyRate: user.workerProfile.dailyRate,
            available: user.workerProfile.available,
            location: user.workerProfile.location,
          },
        });
      } else if (user.role === "farmer") {
        res.json({
          ...base,
          recentJobs: user.postedJobs,
        });
      } else if (user.role === "equipment_owner") {
        res.json({
          ...base,
          equipmentCount: user.equipmentItems.length,
          availableCount: user.equipmentItems.filter((e) => e.available).length,
        });
      } else {
        res.json(base);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  }
);

// PATCH /api/profile — update profile
router.patch(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { name, phone, skills, dailyRate, experience, location, available } = req.body;

      // Update user base info
      const updated = await prisma.user.update({
        where: { id: req.user!.id },
        data: {
          ...(name && { name }),
          ...(phone && { phone }),
        },
        select: { id: true, name: true, email: true, phone: true, role: true },
      });

      // Update worker-specific profile fields
      if (req.user!.role === "worker") {
        await prisma.workerProfile.update({
          where: { userId: req.user!.id },
          data: {
            ...(skills !== undefined && { skills: JSON.stringify(skills) }),
            ...(dailyRate !== undefined && { dailyRate: parseFloat(dailyRate) }),
            ...(experience !== undefined && { experience: parseInt(experience) }),
            ...(location !== undefined && { location }),
            ...(available !== undefined && { available }),
          },
        });
      }

      res.json({ message: "Profile updated", user: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
);

export { router as profileRouter };
