# 🌾 KrushiConnect+ — Agricultural Mobile Application

> **Connecting Farms, Empowering Growth**

KrushiConnect+ is a native mobile application built for Indian agriculture, connecting **Farmers**, **Workers**, and **Equipment Owners** on a single platform. Built with React and Capacitor, it runs natively on both **Android** and **iOS** devices.

---

## 📱 Application Flow

```
Splash → Role Selection → Login/Signup → Role-Based Dashboard
                                              ↓
                              ┌────────────────┼────────────────┐
                              ▼                ▼                ▼
                        Farmer Dash      Worker Dash      Equipment Dash
                              │                │                │
                         Post Jobs        Browse Jobs     List Equipment
                        Browse Equip      Apply to Jobs   Manage Rentals
                        View Workers      Track Earnings  Track Availability
```

---

## ✨ Features Implemented

### 🔐 Authentication & Onboarding
| Feature | Description |
|---------|-------------|
| **Splash Screen** | Branded entry screen with app logo and tagline, auto-redirects after 2 seconds |
| **Role Selection** | Users choose their role — Farmer, Worker, or Equipment Owner — with visual cards |
| **Login** | Email & password login form with validation |
| **Sign Up** | Registration form with name, email, phone, and password fields |
| **Role-Based Routing** | After login, users are routed to their specific dashboard based on selected role |

### 👨‍🌾 Farmer Dashboard
| Feature | Description |
|---------|-------------|
| **Stats Overview** | Active jobs count, available workers, nearby equipment — displayed in a 3-column grid |
| **Post a Job** | Full form to create a new job listing — title, description, wages (₹/day), location, duration |
| **My Jobs** | View posted job listings with status (open, in progress, completed), wages, and applicant count |
| **Browse Equipment** | Quick access to search and filter available rental equipment |
| **Browse Workers** | Search workers by skill, location, experience, and daily rate |

### 👷 Worker Dashboard
| Feature | Description |
|---------|-------------|
| **Stats Overview** | Available jobs count, total earnings (₹), and performance rating |
| **Browse Jobs** | List of open jobs with title, location, description, wages, and duration |
| **Apply to Jobs** | One-tap "Apply Now" button with instant toast confirmation |
| **Earnings Tracking** | View cumulative earnings summary |

### 🚜 Equipment Owner Dashboard
| Feature | Description |
|---------|-------------|
| **Equipment Listings** | View all listed equipment with name, type, daily rate, and availability status |
| **Availability Badges** | Color-coded badges — green for "Available", grey for "Rented" |
| **Add Equipment** | Button to list new equipment for rental |
| **Rate Display** | Per-day rental rates in ₹ for each piece of equipment |

### 🔍 Search
| Feature | Description |
|---------|-------------|
| **Universal Search** | Single search bar that filters across jobs, workers, and equipment |
| **Role-Aware Results** | Workers see job listings; Farmers see workers and equipment |
| **Live Filtering** | Results update in real-time as the user types |
| **Worker Cards** | Displays avatar, name, location, experience, rating, skills, and daily rate |
| **Equipment Cards** | Shows emoji icon, name, type, location, rate, and availability |

### 📋 Activity Page
| Feature | Description |
|---------|-------------|
| **Recent Activity Feed** | Timeline of recent actions — applications submitted, jobs posted, rentals requested |
| **Role-Specific Content** | Activity feed adapts based on user role |

### 👤 Profile Page
| Feature | Description |
|---------|-------------|
| **User Info** | Displays name, email, phone, and selected role |
| **Language Switcher** | Change app language from the profile screen |
| **Logout** | Sign out and return to role selection |

### 🌐 Multilingual Support
| Language | Code | Coverage |
|----------|------|----------|
| **English** | `en` | Full |
| **Hindi** | `hi` | Full |
| **Marathi** | `mr` | Full |

- Language toggle available in the top bar (cycles through all 3)
- All UI labels, buttons, headings, and messages are translated
- Translations stored in `src/i18n/` as modular TypeScript files

### 📱 Mobile-Native Design
| Feature | Description |
|---------|-------------|
| **Bottom Tab Navigation** | 4 tabs — Home, Search, Activity, Profile — with active state indicators |
| **Top Bar** | Sticky header with app title and language switcher |
| **Safe Area Support** | Proper padding for notched devices (iPhone X+, Android punch-holes) |
| **Touch Optimized** | 48px minimum touch targets on all interactive elements |
| **No Scrollbars** | Hidden scrollbars for native app feel |
| **Overscroll Prevention** | Disabled rubber-banding for native behavior |
| **Mobile Viewport** | Locked to `max-w-lg` centered layout at 390px width |

