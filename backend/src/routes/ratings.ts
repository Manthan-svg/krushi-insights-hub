import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

router.post("/", authMiddleware as any, async (req: AuthRequest, res: Response) => {
  try {
    const { jobId, workerId, stars, comment } = req.body;
    const farmerId = req.user?.id;

    if (!farmerId) return res.status(401).json({ error: "Unauthorized" });

    // Check if job exists and belongs to farmer
    const job = await (prisma as any).job.findUnique({ where: { id: jobId } });
    if (!job || job.postedById !== farmerId) {
      return res.status(403).json({ error: "Invalid job or unauthorized" });
    }

    // Check if already rated
    const existing = await (prisma as any).rating.findUnique({ where: { jobId } });
    if (existing) {
      return res.status(400).json({ error: "Job already rated" });
    }

    // Create rating
    const rating = await (prisma as any).rating.create({
      data: {
        stars: Number(stars),
        comment,
        jobId,
        farmerId,
        workerId,
      },
    });

    // Update worker average rating in WorkerProfile
    const allRatings = await (prisma as any).rating.findMany({
      where: { workerId },
    });
    
    const avgRating = allRatings.reduce((acc: number, r: { stars: number }) => acc + r.stars, 0) / allRatings.length;

    await (prisma as any).workerProfile.update({
      where: { userId: workerId },
      data: { rating: avgRating },
    });

    res.json(rating);
  } catch (error: any) {
    console.error("Rating Submit Error:", error);
    res.status(500).json({ error: "Failed to submit rating" });
  }
});

export const ratingsRouter = router;
