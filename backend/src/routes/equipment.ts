import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, requireRole, AuthRequest } from "../middleware/auth";
import { filterByRadius } from "../utils/geo";

const router = Router();
const prisma = new PrismaClient();

// GET /api/equipment — list with optional filters
router.get("/", async (req, res): Promise<void> => {
  try {
    const { available, q, ownerId, lat, lon, radius } = req.query as Record<string, string>;

    const where: Record<string, unknown> = {};
    if (available === "true") where.available = true;
    if (available === "false") where.available = false;
    if (ownerId) where.ownerId = ownerId;

    const equipment = await prisma.equipmentListing.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    let filtered = equipment;
    if (q) {
      const lower = q.toLowerCase();
      filtered = equipment.filter(
        (e) =>
          e.name.toLowerCase().includes(lower) ||
          e.type.toLowerCase().includes(lower) ||
          e.location.toLowerCase().includes(lower)
      );
    }

    if (lat && lon) {
      const maxR = radius ? parseFloat(radius) : 15;
      const refLat = parseFloat(lat);
      const refLon = parseFloat(lon);
      filtered = filterByRadius(filtered, refLat, refLon, maxR) as unknown as typeof filtered;
    }

    res.json(
      filtered.map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        description: e.description,
        ratePerDay: e.ratePerDay,
        available: e.available,
        location: e.location,
        image: e.image,
        owner: e.owner.name,
        ownerId: e.ownerId,
        ownerPhone: e.owner.phone,
        createdAt: e.createdAt,
        distance: (e as any).distance,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
});

// GET /api/equipment/:id
router.get("/:id", async (req, res): Promise<void> => {
  try {
    const eq = await prisma.equipmentListing.findUnique({
      where: { id: req.params.id },
      include: { owner: { select: { id: true, name: true, phone: true } } },
    });

    if (!eq) {
      res.status(404).json({ error: "Equipment not found" });
      return;
    }

    res.json({
      id: eq.id,
      name: eq.name,
      type: eq.type,
      description: eq.description,
      ratePerDay: eq.ratePerDay,
      available: eq.available,
      location: eq.location,
      image: eq.image,
      owner: eq.owner.name,
      ownerId: eq.ownerId,
      ownerPhone: eq.owner.phone,
      createdAt: eq.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
});

// POST /api/equipment — equipment_owner creates listing
router.post(
  "/",
  authMiddleware,
  requireRole("equipment_owner"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { name, type, description, ratePerDay, location, image } = req.body;

      if (!name || !type || !description || !ratePerDay || !location) {
        res.status(400).json({ error: "All fields are required" });
        return;
      }

      const eq = await prisma.equipmentListing.create({
        data: {
          name,
          type,
          description,
          ratePerDay: parseFloat(ratePerDay),
          location,
          image: image || "⚙️",
          available: true,
          ownerId: req.user!.id,
        },
      });

      await prisma.activity.create({
        data: {
          userId: req.user!.id,
          type: "equipment_listed",
          message: `Listed new equipment: ${name}`,
        },
      });

      res.status(201).json(eq);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create equipment listing" });
    }
  }
);

// PATCH /api/equipment/:id — equipment_owner updates listing
router.patch(
  "/:id",
  authMiddleware,
  requireRole("equipment_owner"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const eq = await prisma.equipmentListing.findUnique({ where: { id: req.params.id } });
      if (!eq) {
        res.status(404).json({ error: "Equipment not found" });
        return;
      }
      if (eq.ownerId !== req.user!.id) {
        res.status(403).json({ error: "You can only update your own equipment" });
        return;
      }

      const { name, type, description, ratePerDay, location, image, available } = req.body;

      const updated = await prisma.equipmentListing.update({
        where: { id: req.params.id },
        data: {
          ...(name !== undefined && { name }),
          ...(type !== undefined && { type }),
          ...(description !== undefined && { description }),
          ...(ratePerDay !== undefined && { ratePerDay: parseFloat(ratePerDay) }),
          ...(location !== undefined && { location }),
          ...(image !== undefined && { image }),
          ...(available !== undefined && { available }),
        },
      });

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update equipment" });
    }
  }
);

// DELETE /api/equipment/:id
router.delete(
  "/:id",
  authMiddleware,
  requireRole("equipment_owner"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const eq = await prisma.equipmentListing.findUnique({ where: { id: req.params.id } });
      if (!eq) {
        res.status(404).json({ error: "Equipment not found" });
        return;
      }
      if (eq.ownerId !== req.user!.id) {
        res.status(403).json({ error: "You can only delete your own equipment" });
        return;
      }

      await prisma.equipmentListing.delete({ where: { id: req.params.id } });
      res.json({ message: "Equipment deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete equipment" });
    }
  }
);

export { router as equipmentRouter };