---

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript 5** | Type safety |
| **Tailwind CSS 3** | Utility-first styling with custom design tokens |
| **Capacitor 8** | Native iOS & Android wrapper |
| **React Router 6** | Client-side routing with role-based guards |
| **React Query (TanStack)** | Data fetching & caching (ready for backend) |
| **shadcn/ui** | Accessible, customizable UI components |
| **Sonner** | Toast notifications |
| **Lucide React** | Icon library |
| **Vite 5** | Build tooling & HMR |

---

## 🎨 Design System

### Color Tokens (HSL)
| Token | Light Mode | Usage |
|-------|-----------|-------|
| `--primary` | `153 44% 30%` | Agricultural green — buttons, active states |
| `--secondary` | `28 42% 64%` | Warm accent — highlights |
| `--background` | `36 33% 94%` | Earthy cream — page background |
| `--foreground` | `150 40% 12%` | Dark green-grey — text |
| `--muted` | `36 20% 88%` | Subtle backgrounds |
| `--destructive` | `0 84% 60%` | Errors and warnings |

### Typography & Spacing
- System font stack for native feel
- 48px minimum touch targets
- Consistent 16px horizontal padding
- 24px vertical section spacing

---

## 📂 Project Structure

```
src/
├── App.tsx                     # Root with providers & routing
├── index.css                   # Design tokens & global styles
├── contexts/
│   ├── AuthContext.tsx          # Authentication state & role management
│   └── LanguageContext.tsx      # i18n language switching
├── i18n/
│   ├── en.ts                   # English translations
│   ├── hi.ts                   # Hindi translations
│   └── mr.ts                   # Marathi translations
├── data/
│   └── mockData.ts             # Mock jobs, workers, equipment data
├── components/
│   ├── layout/
│   │   ├── MobileLayout.tsx    # App shell with TopBar + BottomNav
│   │   ├── TopBar.tsx          # Sticky header with language toggle
│   │   └── BottomNav.tsx       # Fixed bottom tab navigation
│   └── ui/                     # shadcn/ui component library
├── pages/
│   ├── SplashScreen.tsx        # Animated splash with auto-redirect
│   ├── RoleSelection.tsx       # Role picker (Farmer/Worker/Equipment)
│   ├── Login.tsx               # Login form
│   ├── Signup.tsx              # Registration form
│   ├── Dashboard.tsx           # Role-based dashboard router
│   ├── SearchPage.tsx          # Universal search across all entities
│   ├── ActivityPage.tsx        # Recent activity feed
│   ├── ProfilePage.tsx         # User profile & settings
│   ├── farmer/
│   │   ├── FarmerDashboard.tsx # Farmer home with stats & jobs
│   │   └── PostJob.tsx         # Job posting form
│   ├── worker/
│   │   └── WorkerDashboard.tsx # Worker home with job listings
│   └── equipment/
│       └── EquipmentOwnerDashboard.tsx  # Equipment management
└── hooks/
    ├── use-mobile.tsx          # Mobile device detection
    └── use-toast.ts            # Toast notification hook
```

---

## 📊 Mock Data

The app ships with realistic mock data representing the Maharashtra agricultural ecosystem:

- **5 Job Listings** — Rice harvesting, sugarcane cutting, wheat sowing, cotton picking, orchard maintenance
- **5 Worker Profiles** — With skills like harvesting, tractor driving, spraying; daily rates ₹400–₹700
- **5 Equipment Items** — Tractors, harvesters, ploughs, sprayers, seeders; rental rates ₹600–₹5000/day

All data is typed with TypeScript interfaces (`Job`, `Worker`, `Equipment`) and ready to be replaced with a real backend.

---

## 🚀 How to Run

### Development (Web Preview)
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

### Native Mobile (Android)
```bash
npm run build
npx cap add android        # First time only
npx cap sync android
npx cap run android        # Requires Android Studio
```

### Native Mobile (iOS)
```bash
npm run build
npx cap add ios            # First time only
npx cap sync ios
npx cap run ios            # Requires Mac with Xcode
```

---

## 🔮 Future Roadmap

- [ ] **Backend Integration** — Connect to Lovable Cloud for real authentication and database
- [ ] **Push Notifications** — Job alerts, rental updates via `@capacitor/push-notifications`
- [ ] **Camera Integration** — Upload equipment photos and profile pictures via `@capacitor/camera`
- [ ] **GPS Location** — Auto-detect location for nearby jobs and equipment
- [ ] **Payment Integration** — In-app payments for rentals and wages via Stripe/UPI
- [ ] **Chat System** — Direct messaging between farmers, workers, and equipment owners
- [ ] **Ratings & Reviews** — Rate workers and equipment after job completion
- [ ] **Offline Support** — Cache data for use in low-connectivity rural areas

---

## 📄 License

This project is built with [Lovable](https://lovable.dev).

---

<p align="center">🌾 Built for Indian Agriculture 🇮🇳</p>
