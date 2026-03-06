# Deploy AI Resume Analyzer – Step by Step

Do these in order. Total time: ~15 minutes.

---

## Prerequisites

- GitHub account
- [Vercel](https://vercel.com) account (free)
- [Render](https://render.com) account (free tier)
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

## Step 2: Deploy backend + database on Render

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
2. Connect your **GitHub** account and select the repo that contains `ai-resume-analyzer` (and `render.yaml` at the path shown below).
3. **Blueprint file path:**  
   - If repo root is `ai-resume-analyzer`: leave as `render.yaml`.  
   - If repo root is the parent folder: set to `ai-resume-analyzer/render.yaml`.
4. Click **Apply**.
5. Render will create:
   - A **PostgreSQL** database (`ai-resume-db`)
   - A **Web Service** (`ai-resume-backend`)
6. For the web service, you’ll be prompted for **secret** env vars:
   - **GROQ_API_KEY:** paste your Groq API key.
   - **CORS_ORIGIN:** leave empty for now (you’ll set it after deploying the frontend).
7. Click **Create resources** and wait for the backend to build and deploy.
8. After deploy, open your backend URL (e.g. `https://ai-resume-backend-xxxx.onrender.com`) and add `/health`. You should see `{"status":"ok",...}`.
9. Run migrations once (from your machine, with production DB URL from Render):
   - In Render: **ai-resume-backend** → **Environment** → copy **DATABASE_URL** (Internal).
   - Locally:
     ```bash
     cd ai-resume-analyzer/backend
     DATABASE_URL="<paste-internal-url>" npx prisma db push
     ```
   - Or in Render: **Shell** tab for the backend service and run:
     ```bash
     npx prisma db push
     ```
     (DATABASE_URL is already set there.)

**Note your backend URL** (e.g. `https://ai-resume-backend-xxxx.onrender.com`). No trailing slash.

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
     - **Value:** your backend URL from Step 2 (e.g. `https://ai-resume-backend-xxxx.onrender.com`)
4. Click **Deploy** and wait for the build to finish.
5. **Note your frontend URL** (e.g. `https://ai-resume-analyzer-xxx.vercel.app`).

---

## Step 4: Point backend to frontend (CORS)

1. In Render → **ai-resume-backend** → **Environment**.
2. Set **CORS_ORIGIN** to your **exact** Vercel URL (e.g. `https://ai-resume-analyzer-xxx.vercel.app`). No trailing slash.
3. Save. Render will redeploy the backend.

---

## Step 5: Verify

- Backend: open `https://your-backend-url.onrender.com/health` → `{"status":"ok"}`.
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

- **Render free tier:** The backend may spin down after ~15 min of no traffic. The first request after that can take 30–60 seconds (cold start). Paid plans avoid this.
- **Groq:** Use a valid API key; keep it secret and rotate if it was ever exposed.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS errors in browser | Set backend `CORS_ORIGIN` to exact Vercel origin (no trailing slash). |
| 401 / “Invalid token” | Frontend must use same backend URL in `NEXT_PUBLIC_API_URL`. |
| DB connection failed | Use **Internal** Database URL for backend on Render; **External** if backend is elsewhere. |
| Build fails (Prisma) | Ensure build command includes `npx prisma generate`. |
