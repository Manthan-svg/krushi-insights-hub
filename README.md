# 🌾 KrushiConnect+ — Agricultural Mobile Application

> **Connecting Farms, Empowering Growth**

KrushiConnect+ is a full-stack mobile-first web application built for Indian agriculture, connecting **Farmers**, **Workers**, and **Equipment Owners** on a single platform. Built with React (Frontend) and Node.js/Express with Prisma (Backend).

---

## 📱 Full-Stack Application Workflow

The application uses a decoupled architecture where the React frontend communicates with the Express backend via a REST API secured by JWT authentication.

```text
Frontend (React/Vite) <---- REST API (JSON) ----> Backend (Node/Express) <----> SQLite Database
     (Port 8080)                                      (Port 3001)
```

### Detailed Flow & API Interactions

1. **Authentication & Onboarding (`/api/auth`)**
   - User goes to `/signup` → Frontend calls `POST /api/auth/register`. The backend hashes the password with `bcryptjs`, creates the `User` record, generates an `Activity` log, and returns a JWT token.
   - User goes to `/login` → Frontend calls `POST /api/auth/login`. Token is stored in `localStorage` and attached to all subsequent request headers as `Authorization: Bearer <token>`.
   - On app reload → Frontend calls `GET /api/auth/me` to hydrate the session.

2. **Role-Based Dashboards and Feeds**
   - **Farmer Dashboard (`/dashboard`)**: Frontend fetches live data by simultaneously calling `GET /api/jobs`, `GET /api/workers`, and `GET /api/equipment`.
   - **Worker Dashboard**: Calls `GET /api/jobs?status=open` to see available opportunities.
   - **Equipment Owner Dashboard**: Calls `GET /api/equipment?ownerId={id}` to fetch their specific assets.

3. **Job Application Flow (`/api/applications`)**
   - Worker clicks "Apply" on a job card.
   - Frontend triggers `POST /api/applications` with the `jobId`.
   - The backend records the application and automatically spawns two `Activity` logs (one for the Worker, one for the Farmer).

4. **Universal Debounced Search (`/search`)**
   - User types in the search bar. The frontend debounces the input and dispatches queries matching their role.
   - Example: A Farmer searching "Pune" triggers `GET /api/workers?q=Pune` and `GET /api/equipment?q=Pune`.

---

## 🌐 API Endpoints Architecture

All API endpoints are prefixed with `/api`. Protected routes require a valid JWT Bearer token.

| Endpoint | Method | Protected | Role | Description |
|---|---|---|---|---|
| `/auth/register` | `POST` | No | Any | Register a new user and generate a profile |
| `/auth/login` | `POST` | No | Any | Authenticate and receive JWT |
| `/auth/me` | `GET` | Yes | Any | Retrieve the current user's session |
| `/jobs` | `GET` | No | Any | List jobs (supports `?status=`, `?q=`, `?location=`) |
| `/jobs` | `POST` | Yes | `farmer` | Create a new job listing |
| `/jobs/:id/status` | `PATCH` | Yes | `farmer` | Update job status (`open`, `in_progress`, `completed`) |
| `/workers` | `GET` | No | Any | List workers (supports `?available=`, `?q=`) |
| `/workers/availability` | `PATCH`| Yes | `worker` | Toggle a worker's availability status |
| `/equipment` | `GET` | No | Any | List equipment (supports `?available=`, `?ownerId=`) |
| `/equipment` | `POST` | Yes | `equipment_owner` | Create an equipment listing |
| `/applications` | `POST` | Yes | `worker` | Apply to a specific job |
| `/applications/my` | `GET` | Yes | Any | Get applications (Worker sees own; Farmer sees applicants) |
| `/applications/:id`| `PATCH`| Yes | `farmer` | Accept or reject a job application |
| `/activity` | `GET` | Yes | Any | Get the chronological activity feed |
| `/profile` | `GET` | Yes | Any | Get the deep profile data (including relations) |
| `/profile` | `PATCH`| Yes | Any | Update profile details and settings |

---

## 🏗️ Tech Stack

### Frontend
- **React 18 & TypeScript 5**
- **Vite 5**: Build tooling
- **Tailwind CSS & shadcn/ui**: Styling and design system
- **React Router 6**: Client-side routing with `ProtectedRoute` guards
- **React Query (TanStack)**: Server state caching, loading states, and API synchronization
- **Axios**: HTTP client configuration with proxy intercepts

### Backend
- **Node.js & Express**: API Server
- **Prisma ORM**: Database interactions and schema definitions
- **SQLite**: Development database (easily swapped to PostgreSQL via `.env`)
- **JSON Web Tokens (JWT)**: Secure stateless authentication
- **Bcryptjs**: Password hashing

---

## 🚀 How to Run Locally

You will need **two terminal windows** to run the full stack application.

### 1. Start the Backend API
Open a terminal and navigate to the backend folder:
```bash
cd backend

# Install dependencies
npm install

# Initialize the Prisma SQLite database
npx prisma migrate dev --name init

# Seed the database with demo Farmers, Workers, and Equipment
npm run db:seed

# Start the Express server (runs on Port 3001)
npm run dev
```

### 2. Start the Frontend Application
Open a second terminal at the root of the project:
```bash
# Install frontend dependencies
npm install

# Start the Vite dev server (runs on Port 8080)
# Note: vite.config.ts automatically proxies /api requests to Port 3001
npm run dev
```

### 📋 Demo Accounts

The database seeder creates several accounts to test the application. The password for all accounts is: `Test@123`

- **Farmer:**
  - `rajesh.patil@krushi.com`
  - `sunil.more@krushi.com`
- **Worker:**
  - `ganesh.shinde@krushi.com`
  - `ramesh.pawar@krushi.com`
- **Equipment Owner:**
  - `ashok.farms@krushi.com`
  - `singh.equipment@krushi.com`

---

## ✨ Core Features

- **Role-Based Authentication**: Custom dashboards and UI capabilities depending on whether the user is a Farmer, Worker, or Equipment Owner.
- **Job Engine**: Farmers can post jobs; Workers can apply. The platform automatically tracks application states (pending, accepted, rejected).
- **Universal Search**: Role-aware, debounced search that simultaneously queries multiple backend entities.
- **Live Activity Feed**: Asynchronous logging system. E.g., when a Farmer posts a job, it appears instantly on their activity timeline.
- **Multilingual Support**: Real-time context-based translation switching (English, Hindi, Marathi).

---

<p align="center">🌾 Built for Indian Agriculture 🇮🇳</p>
