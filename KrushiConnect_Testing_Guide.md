# KrushiConnect+ — Complete Application Testing Guide

> Test every feature from start to finish using the 3 demo accounts.
> Follow the steps in order — each section builds on the previous one.

---

## Before You Start

Make sure both servers are running:
- Backend running on port **3001**
- Frontend running on port **8080**
- Open the app at `http://localhost:8080`

Keep **3 browser tabs or windows open** — one for each role:
- **Tab 1 (Farmer):** `rajesh.patil@krushi.com` / `Test@123`
- **Tab 2 (Worker):** `ganesh.shinde@krushi.com` / `Test@123`
- **Tab 3 (Equipment Owner):** `ashok.farms@krushi.com` / `Test@123`

---

---

## PHASE 1 — Authentication Testing

### Step 1 — Login as Farmer
1. Open Tab 1. Go to the login screen.
2. Enter email: `rajesh.patil@krushi.com`, Password: `Test@123`
3. Tap Login.
4. ✅ **Expected:** You land on the Farmer dashboard. Navigation shows farmer-specific options (Post Job, My Jobs, Scan Crop, My Stats, etc.)

### Step 2 — Login as Worker
1. Open Tab 2. Go to the login screen.
2. Enter email: `ganesh.shinde@krushi.com`, Password: `Test@123`
3. ✅ **Expected:** Worker dashboard loads. Navigation shows worker-specific options (Browse Jobs, My Applications, etc.)

### Step 3 — Login as Equipment Owner
1. Open Tab 3. Go to the login screen.
2. Enter email: `ashok.farms@krushi.com`, Password: `Test@123`
3. ✅ **Expected:** Equipment Owner dashboard loads. Navigation shows rental-specific options.

### Step 4 — Wrong Password Test
1. Logout from any tab. Try logging in with a wrong password.
2. ✅ **Expected:** Error message shown. App does not crash.

---

---

## PHASE 2 — Language & Localization Testing

### Step 5 — Switch to Marathi
1. In Tab 1 (Farmer), find the language switcher (EN / HI / MR).
2. Switch to **Marathi (MR)**.
3. ✅ **Expected:** All UI labels, buttons, navigation items, and status text change to Marathi (Devanagari script).

### Step 6 — Switch to Hindi
1. Switch language to **Hindi (HI)**.
2. ✅ **Expected:** All text switches to Hindi. Numbers and statuses also localize.

### Step 7 — Switch back to English
1. Switch back to **English (EN)**.
2. ✅ **Expected:** Everything returns to English cleanly with no broken labels.

> 💡 **Tip for Demo:** Switch language live in front of the judge — it's a very impressive moment.

---

---

## PHASE 3 — GPS & Nearby Matching Testing

### Step 8 — Allow Location Permission
1. In Tab 1 (Farmer), open the Workers or Jobs browsing screen.
2. If the browser asks for location permission, click **Allow**.
3. ✅ **Expected:** Workers and Equipment are sorted by distance (km) from your current location.

### Step 9 — Verify Distance Sorting
1. On the Workers list, check if each worker card shows a distance (e.g., "3.2 km away").
2. ✅ **Expected:** Workers are listed from nearest to farthest. Maharashtra seed data locations should appear realistic.

### Step 10 — Fallback to Pune
1. Deny location permission (or open in a private window that blocks location).
2. ✅ **Expected:** App defaults to Pune coordinates and still shows nearby workers without crashing.

---

---

## PHASE 4 — Weather-Based Smart Scheduling Testing

### Step 11 — Open the Jobs Page as Farmer
1. In Tab 1 (Farmer), navigate to the Jobs listing page.
2. ✅ **Expected:** A weather strip appears at the top of the page showing 3 day-cards (Today, Tomorrow, Day After).

### Step 12 — Verify Weather Cards
1. Check each weather card shows:
   - Day label (Today / Tomorrow / next day name)
   - A weather icon
   - Temperature in °C
   - Condition (Clear / Rain / Cloudy etc.)
2. ✅ **Expected:** All 3 cards are populated with real weather data based on location.

### Step 13 — Rain Warning Banner (if rain expected)
1. If rain is forecasted in the next 2 days, check if a yellow/amber warning banner appears above the weather cards.
2. ✅ **Expected:** Banner text warns about rain and suggests posting harvesting jobs immediately.
3. Check if the banner has a **"Post a Job"** button.
4. ✅ **Expected:** Tapping "Post a Job" takes you directly to the job creation form.

### Step 14 — Language Switch on Weather
1. With the weather strip visible, switch language to Marathi.
2. ✅ **Expected:** The warning banner text (if shown) switches to Marathi.

---

---

## PHASE 5 — Job Posting & Real-Time Notifications Testing

### Step 15 — Post a Job (Text Method)
1. In Tab 1 (Farmer), go to "Post a Job".
2. Fill in job details:
   - Title: "Wheat Harvesting Help Needed"
   - Description: "Need 3 workers for wheat harvesting"
   - Daily Wage: 500
   - Location: Select or enter Pune area
