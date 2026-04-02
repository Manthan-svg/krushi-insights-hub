import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// POST /api/rentals — Farmer requests equipment
router.post(
  "/",
  authMiddleware,
  requireRole("farmer"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { equipmentId, startDate, endDate } = req.body;

      if (!equipmentId) {
        res.status(400).json({ error: "Equipment ID is required" });
        return;
      }

      // Check if equipment exists and is available
      const eq = await prisma.equipmentListing.findUnique({ where: { id: equipmentId } });
      if (!eq) {
        res.status(404).json({ error: "Equipment not found" });
        return;
      }

      if (!eq.available) {
        res.status(400).json({ error: "Equipment is currently not available for rent" });
        return;
      }

      const rental = await prisma.rentalRequest.create({
        data: {
          equipmentId,
          farmerId: req.user!.id,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          status: "PENDING",
        },
      });

      // Notify owner
      const io = req.app.get("io");
      if (io) {
        io.to(eq.ownerId).emit("notification", {
          title: "New Rental Request",
          message: `${req.user!.name} wants to rent your ${eq.name}`,
        });
      }

      res.status(201).json(rental);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create rental request" });
    }
  }
);

// GET /api/rentals — Get all relevant rentals
router.get("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let rentals;
    
    if (req.user!.role === "farmer") {
      // Farmer sees outgoing requests
      rentals = await prisma.rentalRequest.findMany({
        where: { farmerId: req.user!.id },
        include: { equipment: true },
        orderBy: { createdAt: "desc" },
      });
    } else if (req.user!.role === "equipment_owner") {
      // Owner sees incoming requests for their equipment
      rentals = await prisma.rentalRequest.findMany({
        where: { equipment: { ownerId: req.user!.id } },
        include: { equipment: true, farmer: { select: { name: true, phone: true } } },
        orderBy: { createdAt: "desc" },
      });
    } else {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    res.json(rentals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch rentals" });
  }
});

// PATCH /api/rentals/:id — Equipment Owner approves/rejects
router.patch(
  "/:id",
  authMiddleware,
  requireRole("equipment_owner"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { status } = req.body;
      const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
      
      if (!validStatuses.includes(status)) {
        res.status(400).json({ error: "Invalid status" });
        return;
      }

      const rental = await prisma.rentalRequest.findUnique({
        where: { id: req.params.id as string },
        include: { equipment: true },
      });

      if (!rental) {
        res.status(404).json({ error: "Rental request not found" });
        return;
      }

      if (rental.equipment.ownerId !== req.user!.id) {
        res.status(403).json({ error: "Not authorized to update this rental" });
        return;
      }

      // Update rental status
      const updatedRental = await prisma.rentalRequest.update({
        where: { id: req.params.id as string },
        data: { status },
      });

      // If approved, mark equipment as unavailable
      if (status === "APPROVED") {
        await prisma.equipmentListing.update({
          where: { id: rental.equipmentId },
          data: { available: false },
        });
      }

      const io = req.app.get("io");
      if (io) {
        io.to(rental.farmerId).emit("notification", {
          title: "Rental Update",
          message: `Your rental request for "${rental.equipment.name}" was ${status}`,
        });
      }

      // If rejected and it was previously approved, mark available again?
      // (Optional simple workflow, skip for now unless requested)

      res.json(updatedRental);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update rental status" });
    }
  }
);

export { router as rentalsRouter };
