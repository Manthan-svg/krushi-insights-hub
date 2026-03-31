export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  wages: number;
  duration: number;
  postedBy: string;
  postedDate: string;
  applicants: number;
  status: "open" | "in_progress" | "completed";
}

export interface Worker {
  id: string;
  name: string;
  skills: string[];
  experience: number;
  rating: number;
  location: string;
  available: boolean;
  dailyRate: number;
  avatar: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  owner: string;
  ratePerDay: number;
  available: boolean;
  location: string;
  image: string;
  description: string;
}

export const mockJobs: Job[] = [
  { id: "1", title: "Rice Harvesting Help", description: "Need 5 workers for rice harvesting in 10-acre field", location: "Pune, Maharashtra", wages: 500, duration: 7, postedBy: "Rajesh Patil", postedDate: "2026-03-28", applicants: 3, status: "open" },
  { id: "2", title: "Sugarcane Cutting", description: "Experienced workers needed for sugarcane cutting", location: "Kolhapur, Maharashtra", wages: 600, duration: 14, postedBy: "Amit Deshmukh", postedDate: "2026-03-27", applicants: 5, status: "open" },
  { id: "3", title: "Wheat Sowing Workers", description: "Workers needed for wheat sowing season", location: "Nashik, Maharashtra", wages: 450, duration: 5, postedBy: "Sunil More", postedDate: "2026-03-26", applicants: 2, status: "in_progress" },
  { id: "4", title: "Cotton Picking", description: "Seasonal cotton picking workers required", location: "Nagpur, Maharashtra", wages: 400, duration: 21, postedBy: "Prakash Jadhav", postedDate: "2026-03-25", applicants: 8, status: "open" },
  { id: "5", title: "Orchard Maintenance", description: "Help needed for mango orchard pruning and maintenance", location: "Ratnagiri, Maharashtra", wages: 550, duration: 10, postedBy: "Vinod Kulkarni", postedDate: "2026-03-24", applicants: 1, status: "open" },
];

export const mockWorkers: Worker[] = [
  { id: "1", name: "Ganesh Shinde", skills: ["Harvesting", "Sowing", "Spraying"], experience: 8, rating: 4.5, location: "Pune", available: true, dailyRate: 500, avatar: "GS" },
  { id: "2", name: "Ramesh Pawar", skills: ["Tractor Driving", "Ploughing"], experience: 12, rating: 4.8, location: "Nashik", available: true, dailyRate: 700, avatar: "RP" },
  { id: "3", name: "Suresh Kamble", skills: ["Cotton Picking", "Harvesting"], experience: 5, rating: 4.2, location: "Nagpur", available: false, dailyRate: 400, avatar: "SK" },
  { id: "4", name: "Manoj Gaikwad", skills: ["Spraying", "Fertilizing", "Sowing"], experience: 6, rating: 4.6, location: "Kolhapur", available: true, dailyRate: 450, avatar: "MG" },
  { id: "5", name: "Vikram Jagtap", skills: ["Harvesting", "Equipment Operation"], experience: 10, rating: 4.7, location: "Satara", available: true, dailyRate: 600, avatar: "VJ" },
];

export const mockEquipment: Equipment[] = [
  { id: "1", name: "Mahindra 575 DI", type: "Tractor", owner: "Ashok Farms", ratePerDay: 2500, available: true, location: "Pune", image: "🚜", description: "45 HP tractor, well maintained, suitable for all farming operations" },
  { id: "2", name: "Preet 987", type: "Harvester", owner: "Singh Equipment", ratePerDay: 5000, available: true, location: "Nashik", image: "🌾", description: "Combine harvester for wheat and rice, efficient and reliable" },
  { id: "3", name: "MB Plough 3-Bottom", type: "Plough", owner: "Patil Agro", ratePerDay: 800, available: false, location: "Kolhapur", image: "⚙️", description: "3-bottom reversible plough, fits most tractors" },
  { id: "4", name: "Aspee Power Sprayer", type: "Sprayer", owner: "Green Agri", ratePerDay: 600, available: true, location: "Nagpur", image: "💨", description: "Battery-powered knapsack sprayer, 16L capacity" },
  { id: "5", name: "Seed Drill Machine", type: "Seeder", owner: "Modern Farms", ratePerDay: 1500, available: true, location: "Aurangabad", image: "🌱", description: "Multi-crop seed drill, adjustable row spacing" },
];
