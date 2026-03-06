# Deployment Guide: AI Resume Analyzer

## Overview

- **Frontend:** Vercel (Next.js)
- **Backend:** Railway (recommended) or Render (Node + Express)
- **Database:** PostgreSQL (Railway Postgres, Render Postgres, or Neon/Supabase)

---

## 1. Backend + Database on Railway (recommended)

The backend includes `backend/railway.json` so Railway auto-detects build and start commands.

1. Go to [Railway](https://railway.app) → **New Project**.
2. **Add PostgreSQL:** Click **New** → **Database** → **PostgreSQL**. Railway creates the DB and exposes `DATABASE_URL` to the project.
3. **Add backend service:** Click **New** → **GitHub Repo** → select your `AI-Resume-Analyzer` repo.
4. **Set Root Directory:** In the new service → **Settings** → **Root Directory** → set to `backend` (so Railway uses the `backend/` folder and finds `railway.json`).
5. **Link database:** In the backend service → **Variables** → **Add variable** → **Add reference** → choose the PostgreSQL service → select `DATABASE_URL`. (Or Railway may auto-inject it if both are in the same project.)
6. **Add env vars** in the backend service:
   - `JWT_SECRET` – e.g. run `openssl rand -hex 32` locally and paste.
   - `GROQ_API_KEY` – from [Groq Console](https://console.groq.com).
   - `CORS_ORIGIN` – leave empty for now; set after deploying the frontend (your Vercel URL, no trailing slash).
   - `NODE_ENV` = `production` (optional).
7. **Generate domain:** Backend service → **Settings** → **Networking** → **Generate Domain**. Note the URL (e.g. `https://ai-resume-analyzer-backend-production-xxxx.up.railway.app`).
8. **Run migrations once:** Backend service → **Settings** → **Deploy** → run in **Shell** (or use Railway CLI):  
   `npx prisma db push`
9. Deploy runs automatically. Check **Deployments** and open `https://your-backend-url/health` → should return `{"status":"ok"}`.

---

## 2. Database only (if not using Railway backend)

### Option A: Railway

1. [Railway](https://railway.app) → New Project → **New** → **Database** → **PostgreSQL**.
2. Variables tab → copy `DATABASE_URL` (use in backend env).

### Option B: Render

1. [Render](https://render.com) → Dashboard → New → PostgreSQL.
2. Note **Internal** (backend on Render) or **External** (backend elsewhere) Database URL.

### Option C: Neon / Supabase

Create a project and copy the connection string as `DATABASE_URL`.

---

## 3. Backend on Render (alternative)

1. New → Web Service → connect repo; **Root Directory** = `backend`.
2. Build: `npm install && npx prisma generate` | Start: `npm start`.
3. Env: `DATABASE_URL`, `JWT_SECRET`, `GROQ_API_KEY`, `CORS_ORIGIN`, `NODE_ENV=production`.
4. Deploy and run `npx prisma db push` once (e.g. Shell or locally with prod `DATABASE_URL`).

### Run migrations

On first deploy (or from local with production `DATABASE_URL`):

```bash
cd backend
npx prisma db push
```

---

## 4. Frontend (Vercel)

1. [Vercel](https://vercel.com) → Import your Git repository.
2. Set **Root Directory** to `ai-resume-analyzer/frontend` (or frontend-only repo).
3. Environment variable:
   - `NEXT_PUBLIC_API_URL` = your backend URL (e.g. `https://your-backend.onrender.com`)
4. Deploy.

### Next.js rewrites (optional)

If you use the project’s `next.config.js` rewrites, `/api-backend/*` is proxied to `NEXT_PUBLIC_API_URL`. So the frontend calls `/api-backend/...` and no CORS issues with same-origin. Ensure `NEXT_PUBLIC_API_URL` is set in Vercel to your backend URL.

---

## 5. Post-deploy checklist

- [ ] Backend health: open `https://your-backend-url/health` → `{"status":"ok"}`
- [ ] Frontend loads and shows Login/Register
- [ ] Register → Upload resume → Dashboard shows analysis
- [ ] Job Matcher and LinkedIn analyzer work with the deployed backend
- [ ] Backend `CORS_ORIGIN` equals the exact Vercel URL (no trailing slash)

---

## 6. Troubleshooting

- **CORS errors:** Set backend `CORS_ORIGIN` to the exact Vercel origin (e.g. `https://yourapp.vercel.app`).
- **Database connection:** Use the URL given by your provider; for Render internal DB use Internal URL when backend is on Render.
- **Prisma:** Always run `npx prisma generate` in the build step and `npx prisma db push` (or migrations) once for the production DB.
