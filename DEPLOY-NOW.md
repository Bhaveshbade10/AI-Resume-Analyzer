# Deploy AI Resume Analyzer – Step by Step

Do these in order. Total time: ~15 minutes.

---

## Prerequisites

- GitHub account (repo already pushed, e.g. [Bhaveshbade10/AI-Resume-Analyzer](https://github.com/Bhaveshbade10/AI-Resume-Analyzer))
- [Railway](https://railway.app) account (free tier)
- [Vercel](https://vercel.com) account (free)
- Your **Groq API key** from [console.groq.com](https://console.groq.com)

---

## Step 1: Push project to GitHub

If the repo root is **only** the `ai-resume-analyzer` folder:

```bash
cd "/home/Robin1002/AI Resume Project/ai-resume-analyzer"
git init
git add .
git commit -m "Initial commit: AI Resume Analyzer"
# Create a new repo on GitHub (e.g. "ai-resume-analyzer"), then:
git remote add origin https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
git branch -M main
git push -u origin main
```

If your repo is the whole **AI Resume Project** folder (parent of `ai-resume-analyzer`), push that repo instead. Then in Render and Vercel you’ll set **Root Directory** to `ai-resume-analyzer` for the backend and `ai-resume-analyzer/frontend` for the frontend.

---

## Step 2: Deploy backend + database on Railway

The backend has **Railway config** in `backend/railway.json` (build + start + healthcheck).

1. Go to [Railway](https://railway.app) → **New Project**.
2. **Add PostgreSQL:** Click **+ New** → **Database** → **PostgreSQL**. Railway creates the DB and exposes `DATABASE_URL`.
3. **Add backend from GitHub:** Click **+ New** → **GitHub Repo** → select your repo (e.g. **Bhaveshbade10/AI-Resume-Analyzer**).
4. **Set Root Directory:** Backend service → **Settings** → **Root Directory** → set to **`backend`**. Save.
5. **Link database:** Backend → **Variables** → **+ New** → **Add reference** → PostgreSQL → **`DATABASE_URL`**.
6. **Add env vars** (Variables tab): `JWT_SECRET` (e.g. run `openssl rand -hex 32`), `GROQ_API_KEY`, `CORS_ORIGIN` (leave empty; set after Step 3), `NODE_ENV` = `production` (optional).
7. **Generate domain:** Backend → **Settings** → **Networking** → **Generate Domain**. Copy the URL. No trailing slash.
8. **Run migrations once:** Backend → open a deployment → **Shell** (or Railway CLI). Run: `npx prisma db push`.
9. Open `https://your-backend-url/health` → `{"status":"ok",...}`.

**Note your backend URL** (e.g. `https://....up.railway.app`). No trailing slash.

---

## Step 3: Deploy frontend on Vercel

1. Go to [Vercel](https://vercel.com) → **Add New** → **Project**.
2. **Import** the same GitHub repo.
3. **Configure:**
   - **Root Directory:** click **Edit** → set to `ai-resume-analyzer/frontend` (or `frontend` if repo root is `ai-resume-analyzer`).
   - **Framework Preset:** Next.js (auto).
   - **Build Command:** `npm run build` (default).
   - **Environment variables:** Add one:
     - **Name:** `NEXT_PUBLIC_API_URL`  
     - **Value:** your backend URL from Step 2 (e.g. `https://ai-resume-analyzer-backend-production-xxxx.up.railway.app`)
4. Click **Deploy** and wait for the build to finish.
5. **Note your frontend URL** (e.g. `https://ai-resume-analyzer-xxx.vercel.app`).

---

## Step 4: Point backend to frontend (CORS)

1. In Railway → open your **backend service** → **Variables**.
2. Set **CORS_ORIGIN** to your **exact** Vercel URL (e.g. `https://ai-resume-analyzer-xxx.vercel.app`). No trailing slash.
3. Save. Railway will redeploy the backend automatically.

---

## Step 5: Verify

- Backend: open `https://your-backend-url/health` (your Railway URL) → `{"status":"ok"}`.
- Frontend: open your Vercel URL → you see the app.
- **Register** a new user → **Upload** a PDF resume → run **Analysis**.
- Try **Job Matcher**, **Cover Letter**, **GitHub**, **Portfolio** to confirm they call the backend.

---

## If you don’t use the Blueprint (manual setup)

- **Database:** Render → New → PostgreSQL. Copy **Internal Database URL**.
- **Backend:** New → Web Service → same repo, **Root Directory** `ai-resume-analyzer/backend` (or `backend`).  
  **Build:** `npm install && npx prisma generate`. **Start:** `npm start`.  
  Env: `DATABASE_URL`, `JWT_SECRET` (e.g. `openssl rand -hex 32`), `GROQ_API_KEY`, `CORS_ORIGIN` (Vercel URL), `NODE_ENV=production`.
- Then run `npx prisma db push` once (via Render Shell with that service’s env, or locally with production `DATABASE_URL`).

---

## Notes

- **Railway:** Free tier has a monthly usage limit; the backend stays warm so no long cold starts.
- **Groq:** Use a valid API key; keep it secret and rotate if it was ever exposed.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS errors in browser | Set backend `CORS_ORIGIN` to exact Vercel origin (no trailing slash). |
| 401 / “Invalid token” | Frontend must use same backend URL in `NEXT_PUBLIC_API_URL`. |
| DB connection failed | On Railway, ensure backend has a **reference** to PostgreSQL `DATABASE_URL`. Run `npx prisma db push` once. |
| Build fails (Prisma) | Ensure build command includes `npx prisma generate`. |