3. Tap Post.
4. ✅ **Expected:** Job appears in the Jobs listing immediately.

### Step 16 — Post a Job via Voice Assistant
1. Tap the Voice/Mic button on the job posting screen.
2. Speak in Hindi or Marathi: *"मला उद्या कापणीसाठी कामगार हवे आहेत"* (I need workers for harvesting tomorrow)
3. ✅ **Expected:** NLP engine parses your speech and auto-fills the job form fields (title, category, etc.) in the selected language.

### Step 17 — Worker Applies to Job (Real-Time Notification Test)
1. In Tab 2 (Worker), browse the Jobs list.
2. Find the job posted by Rajesh Patil in Step 15.
3. Tap **Apply**.
4. ✅ **Expected (Tab 2):** Application submitted confirmation shown.
5. ✅ **Expected (Tab 1 - Farmer):** A real-time push notification appears instantly saying a worker has applied — WITHOUT refreshing the page.

### Step 18 — Farmer Dashboard Auto-Refresh
1. After the worker applies (Step 17), check the Farmer dashboard in Tab 1.
2. ✅ **Expected:** Application count or activity feed updates automatically via Socket.io — no manual refresh needed.

---

---

## PHASE 6 — Equipment Rental Testing

### Step 19 — Browse Equipment
1. In Tab 1 (Farmer), go to the Equipment listing page.
2. ✅ **Expected:** Equipment items are shown sorted by distance (km). Each item shows owner name, equipment type, daily rate, and distance.

### Step 20 — Request a Rental
1. Tap on any equipment item.
2. Tap **Request Rental**.
3. ✅ **Expected (Tab 1):** Rental request submitted confirmation.
4. ✅ **Expected (Tab 3 - Equipment Owner):** Real-time notification appears instantly that Rajesh Patil has requested their equipment — no page refresh needed.

### Step 21 — View My Rentals
1. In Tab 1 (Farmer), go to "My Rentals".
2. ✅ **Expected:** The rental request just submitted appears in the list.
3. In Tab 3 (Equipment Owner), go to rental management section.
4. ✅ **Expected:** Incoming rental request from the farmer appears.

---

---

## PHASE 7 — Crop Disease Detection Testing (AI Feature)

### Step 22 — Open Scan Crop Screen
1. In Tab 1 (Farmer), tap **"Scan Crop"** from the navigation.
2. ✅ **Expected:** Camera/upload screen opens cleanly.

### Step 23 — Upload a Crop Image
1. Tap the upload area.
2. Select any plant or crop image from your device (even a photo of a houseplant works for demo).
3. ✅ **Expected:** Image preview appears inside the upload card, replacing the placeholder icon.

### Step 24 — Run AI Analysis
1. Tap the **"Analyse"** button.
2. ✅ **Expected:** A loading spinner or message appears ("Analysing your crop...").
3. Wait for the result (typically 5–10 seconds).
4. ✅ **Expected:** Result card appears showing:
   - Disease name (or "Healthy Crop")
   - Severity badge with appropriate color (green/yellow/red)
   - Description of the disease
   - Treatment steps (bullet list)
   - Precautions (bullet list)

### Step 25 — Test with Language Switch
1. Switch language to **Marathi** before uploading.
2. Upload another image and tap Analyse.
3. ✅ **Expected:** The entire result (disease name, description, treatment, precautions) comes back in **Marathi** (Devanagari script).

### Step 26 — Scan Another
1. After seeing the result, tap **"Scan Another"**.
2. ✅ **Expected:** Page resets cleanly. Upload area is empty and ready for a new image.

---

---

## PHASE 8 — Worker Rating & Trust System Testing

### Step 27 — Mark a Job as Complete
1. In Tab 1 (Farmer), go to "My Jobs".
2. Find a job that has applications (the one from Step 15).
3. Tap **"Mark as Complete"**.
4. ✅ **Expected:** Job status changes to "Completed".
5. ✅ **Expected (Tab 2 - Worker):** Worker receives a real-time notification that the job has been marked complete.

### Step 28 — Rate the Worker
1. Immediately after marking complete, a **Rate Worker modal** should appear automatically in Tab 1.
2. Select a star rating (e.g., 4 stars).
3. Type a comment: *"Very punctual and hardworking!"*
4. Tap **Submit Rating**.
5. ✅ **Expected:** Success toast notification appears. Modal closes.

### Step 29 — Verify Trust Badge on Worker Profile
1. In Tab 1 (Farmer), go to the Workers listing page.
2. Find Ganesh Shinde's worker card.
3. ✅ **Expected:** The card now shows:
   - Star rating (e.g., ⭐ 4.0)
   - Number of jobs completed
   - "Trusted Worker" badge (if 5+ ratings exist)

### Step 30 — Cannot Rate Twice
1. In Tab 1, go to "My Jobs" and find the completed job again.
2. ✅ **Expected:** The "Rate Worker" button is gone. You cannot submit a second rating for the same job.

---

---

## PHASE 9 — Farmer Analytics Dashboard Testing

