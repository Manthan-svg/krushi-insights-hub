-- AlterTable
ALTER TABLE "EquipmentListing" ADD COLUMN "lat" REAL;
ALTER TABLE "EquipmentListing" ADD COLUMN "lon" REAL;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN "lat" REAL;
ALTER TABLE "Job" ADD COLUMN "lon" REAL;

-- AlterTable
ALTER TABLE "WorkerProfile" ADD COLUMN "lat" REAL;
ALTER TABLE "WorkerProfile" ADD COLUMN "lon" REAL;
