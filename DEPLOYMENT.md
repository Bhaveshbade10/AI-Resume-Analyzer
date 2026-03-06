# Deployment Guide: AI Resume Analyzer

## Overview

- **Frontend:** Vercel (Next.js)
- **Backend:** Render or Railway (Node + Express)
- **Database:** PostgreSQL (Render Postgres, Railway Postgres, or Neon/Supabase)

---

## 1. Database (PostgreSQL)

### Option A: Render

1. [Render](https://render.com) → Dashboard → New → PostgreSQL.
2. Create database; note **Internal Database URL** (use this in backend on Render).
3. For backend on another provider, use **External Database URL**.

### Option B: Railway

1. [Railway](https://railway.app) → New Project → Provision PostgreSQL.
2. Variables tab → copy `DATABASE_URL`.

### Option C: Neon / Supabase

Create a project and copy the connection string. Use it as `DATABASE_URL`.

---

## 2. Backend (Render or Railway)

### Render

1. New → Web Service.
2. Connect your repo; set **Root Directory** to `ai-resume-analyzer/backend` (or backend only repo).
3. Build: `npm install && npx prisma generate`
4. Start: `npm start` (or `node src/server.js`)
5. Environment variables:
   - `DATABASE_URL` – from step 1
   - `JWT_SECRET` – e.g. generate: `openssl rand -hex 32`
   - `GROQ_API_KEY` – from [Groq Console](https://console.groq.com)
   - `CORS_ORIGIN` – your Vercel frontend URL (e.g. `https://your-app.vercel.app`)
   - `NODE_ENV` = `production`
6. Deploy. Note the backend URL (e.g. `https://your-backend.onrender.com`).

### Railway

1. New Project → Deploy from GitHub; select repo and set **Root Directory** to `backend` if needed.
2. Add PostgreSQL from Railway (or use existing DB); Railway sets `DATABASE_URL` automatically if you use their Postgres.
3. Variables:
   - `JWT_SECRET`, `GROQ_API_KEY`, `CORS_ORIGIN` (Vercel frontend URL)
4. Build: `npm install && npx prisma generate`
5. Start: `npm start`
6. Deploy; note the public URL.

### Run migrations

On first deploy (or from local with production `DATABASE_URL`):

```bash
cd backend
npx prisma db push
```

---

## 3. Frontend (Vercel)

1. [Vercel](https://vercel.com) → Import your Git repository.
2. Set **Root Directory** to `ai-resume-analyzer/frontend` (or frontend-only repo).
3. Environment variable:
   - `NEXT_PUBLIC_API_URL` = your backend URL (e.g. `https://your-backend.onrender.com`)
4. Deploy.

### Next.js rewrites (optional)

If you use the project’s `next.config.js` rewrites, `/api-backend/*` is proxied to `NEXT_PUBLIC_API_URL`. So the frontend calls `/api-backend/...` and no CORS issues with same-origin. Ensure `NEXT_PUBLIC_API_URL` is set in Vercel to your backend URL.

---

## 4. Post-deploy checklist

- [ ] Backend health: open `https://your-backend-url/health` → `{"status":"ok"}`
- [ ] Frontend loads and shows Login/Register
- [ ] Register → Upload resume → Dashboard shows analysis
- [ ] Job Matcher and LinkedIn analyzer work with the deployed backend
- [ ] Backend `CORS_ORIGIN` equals the exact Vercel URL (no trailing slash)

---

## 5. Troubleshooting

- **CORS errors:** Set backend `CORS_ORIGIN` to the exact Vercel origin (e.g. `https://yourapp.vercel.app`).
- **Database connection:** Use the URL given by your provider; for Render internal DB use Internal URL when backend is on Render.
- **Prisma:** Always run `npx prisma generate` in the build step and `npx prisma db push` (or migrations) once for the production DB.
