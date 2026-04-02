import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// POST /api/applications — worker applies to a job
router.post(
  "/",
  authMiddleware,
  requireRole("worker"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { jobId } = req.body;

      if (!jobId) {
        res.status(400).json({ error: "jobId is required" });
        return;
      }

      // Check job exists and is open
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) {
        res.status(404).json({ error: "Job not found" });
        return;
      }
      if (job.status !== "open") {
        res.status(400).json({ error: "This job is no longer accepting applications" });
        return;
      }

      // Check duplicate application
      const existing = await prisma.application.findUnique({
        where: { jobId_workerId: { jobId, workerId: req.user!.id } },
      });
      if (existing) {
        res.status(409).json({ error: "You have already applied to this job" });
        return;
      }

      const application = await prisma.application.create({
        data: { jobId, workerId: req.user!.id, status: "pending" },
      });

      // Log activity for worker
      await prisma.activity.create({
        data: {
          userId: req.user!.id,
          type: "job_applied",
          message: `Applied to ${job.title}`,
        },
      });

      // Log activity for farmer
      await prisma.activity.create({
        data: {
          userId: job.postedById,
          type: "new_applicant",
          message: `${req.user!.name} applied to your job: ${job.title}`,
        },
      });

      // Emit socket event to farmer
      const io = req.app.get("io");
      if (io) {
        io.to(job.postedById).emit("notification", {
          title: "New Job Application",
          message: `${req.user!.name} applied to "${job.title}"`,
        });
      }

      res.status(201).json({
        id: application.id,
        jobId: application.jobId,
        workerId: application.workerId,
        status: application.status,
        appliedAt: application.appliedAt,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to submit application" });
    }
  }
);

// GET /api/applications/my — current user's applications (role-aware)
router.get(
  "/my",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (req.user!.role === "worker") {
        // Worker sees their own applications
        const applications = await prisma.application.findMany({
          where: { workerId: req.user!.id },
          include: {
            job: {
              include: { postedBy: { select: { name: true } } },
            },
          },
          orderBy: { appliedAt: "desc" },
        });

        res.json(
          applications.map((a) => ({
            id: a.id,
            status: a.status,
            appliedAt: a.appliedAt,
            job: {
              id: a.job.id,
              title: a.job.title,
              location: a.job.location,
              wages: a.job.wages,
              duration: a.job.duration,
              postedBy: a.job.postedBy.name,
            },
          }))
        );
      } else if (req.user!.role === "farmer") {
        // Farmer sees applications on their posted jobs
        const applications = await prisma.application.findMany({
          where: { job: { postedById: req.user!.id } },
          include: {
            job: true,
            worker: {
              include: { workerProfile: true },
            },
          },
          orderBy: { appliedAt: "desc" },
        });

        res.json(
          applications.map((a) => ({
            id: a.id,
            status: a.status,
            appliedAt: a.appliedAt,
            job: { id: a.job.id, title: a.job.title },
            worker: {
              id: a.worker.id,
              name: a.worker.name,
              phone: a.worker.phone,
              skills: a.worker.workerProfile
                ? JSON.parse(a.worker.workerProfile.skills as string)
                : [],
              dailyRate: a.worker.workerProfile?.dailyRate || 0,
              experience: a.worker.workerProfile?.experience || 0,
              rating: a.worker.workerProfile?.rating || 0,
            },
          }))
        );
      } else {
        res.json([]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  }
);

// PATCH /api/applications/:id — farmer accepts/rejects application
router.patch(
  "/:id",
  authMiddleware,
  requireRole("farmer"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { status } = req.body;
      const validStatuses = ["accepted", "rejected"];

      if (!validStatuses.includes(status)) {
        res.status(400).json({ error: "Status must be accepted or rejected" });
        return;
      }

      const application = await prisma.application.findUnique({
        where: { id: req.params.id as string },
        include: { job: true, worker: { select: { id: true, name: true } } },
      });

      if (!application) {
        res.status(404).json({ error: "Application not found" });
        return;
      }
      if (application.job.postedById !== req.user!.id) {
        res.status(403).json({ error: "You can only manage applications for your own jobs" });
        return;
      }

      const updated = await prisma.application.update({
        where: { id: req.params.id as string },
        data: { status },
      });

      // Notify worker
      await prisma.activity.create({
        data: {
          userId: application.workerId,
          type: status === "accepted" ? "application_accepted" : "application_rejected",
          message: `Your application for "${application.job.title}" was ${status}`,
        },
      });

      // Emit socket event to worker
      const io = req.app.get("io");
      if (io) {
        io.to(application.workerId).emit("notification", {
          title: "Application Update",
          message: `Your application for "${application.job.title}" was ${status}`,
        });
      }

      res.json({ id: updated.id, status: updated.status });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update application" });
    }
  }
);

export { router as applicationsRouter };
