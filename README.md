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
   - If Marathi is selected, the assistant generates job entries with Marathi titles for local workers.

2. **Real-Time Notifications (`Socket.io`)**
   - Instant alerts for job applications and equipment rentals.
   - Farmers receive a notification whenever a Worker applies or a rental is requested.
   - Dashboards refresh automatically via TanStack Query invalidation on socket events.

3. **GPS-Based Nearby Matching**
   - Automatically detects user location (with Pune as fallback).
   - Workers and Equipment are sorted by distance (km) using the Haversine formula directly in the backend `geo.utils`.
   - Seed data includes realistic Maharashtra coordinates for a demo experience.

---

## 🌐 API Endpoints Architecture

All API endpoints are prefixed with `/api`. Protected routes require a valid JWT Bearer token.

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/auth/login` | `POST` | Any | Authenticate and receive JWT |
| `/jobs` | `GET` | Any | List jobs (sorted by distance; supports filters) |
| `/jobs` | `POST` | `farmer` | Create job listing (supports voice parsing) |
| `/workers` | `GET` | Any | Browse workers nearby (distance-sorted) |
| `/equipment` | `GET` | Any | Browse equipment listings nearby |
| `/rentals` | `POST` | `farmer` | Request equipment rental (emits socket alert) |
| `/rentals/my` | `GET` | Any | List rental requests for owner or farmer |
| `/applications` | `POST` | `worker` | Apply to a job (emits socket alert to farmer) |
| `/activity` | `GET` | Any | Localized time-ago chronological feed |

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
