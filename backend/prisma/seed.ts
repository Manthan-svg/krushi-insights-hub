import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.activity.deleteMany();
  await prisma.application.deleteMany();
  await prisma.rentalRequest.deleteMany();
  await prisma.job.deleteMany();
  await prisma.equipmentListing.deleteMany();
  await prisma.workerProfile.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("Test@123", 10);

  // --- Create Farmers ---
  const farmer1 = await prisma.user.create({
    data: {
      name: "Rajesh Patil",
      email: "rajesh.patil@krushi.com",
      phone: "9876543210",
      password: hashedPassword,
      role: "farmer",
    },
  });

  const farmer2 = await prisma.user.create({
    data: {
      name: "Sunil More",
      email: "sunil.more@krushi.com",
      phone: "9123456780",
      password: hashedPassword,
      role: "farmer",
    },
  });

  // --- Create Workers ---
  const worker1 = await prisma.user.create({
    data: {
      name: "Ganesh Shinde",
      email: "ganesh.shinde@krushi.com",
      phone: "9988776655",
      password: hashedPassword,
      role: "worker",
    },
  });

  const worker2 = await prisma.user.create({
    data: {
      name: "Ramesh Pawar",
      email: "ramesh.pawar@krushi.com",
      phone: "9977665544",
      password: hashedPassword,
      role: "worker",
    },
  });

  const worker3 = await prisma.user.create({
    data: {
      name: "Manoj Gaikwad",
      email: "manoj.gaikwad@krushi.com",
      phone: "9966554433",
      password: hashedPassword,
      role: "worker",
    },
  });

  // --- Create Equipment Owners ---
  const eqOwner1 = await prisma.user.create({
    data: {
      name: "Ashok Farms",
      email: "ashok.farms@krushi.com",
      phone: "9855443322",
      password: hashedPassword,
      role: "equipment_owner",
    },
  });

  const eqOwner2 = await prisma.user.create({
    data: {
      name: "Singh Equipment",
      email: "singh.equipment@krushi.com",
      phone: "9844332211",
      password: hashedPassword,
      role: "equipment_owner",
    },
  });

  // --- Create Worker Profiles ---
  await prisma.workerProfile.create({
    data: {
      userId: worker1.id,
      skills: JSON.stringify(["Harvesting", "Sowing", "Spraying"]),
      experience: 8,
      rating: 4.5,
      dailyRate: 500,
      available: true,
      location: "Pune",
      lat: 18.5204,
      lon: 73.8567,
    },
  });

  await prisma.workerProfile.create({
    data: {
      userId: worker2.id,
      skills: JSON.stringify(["Tractor Driving", "Ploughing"]),
      experience: 12,
      rating: 4.8,
      dailyRate: 700,
      available: true,
      location: "Nashik",
      lat: 19.9975,
      lon: 73.7898,
    },
  });

  await prisma.workerProfile.create({
    data: {
      userId: worker3.id,
      skills: JSON.stringify(["Spraying", "Fertilizing", "Sowing"]),
      experience: 6,
      rating: 4.6,
      dailyRate: 450,
      available: true,
      location: "Kolhapur",
      lat: 16.7050,
      lon: 74.2433,
    },
  });

  // --- Create Jobs ---
  const job1 = await prisma.job.create({
    data: {
      title: "Rice Harvesting Help",
      description: "Need 5 workers for rice harvesting in 10-acre field",
      location: "Pune, Maharashtra",
      wages: 500,
      duration: 7,
      status: "open",
      postedById: farmer1.id,
      lat: 18.5204,
      lon: 73.8567,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: "Sugarcane Cutting",
      description: "Experienced workers needed for sugarcane cutting",
      location: "Kolhapur, Maharashtra",
      wages: 600,
      duration: 14,
      status: "open",
      postedById: farmer1.id,
      lat: 16.7050,
      lon: 74.2433,
    },
  });

  await prisma.job.create({
    data: {
      title: "Wheat Sowing Workers",
      description: "Workers needed for wheat sowing season",
      location: "Nashik, Maharashtra",
      wages: 450,
      duration: 5,
      status: "in_progress",
      postedById: farmer2.id,
    },
  });

  await prisma.job.create({
    data: {
      title: "Cotton Picking",
      description: "Seasonal cotton picking workers required",
      location: "Nagpur, Maharashtra",
      wages: 400,
      duration: 21,
      status: "open",
      postedById: farmer2.id,
    },
  });

  await prisma.job.create({
    data: {
      title: "Orchard Maintenance",
      description: "Help needed for mango orchard pruning and maintenance",
      location: "Ratnagiri, Maharashtra",
      wages: 550,
      duration: 10,
      status: "open",
      postedById: farmer1.id,
    },
  });

  // --- Create Equipment ---
  await prisma.equipmentListing.create({
    data: {
      name: "Mahindra 575 DI",
      type: "Tractor",
      description: "45 HP tractor, well maintained, suitable for all farming operations",
      ratePerDay: 2500,
      available: true,
      location: "Pune",
      image: "🚜",
      ownerId: eqOwner1.id,
      lat: 18.5204,
      lon: 73.8567,
    },
  });

  await prisma.equipmentListing.create({
    data: {
      name: "Preet 987",
      type: "Harvester",
      description: "Combine harvester for wheat and rice, efficient and reliable",
      ratePerDay: 5000,
      available: true,
      location: "Nashik",
      image: "🌾",
      ownerId: eqOwner2.id,
    },
  });

  await prisma.equipmentListing.create({
    data: {
      name: "MB Plough 3-Bottom",
      type: "Plough",
      description: "3-bottom reversible plough, fits most tractors",
      ratePerDay: 800,
      available: false,
      location: "Kolhapur",
      image: "⚙️",
      ownerId: eqOwner1.id,
    },
  });

  await prisma.equipmentListing.create({
    data: {
      name: "Aspee Power Sprayer",
      type: "Sprayer",
      description: "Battery-powered knapsack sprayer, 16L capacity",
      ratePerDay: 600,
      available: true,
      location: "Nagpur",
      image: "💨",
      ownerId: eqOwner2.id,
    },
  });

  await prisma.equipmentListing.create({
    data: {
      name: "Seed Drill Machine",
      type: "Seeder",
      description: "Multi-crop seed drill, adjustable row spacing",
      ratePerDay: 1500,
      available: true,
      location: "Aurangabad",
      image: "🌱",
      ownerId: eqOwner1.id,
    },
  });

  // --- Create Sample Applications ---
  await prisma.application.create({
    data: {
      jobId: job1.id,
      workerId: worker1.id,
      status: "accepted",
    },
  });

  await prisma.application.create({
    data: {
      jobId: job2.id,
      workerId: worker2.id,
      status: "pending",
    },
  });

  // --- Create Activity Feed ---
  await prisma.activity.create({
    data: {
      userId: worker1.id,
      type: "job_applied",
      message: "Applied to Rice Harvesting Help",
    },
  });

  await prisma.activity.create({
    data: {
      userId: farmer1.id,
      type: "job_posted",
      message: "Posted a new job: Rice Harvesting Help",
    },
  });

  await prisma.activity.create({
    data: {
      userId: worker1.id,
      type: "application_accepted",
      message: "Your application for Rice Harvesting Help was accepted",
    },
  });

  await prisma.activity.create({
    data: {
      userId: farmer1.id,
      type: "job_posted",
      message: "Posted a new job: Sugarcane Cutting",
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("\n📋 Demo Accounts (password: Test@123):");
  console.log("  Farmer:   rajesh.patil@krushi.com");
  console.log("  Farmer:   sunil.more@krushi.com");
  console.log("  Worker:   ganesh.shinde@krushi.com");
  console.log("  Worker:   ramesh.pawar@krushi.com");
  console.log("  Worker:   manoj.gaikwad@krushi.com");
  console.log("  Eq Owner: ashok.farms@krushi.com");
  console.log("  Eq Owner: singh.equipment@krushi.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
