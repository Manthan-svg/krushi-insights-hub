

# Rebuild KrushiConnect+ as a Native Mobile App

## Overview
Recreate the KrushiConnect+ Flutter app as a React + Capacitor native mobile app for both Android and iOS. The app will be built with a mobile-first UI optimized for touch, then wrapped with Capacitor for native deployment to App Store and Google Play.

## What We'll Build

### Phase 1 — Mobile-First UI (in Lovable)

1. **Design System Setup** — Agricultural green theme (`#2D6A4F` primary, `#D4A574` accent, `#F5F0E8` background), large touch targets (48px min), mobile typography
2. **Role Selection & Auth Screens** — Splash screen, role picker (Farmer / Worker / Equipment Owner), login/signup forms
3. **Farmer Dashboard** — Post jobs, browse equipment, view worker profiles, manage active requests
4. **Worker Dashboard** — Browse available jobs, apply, track earnings, manage profile/skills
5. **Equipment Owner Dashboard** — List equipment for rent, manage rental requests, track availability
6. **Equipment Rental Flow** — Browse catalog, view details, request rental with date picker
7. **Multilingual Support** — English, Hindi, Marathi language switching
8. **Bottom Tab Navigation** — Native-feeling tab bar (Home, Search, Activity, Profile)

### Phase 2 — Capacitor Native Setup

9. **Install Capacitor** — Add `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android`
10. **Configure Capacitor** — Initialize with app ID `app.lovable.e19cef05e494447fbe9846bd4d5c9d13`, enable hot-reload pointing to sandbox URL

### After Lovable (on your machine)

To run on a real device or emulator, you'll need to:
1. Export to GitHub via the "Export to GitHub" button
2. Clone the repo and run `npm install`
3. Run `npx cap add ios` and/or `npx cap add android`
4. Run `npx cap update ios` / `npx cap update android`
5. Run `npm run build` then `npx cap sync`
6. Run `npx cap run android` or `npx cap run ios`
   - iOS requires a Mac with Xcode
   - Android requires Android Studio

## Technical Details

- **State management**: React Context for auth/role state, React Query for data
- **Data**: Mock data initially (same as original Flutter app), ready for Supabase backend later
- **Routing**: React Router with role-based route guards
- **Styling**: Tailwind CSS with custom agricultural theme tokens, all mobile-optimized
- **Components**: ~15 new components across screens, plus shared layout components
- **Files affected**: ~25 new files (pages, components, contexts, i18n config)

## File Structure
```text
src/
├── contexts/        AuthContext, LanguageContext
├── i18n/            en.ts, hi.ts, mr.ts
├── components/
│   ├── layout/      MobileLayout, BottomNav, TopBar
│   ├── farmer/      JobPostForm, EquipmentBrowser
│   ├── worker/      JobBrowser, ApplicationCard
│   └── equipment/   EquipmentCard, RentalForm
├── pages/
│   ├── SplashScreen, RoleSelection, Login, Signup
│   ├── farmer/      FarmerDashboard, PostJob
│   ├── worker/      WorkerDashboard, BrowseJobs
│   └── equipment/   OwnerDashboard, ListEquipment
└── data/            mockJobs, mockEquipment, mockWorkers
```

