import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// GET /api/activity — current user's activity feed
router.get(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const activities = await prisma.activity.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: "desc" },
        take: 30,
      });

      res.json(
        activities.map((a) => ({
          id: a.id,
          type: a.type,
          message: a.message,
          createdAt: a.createdAt,
          // Relative time string computed server-side
          timeAgo: getTimeAgo(a.createdAt),
        }))
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch activity" });
    }
  }
);

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

// GET /api/activity/stats — aggregate statistics for farmers
router.get(
  "/stats",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;

      // 1. Jobs Stats
      const totalJobs = await (prisma as any).job.count({ where: { postedById: userId } });
      const activeJobs = await (prisma as any).job.count({ where: { postedById: userId, status: "open" } });
      const completedJobsCount = await (prisma as any).job.count({ where: { postedById: userId, status: "completed" } });

      // 2. Workers Hired (Accepted Applications)
      const workersHired = await (prisma as any).application.count({
        where: { job: { postedById: userId }, status: "accepted" },
      });

      // 3. Equipment Rentals
      const approvedRentals = await (prisma as any).rentalRequest.findMany({
        where: { farmerId: userId, status: "APPROVED" },
        include: { equipment: true },
      });
      const equipmentRentalsCount = approvedRentals.length;
      
      let totalRentalSpend = 0;
      approvedRentals.forEach((r: any) => {
        const start = r.startDate ? new Date(r.startDate) : new Date();
        const end = r.endDate ? new Date(r.endDate) : new Date();
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        totalRentalSpend += r.equipment.ratePerDay * diffDays;
      });

      // 4. Total Wages Spend (for accepted jobs)
      const acceptedJobs = await (prisma as any).job.findMany({
        where: { 
          postedById: userId,
          applications: { some: { status: "accepted" } }
        },
      });
      const totalWagesSpend = acceptedJobs.reduce((acc: number, j: any) => acc + (j.wages * j.duration), 0);

      // 5. Money Saved (Estimated 18% vs middlemen)
      const moneySaved = Math.round((totalWagesSpend + totalRentalSpend) * 0.18);

      res.json({
        totalJobs,
        activeJobs,
        completedJobs: completedJobsCount,
        workersHired,
        equipmentRentals: equipmentRentalsCount,
        rentalSpend: totalRentalSpend,
        wagesSpend: totalWagesSpend,
        moneySaved,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  }
);

export { router as activityRouter };
