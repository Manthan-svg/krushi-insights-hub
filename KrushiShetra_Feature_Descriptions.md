# KrushiShetra — New Features Description

> This document describes 4 new features to be added to the existing KrushiConnect+ application.
> You already have full context of the codebase. Build each feature based on the descriptions below.

---

## Project Context (Quick Recap)
- Full-stack app connecting Farmers, Workers, and Equipment Owners in rural India.
- Supports 3 languages: English, Hindi, and Marathi — every new UI text must follow this.
- Roles: `farmer`, `worker`, `equipment_owner`.
- Already has: GPS-based matching, real-time Socket.io notifications, Voice-based job posting, JWT auth.

---

## Feature 1 — Crop Disease Detection via AI Vision

### What it does
A farmer opens a dedicated "Scan My Crop" screen, takes a photo of their crop (or uploads one from gallery), and the app analyses the image using AI and tells the farmer what disease is affecting the crop, how severe it is, and what treatment steps to follow — all in the farmer's selected language (English, Hindi, or Marathi).

### User Flow
1. Farmer taps "Scan Crop" from the navigation.
2. A camera/upload screen opens where the farmer either clicks a live photo or picks from gallery.
3. After selecting the image, farmer taps "Analyse".
4. A loading state is shown while the AI processes the image.
5. Results appear showing:
   - **Disease Name** (or "Healthy Crop" if no disease found)
   - **Severity Level** — Healthy / Low / Medium / High (shown as a colored badge)
   - **Description** — What the disease is and how it affects the crop
   - **Treatment Steps** — A list of actionable steps the farmer should take
   - **Precautions** — What to avoid or watch out for
6. The severity badge color changes based on level — green for healthy, yellow for medium, red for high.
7. A "Scan Another" button resets the screen for the next photo.

### API Behaviour
- The image is sent to the **Claude AI API (claude-sonnet-4-20250514)** with a prompt instructing it to act as an agricultural expert and respond in the farmer's chosen language.
- The AI must return structured data (disease name, severity, description, treatment list, precautions).
- The backend handles the API call and returns the parsed result to the frontend.
- Store the `ANTHROPIC_API_KEY` in the backend `.env` file.

### Why this matters for the demo
This is the single most impressive feature. It is visual, real-time, and directly solves a farmer's biggest pain point. During the demo, take a photo of any plant/leaf — the AI will analyse it live.

---

## Feature 2 — Weather-Based Smart Job Scheduling

### What it does
The Jobs listing page shows a weather forecast widget at the top. It fetches 3-day weather data based on the user's current GPS location and displays it in a clean card strip. If rain or storms are expected in the next 2 days, a prominent warning banner appears advising the farmer to post harvesting jobs immediately before the rain arrives.

### User Flow
1. When a farmer opens the Jobs page, a weather strip appears at the top automatically.
2. The strip shows 3 day-cards (Today, Tomorrow, Day After) with:
   - Weather icon (sunny, cloudy, rainy, etc.)
   - Temperature (°C)
   - Condition label (Clear / Rain / Thunderstorm / Cloudy)
3. If rain or thunderstorm is detected in the next 2 days, a yellow/amber warning banner appears above the cards saying something like:
   - English: *"Rain expected in 2 days. Post your harvesting jobs today to avoid delays!"*
   - Hindi / Marathi translations of the same message
4. The warning banner has a quick-action button: "Post a Job" that takes the farmer directly to the job creation form.
5. If no rain is expected, only the 3 weather cards are shown (no banner).

### API Used
- **OpenWeatherMap Free API** (5-day forecast endpoint) — free tier, no credit card required.
- The user's existing GPS coordinates (already available in the app) are passed to fetch location-specific weather.
- If GPS is unavailable, default to Pune coordinates as fallback (same as existing app behaviour).
- Store the `OPENWEATHER_API_KEY` in the backend `.env` file.

