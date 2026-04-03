# 🌾 KrushiConnect+ — Agricultural Mobile Application

> **Connecting Farms, Empowering Growth**

KrushiConnect+ is a full-stack, multilingual mobile-first platform built for Indian agriculture. It connects **Farmers**, **Workers**, and **Equipment Owners** through a real-time, AI-powered ecosystem.

---

## 📱 Full-Stack Application Workflow

The application uses an event-driven architecture combining REST APIs and WebSockets for a seamless real-time experience.

```text
Frontend (React + Socket.io Client) <----> [REST API + WebSocket Server] <----> Database (SQLite/Prisma)
      (Vite Dev Port: 8080)                    (Backend Port: 3001)
```

### Advanced Interactions

1. **AI Voice Assistant (`nlp.ts`)**
   - Users can post jobs or search via voice in **English, Hindi, or Marathi**.
   - The NLP engine parses regional numerals and keywords (e.g., "नऊ" for 9, "कापणी" for Harvesting).
   - **New**: Enhanced regex boundaries to prevent keyword collision and improved Marathi harvesting detection.

2. **Real-Time Notifications (`Socket.io`)**
   - Instant alerts for job applications and equipment rentals.
   - **Improved**: Automatic query invalidation for the activity feed, ensuring real-time UI updates without manual refresh.

3. **GPS-Based Proximity (`geo.utils`)**
   - High-accuracy location detection with Pune fallback.
   - Distances are calculated in **km** and synced across Weather, Job Search, and Equipment Rental.

4. **End-to-End Application Lifecycle**
   - Farmers can now **Manage Applications** directly from their dashboard (Accept/Reject).
   - Once a job is accepted, it transitions to `in_progress`, enabling the completion and rating workflow.

---

## 🌐 API Endpoints Architecture

All API endpoints are prefixed with `/api`. Protected routes require a valid JWT Bearer token.

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/auth/login` | `POST` | Any | Authenticate and receive JWT |
| `/jobs/:id` | `PATCH` | `farmer` | Update job status (e.g., to `completed`) |
| `/ratings` | `POST` | `farmer` | Submit worker rating (Authenticated) |
| `/applications/:id` | `PATCH` | `farmer` | Accept or Reject a worker application |
| `/crop-scan` | `POST` | Any | AI-powered diagnosis (Authenticated, Multi-lingual) |

---

## 🏗️ Tech Stack

### Frontend & Mobile
- **React 18 & TypeScript 5**: Core UI logic
- **Vite 5**: Optimized build system
- **Tailwind CSS & shadcn/ui**: Premium mobile-first design
- **React Query**: Server state and auto-refresh logic
- **Socket.io Client**: Real-time event handling
- **Web Speech API**: For multi-lingual voice recognition and synthesis

### Backend & Infrastructure
- **Node.js & Express**: Event-driven API server
- **Socket.io**: Persistent bi-directional communication
- **Prisma ORM**: Type-safe database interactions
- **SQLite/PostgreSQL**: Relational storage
- **JWT & Bcrypt**: Secure authentication
- **Anthropic Claude 3.5**: AI vision for crop disease detection
- **Haversine Geo-Logic**: Location-based proximity calculations

---

## 🚀 How to Run Locally

### 1. Start the Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

### 2. Start the Frontend
```bash
# From root
npm install
npm run dev
```

### 📋 Demo Accounts
All accounts use password: `Test@123`
- **Farmer:** `rajesh.patil@krushi.com`
- **Worker:** `ganesh.shinde@krushi.com`
- **Equipment Owner:** `ashok.farms@krushi.com`

---

## ✨ Core Features

- **AI Crop Scan**: Instant disease diagnosis using Claude 3.5 Sonnet (supports EN/HI/MR).
- **Weather-Smart Scheduling**: Real-time rain warnings and proactive labor hiring.
- **Worker Trust System**: Reputation-based matching with stars, reviews, and "Trusted" badges.
- **Farmer Analytics**: Financial insights and savings tracking for operational efficiency.
- **Full Localization**: English, Hindi, and Marathi support across all UI, statuses, and data entries.
- **Voice Intelligence**: AI-powered voice posting and localized confirmation audio.
- **Smart GPS Matching**: Proximity-based filtering for job and equipment discovery.
- **Live Activity Feed**: Real-time event logging with localized "time-ago" labels.
- **PWA Capabilities**: Mobile-optimized, responsive premium design.

---

<p align="center">🌾 Built for Indian Agriculture 🇮🇳</p>
