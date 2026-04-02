import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// GET /api/jobs — list with optional filters
router.get("/", async (req, res): Promise<void> => {
  try {
    const { status, location, q } = req.query as Record<string, string>;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const jobs = await prisma.job.findMany({
      where,
      include: {
        postedBy: { select: { id: true, name: true, email: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Apply text search in-memory (works fine for this scale)
    let filtered = jobs;
    if (q) {
      const lower = q.toLowerCase();
      filtered = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(lower) ||
          j.description.toLowerCase().includes(lower) ||
          j.location.toLowerCase().includes(lower)
      );
    }
    if (location) {
      const lower = location.toLowerCase();
      filtered = filtered.filter((j) => j.location.toLowerCase().includes(lower));
    }

    res.json(
      filtered.map((j) => ({
        id: j.id,
        title: j.title,
        description: j.description,
        location: j.location,
        wages: j.wages,
        duration: j.duration,
        status: j.status,
        postedBy: j.postedBy.name,
        postedById: j.postedById,
        applicants: j._count.applications,
        postedDate: j.createdAt.toISOString().split("T")[0],
        createdAt: j.createdAt,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// GET /api/jobs/:id — single job
router.get("/:id", async (req, res): Promise<void> => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: {
        postedBy: { select: { id: true, name: true, email: true, phone: true } },
        _count: { select: { applications: true } },
      },
    });

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    res.json({
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      wages: job.wages,
      duration: job.duration,
      status: job.status,
      postedBy: job.postedBy,
      applicants: job._count.applications,
      createdAt: job.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

// POST /api/jobs — farmer creates job (Protected)
router.post(
  "/",
  authMiddleware,
  requireRole("farmer"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { title, description, location, wages, duration } = req.body;

      if (!title || !description || !location || !wages || !duration) {
        res.status(400).json({ error: "All fields are required" });
        return;
      }

      const job = await prisma.job.create({
        data: {
          title,
          description,
          location,
          wages: parseFloat(wages),
          duration: parseInt(duration),
          status: "open",
          postedById: req.user!.id,
        },
      });

      // Log activity
      await prisma.activity.create({
        data: {
          userId: req.user!.id,
          type: "job_posted",
          message: `Posted a new job: ${title}`,
        },
      });

      res.status(201).json({
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        wages: job.wages,
        duration: job.duration,
        status: job.status,
        createdAt: job.createdAt,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create job" });
    }
  }
);

// PATCH /api/jobs/:id/status — farmer updates job status (Protected)
router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("farmer"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { status } = req.body;
      const validStatuses = ["open", "in_progress", "completed"];

      if (!validStatuses.includes(status)) {
        res.status(400).json({ error: "Invalid status" });
        return;
      }

      const job = await prisma.job.findUnique({ where: { id: req.params.id } });
      if (!job) {
        res.status(404).json({ error: "Job not found" });
        return;
      }
      if (job.postedById !== req.user!.id) {
        res.status(403).json({ error: "You can only update your own jobs" });
        return;
      }

      const updated = await prisma.job.update({
        where: { id: req.params.id },
        data: { status },
      });

      res.json({ id: updated.id, status: updated.status });
    } catch (err) {
      res.status(500).json({ error: "Failed to update job status" });
    }
  }
);

// DELETE /api/jobs/:id — farmer deletes their job
router.delete(
  "/:id",
  authMiddleware,
  requireRole("farmer"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const job = await prisma.job.findUnique({ where: { id: req.params.id } });
      if (!job) {
        res.status(404).json({ error: "Job not found" });
        return;
      }
      if (job.postedById !== req.user!.id) {
        res.status(403).json({ error: "You can only delete your own jobs" });
        return;
      }

      await prisma.application.deleteMany({ where: { jobId: req.params.id } });
      await prisma.job.delete({ where: { id: req.params.id } });

      res.json({ message: "Job deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete job" });
    }
  }
);

export { router as jobsRouter };