### Step 31 — Open My Stats
1. In Tab 1 (Farmer), tap **"My Stats"** from the navigation.
2. ✅ **Expected:** Analytics dashboard loads with 4 stat cards.

### Step 32 — Verify Each Stat Card
Check that the following are showing correctly:
1. **Jobs Posted** — Should match the number of jobs Rajesh has created. ✅
2. **Workers Hired** — Should reflect unique workers who applied/were hired. ✅
3. **Equipment Rentals** — Should show the rental requested in Step 20. ✅
4. **Money Saved** — Should show an ₹ amount representing savings vs. middleman rates. ✅

### Step 33 — Jobs Progress Bar
1. On the same Analytics screen, look for the jobs completion progress bar.
2. ✅ **Expected:** Bar shows ratio of completed vs total jobs (e.g., "1 of 2 jobs completed — 50%").

### Step 34 — Money Saved Callout Box
1. Scroll to the bottom of the Analytics screen.
2. ✅ **Expected:** A highlighted green box displays the total money saved this season vs. using middlemen (e.g., *"🎉 You saved approximately ₹2,610 this season!"*)

### Step 35 — Analytics Not Visible to Worker
1. Switch to Tab 2 (Worker — Ganesh Shinde).
2. Check the navigation.
3. ✅ **Expected:** "My Stats" / Analytics option is NOT visible to a worker. It is farmer-only.

---

---

## PHASE 10 — Live Activity Feed Testing

### Step 36 — Open Activity Feed
1. In any tab, navigate to the Activity Feed page (`/api/activity`).
2. ✅ **Expected:** A chronological list of recent events is shown (job posted, worker applied, rental requested, job completed, rating given).

### Step 37 — Verify Localized Time Labels
1. Check that time labels are localized (e.g., "2 minutes ago" / "2 मिनिटांपूर्वी" / "2 मिनट पहले") based on selected language.
2. ✅ **Expected:** Time-ago labels match the currently selected language.

### Step 38 — Real-Time Feed Update
1. While viewing the Activity Feed in Tab 1, perform an action in Tab 2 (Worker applies to a job).
2. ✅ **Expected:** The activity feed in Tab 1 updates automatically without page refresh.

---

---

## PHASE 11 — Edge Case & Error Handling Testing

### Step 39 — Crop Scan with Invalid Image
1. Try uploading a non-plant image (e.g., a selfie or a car photo) to the Crop Scan screen.
2. ✅ **Expected:** App doesn't crash. AI either identifies it as not a crop or returns a graceful message.

### Step 40 — No Location Permission
1. Deny location access completely.
2. Open the Workers and Jobs pages.
3. ✅ **Expected:** App falls back to Pune coordinates and still works normally. No crash or blank screen.

### Step 41 — Network Error on Crop Scan
1. Turn off internet (or stop the backend server briefly) and try scanning a crop.
2. ✅ **Expected:** A user-friendly error message appears ("Could not analyse. Please try again."). App does not freeze.

### Step 42 — Worker Cannot Post a Job
1. In Tab 2 (Worker), try to access the "Post a Job" screen (if visible at all).
2. ✅ **Expected:** Either the option is hidden entirely, or the API returns a permission error gracefully.

---

---

## Final Demo Checklist ✅

Before your April 7th presentation, verify these 10 things work perfectly:

| # | Check | Status |
|---|-------|--------|
| 1 | Login works for all 3 roles | ☐ |
| 2 | Language switcher works (EN → HI → MR) | ☐ |
| 3 | GPS detects location and sorts workers by distance | ☐ |
| 4 | Weather strip shows on Jobs page | ☐ |
| 5 | Job posted by Farmer → Worker gets instant notification | ☐ |
| 6 | Worker applies → Farmer gets instant notification | ☐ |
| 7 | Crop photo uploaded → AI returns disease result in correct language | ☐ |
| 8 | Job marked complete → Rating modal appears → Stars submitted | ☐ |
| 9 | Worker card shows star rating and trust badge | ☐ |
| 10 | Farmer Analytics shows all 4 stats + money saved callout | ☐ |

---

## Suggested Demo Flow (for April 7th)

Walk the judge through this story in under 5 minutes:

1. *"Meet Rajesh, a farmer in Pune. It's harvest season."* → Login as Farmer, show GPS-sorted workers nearby.
2. *"He posts a job using his voice in Marathi."* → Use Voice Assistant to post a job.
3. *"Ganesh, a worker nearby, instantly sees it and applies."* → Switch to Worker tab, apply to the job.
4. *"Rajesh gets notified in real-time."* → Show the live notification on the Farmer tab.
5. *"His crop looks sick. He scans it."* → Open Crop Scan, upload a leaf photo, show the AI result in Marathi.
6. *"Rain is coming — the app warns him."* → Show the Weather banner on the Jobs page.
7. *"He rents a tractor nearby."* → Request equipment rental, show Equipment Owner gets notified.
8. *"Job done. He rates Ganesh."* → Mark job complete, submit star rating, show Ganesh's trust badge.
9. *"End of season — how did he do?"* → Open Farmer Analytics, show the money saved callout box.

**That's your winning demo. 🏆**
