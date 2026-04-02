import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, requireRole, AuthRequest } from "../middleware/auth";
import { filterByRadius } from "../utils/geo";

const router = Router();
const prisma = new PrismaClient();

// GET /api/workers — list with optional filters
router.get("/", async (req, res): Promise<void> => {
  try {
    const { available, q, lat, lon, radius } = req.query as Record<string, string>;

    const workers = await prisma.user.findMany({
      where: { role: "worker" },
      include: { workerProfile: true },
      orderBy: { createdAt: "desc" },
    });

    let filtered = workers.filter((w) => w.workerProfile !== null);

    if (available === "true") {
      filtered = filtered.filter((w) => w.workerProfile?.available === true);
    }

    if (q) {
      const lower = q.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.name.toLowerCase().includes(lower) ||
          w.workerProfile?.location.toLowerCase().includes(lower) ||
          (w.workerProfile?.skills && JSON.parse(w.workerProfile.skills as string).some(
            (s: string) => s.toLowerCase().includes(lower)
          ))
      );
    }

    if (lat && lon) {
      const maxR = radius ? parseFloat(radius) : 15;
      const refLat = parseFloat(lat);
      const refLon = parseFloat(lon);
      
      if (!isNaN(refLat) && !isNaN(refLon)) {
        // We map the workerProfile lat/lon up to the parent so filterByRadius works
        const flattenData = filtered.map(w => ({ ...w, lat: w.workerProfile?.lat || null, lon: w.workerProfile?.lon || null }));
        filtered = filterByRadius(flattenData, refLat, refLon, maxR) as unknown as typeof filtered;
      }
    }

    res.json(
      filtered.map((w) => ({
        id: w.id,
        name: w.name,
        phone: w.phone,
        location: w.workerProfile?.location || "",
        skills: w.workerProfile ? JSON.parse(w.workerProfile.skills as string) : [],
        experience: w.workerProfile?.experience || 0,
        rating: w.workerProfile?.rating || 0,
        dailyRate: w.workerProfile?.dailyRate || 0,
        available: w.workerProfile?.available ?? true,
        avatar: w.name.split(" ").map((n) => n[0]).join("").toUpperCase(),
        distance: (w as any).distance,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch workers" });
  }
});

// GET /api/workers/:id — single worker profile
router.get("/:id", async (req, res): Promise<void> => {
  try {
    const worker = await prisma.user.findUnique({
      where: { id: req.params.id, role: "worker" },
      include: { workerProfile: true },
    });

    if (!worker || !worker.workerProfile) {
      res.status(404).json({ error: "Worker not found" });
      return;
    }

    res.json({
      id: worker.id,
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      location: worker.workerProfile.location,
      skills: JSON.parse(worker.workerProfile.skills as string),
      experience: worker.workerProfile.experience,
      rating: worker.workerProfile.rating,
      dailyRate: worker.workerProfile.dailyRate,
      available: worker.workerProfile.available,
      avatar: worker.name.split(" ").map((n) => n[0]).join("").toUpperCase(),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch worker" });
  }
});

// PATCH /api/workers/availability — worker toggles their own availability
router.patch(
  "/availability",
  authMiddleware,
  requireRole("worker"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { available } = req.body;

      const profile = await prisma.workerProfile.findUnique({
        where: { userId: req.user!.id },
      });

      if (!profile) {
        res.status(404).json({ error: "Worker profile not found" });
        return;
      }

      const updated = await prisma.workerProfile.update({
        where: { userId: req.user!.id },
        data: { available: available ?? !profile.available },
      });

      res.json({ available: updated.available });
    } catch (err) {
      res.status(500).json({ error: "Failed to update availability" });
    }
  }
);

export { router as workersRouter };
