# SampleFlow MS — Setup Guide

## 🚀 Deploy in 3 Steps: Supabase + Vercel (both FREE)

---

## STEP 1 — Set up Supabase (Free Database + Auth)

1. Go to **https://supabase.com** → Sign up free
2. Click **New Project** → Name it `sampleflow` → Choose a region close to India
3. Go to **SQL Editor** → **New Query**
4. Copy the entire contents of `SUPABASE_SETUP.sql` and click **Run**
5. Go to **Authentication → Users → Invite User** and add each email:
   - cad.gmts@aaatextiles.in
   - qc@aaatextiles.in
   - prabhu.aaatextiles@gmail.com
   - merchant1@aaatextiles.in
   - merchant2@aaatextiles.in
   - merchant3@aaatextiles.in
   - merchant@aaatextiles.in
   - murugesh.k@aaatextiles.in
6. Go to **Settings → API** and copy:
   - **Project URL** (looks like: https://xxxx.supabase.co)
   - **anon public** key

---

## STEP 2 — Configure the App

1. Copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
2. Open `.env` and paste your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=YOUR_ANON_KEY
   ```

---

## STEP 3 — Deploy to Vercel (Free Hosting)

### Option A: Deploy via GitHub (recommended)
1. Push this folder to a GitHub repo
2. Go to **https://vercel.com** → Sign up free → **New Project**
3. Import your GitHub repo
4. In **Environment Variables**, add:
   - `REACT_APP_SUPABASE_URL` = your Supabase URL
   - `REACT_APP_SUPABASE_ANON_KEY` = your anon key
5. Click **Deploy** → Your app is live at `https://sampleflow.vercel.app`

### Option B: Deploy via CLI
```bash
npm install -g vercel
npm run build
vercel --prod
```

---

## Run Locally

```bash
npm install
npm start
```
Open http://localhost:3000

---

## Authorization Summary

| Email | Push Rights | Can Create |
|---|---|---|
| cad.gmts@aaatextiles.in | CAD | No |
| qc@aaatextiles.in | Cutting, Stitching | No |
| prabhu.aaatextiles@gmail.com | Washing | No |
| merchant1/2/3/merchant@aaatextiles.in | QC, Shipped | Yes |
| murugesh.k@aaatextiles.in | All stages | Yes (Admin) |

---

## Tech Stack
- **Frontend**: React 18
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (email + password)
- **Charts**: Recharts
- **Hosting**: Vercel (free)
- **Domain**: yourname.vercel.app (free) or custom domain
