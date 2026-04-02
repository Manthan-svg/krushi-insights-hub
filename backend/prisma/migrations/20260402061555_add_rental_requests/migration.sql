-- CreateTable
CREATE TABLE "RentalRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "startDate" DATETIME,
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    CONSTRAINT "RentalRequest_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "EquipmentListing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RentalRequest_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