### Why this matters for the demo
It makes the app feel intelligent — not just a job board, but a smart farming assistant. Judges will immediately understand the real-world value.

---

## Feature 3 — Worker Rating & Trust Score System

### What it does
After a job is marked as complete, the farmer can rate the worker with 1–5 stars and leave an optional written comment. Each worker's profile card shows their average star rating, total number of jobs completed, and a "Trusted Worker" badge once they cross a certain number of ratings. This builds trust between strangers on the platform.

### User Flow — Farmer Side
1. On the "My Jobs" page, each job card has a **"Mark as Complete"** button.
2. When the farmer taps it, the job is marked complete and the worker is notified via a Socket.io event.
3. Immediately after marking complete, a **Rate Worker modal** pops up automatically with:
   - The worker's name
   - An interactive 1–5 star selector
   - An optional text box: "Share your experience..."
   - A "Submit Rating" button
4. Once submitted, a success toast appears and the modal closes.
5. Each job can only be rated once — the "Rate Worker" button disappears after rating is submitted.

### User Flow — Worker Side (Profile Display)
1. On worker profile cards visible to farmers (in the nearby workers list), each card now shows:
   - **Star rating** (e.g., ⭐ 4.3)
   - **Total jobs** (e.g., "23 jobs completed")
   - **"Trusted Worker" badge** — shown in green if the worker has 5 or more ratings

### Database
- A new `Rating` record is created per completed job (one rating per job, not multiple).
- Rating stores: which job, which farmer rated, which worker was rated, stars (1–5), and optional comment.
- The `Job` model needs a `status` field: `open`, `in_progress`, or `completed`.

### Why this matters for the demo
When a judge asks *"How do farmers trust a stranger worker?"* — you point to this. It mirrors the trust systems in Uber, Airbnb, and Swiggy that everyone already understands.

---

## Feature 4 — Farmer Analytics Dashboard

### What it does
A dedicated "My Stats" screen visible only to farmers. It aggregates all their activity data from the existing database and presents it as a visual dashboard. It shows how many jobs they posted, how many workers they hired, how much they spent on equipment rentals, and most importantly — how much money they saved by using KrushiShetra instead of relying on middlemen.

### What the Dashboard Shows

**4 Stat Cards in a 2×2 grid:**
1. **Jobs Posted** — Total jobs created this season, with a sub-label showing how many are still active.
2. **Workers Hired** — Total unique workers who have worked for this farmer.
3. **Equipment Rentals** — Total number of rental requests made, with total amount spent in ₹.
4. **Money Saved** — An estimated amount saved vs. hiring through a middleman (calculated as ~18% of total rental + hiring spend, since middlemen typically charge this premium).

**Jobs Progress Bar:**
A simple visual bar showing "Completed Jobs vs Total Jobs" (e.g., 9 out of 12 jobs completed = 75% bar filled in green).

**Highlight Callout Box:**
A prominent green box at the bottom of the screen that says:
> *"🎉 By using KrushiShetra, you saved approximately ₹2,610 this season by avoiding middlemen!"*

This is the emotional payoff moment of the entire app — make it visually stand out.

### Data Source
All data for this screen already exists in the database from the farmer's existing jobs, applications, and rental records. No new data collection is needed — just aggregate and display what's already there.

### Navigation
Add a "My Stats" link in the bottom navigation bar or farmer dashboard, visible only when logged in as a farmer.

### Why this matters for the demo
Numbers on a screen always impress judges. It shows the app has a complete user journey — not just discovery, but outcomes and impact. The "money saved" figure makes the value proposition concrete and emotional.

---

## General Rules for All Features
- Every new screen and UI text must support all 3 languages: **English, Hindi, Marathi**.
- All new pages must follow the existing **mobile-first, PWA design** of the app.
- Features 3 and 4 are only accessible to users with the **farmer role**.
- Feature 1 (Crop Scan) is accessible to all logged-in users.
- Feature 2 (Weather) is public — no login required to view it.
