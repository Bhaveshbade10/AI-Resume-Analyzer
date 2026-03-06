# Host AI Resume Analyzer Backend on Render

Deploy the backend + PostgreSQL on Render in one go using the Blueprint. No manual build/start commands needed.

---

## Prerequisites

- GitHub repo: **https://github.com/Bhaveshbade10/AI-Resume-Analyzer** (already pushed)
- [Render](https://render.com) account (free)
- **Groq API key** from [console.groq.com](https://console.groq.com)

---

## Step 1: Create a Blueprint from the repo

1. Go to **[dashboard.render.com](https://dashboard.render.com)** and sign in (GitHub).
2. Click **New +** → **Blueprint**.
3. Connect your **GitHub** account if needed, then select the repo **Bhaveshbade10/AI-Resume-Analyzer**.
4. Render will detect **render.yaml** in the repo root. Click **Apply**.

---

## Step 2: Enter secret variables

Render will create:

- **PostgreSQL** database (`ai-resume-db`)
- **Web Service** (`ai-resume-backend`)

You’ll be prompted for two **secret** variables (marked `sync: false` in the Blueprint):

| Variable       | What to enter |
|----------------|----------------|
| **GROQ_API_KEY** | Your API key from [Groq Console](https://console.groq.com). |
| **CORS_ORIGIN**  | Leave **empty** for now. After you deploy the frontend (e.g. on Vercel), come back and set this to your frontend URL (e.g. `https://your-app.vercel.app`) with **no trailing slash**. |

**JWT_SECRET** and **DATABASE_URL** are set automatically by the Blueprint (generated and linked to the database).

Click **Create resources** (or **Apply**).

---

## Step 3: Wait for the first deploy

- Render will create the database and the web service, run **Build** → **Pre-deploy** (`npx prisma db push`) → **Start**.
- The first deploy may take a few minutes.
- When it’s **Live**, open your backend URL (e.g. `https://ai-resume-backend-xxxx.onrender.com`) and add **/health**. You should see:
  ```json
  {"status":"ok","timestamp":"..."}
  ```

---

## Step 4: (Optional) Set CORS after frontend is deployed

When you have a frontend URL (e.g. Vercel):

1. In Render, open the **ai-resume-backend** service.
2. Go to **Environment** (or **Variables**).
3. Set **CORS_ORIGIN** to your frontend URL, e.g. `https://your-app.vercel.app` (no trailing slash).
4. Save. Render will redeploy automatically.

---

## Summary

| What                | Where / How |
|---------------------|-------------|
| Repo                | https://github.com/Bhaveshbade10/AI-Resume-Analyzer |
| Blueprint file      | `render.yaml` in repo root |
| Backend root        | `backend` (set in Blueprint as `rootDir`) |
| Build               | `npm install && npx prisma generate` |
| Pre-deploy          | `npx prisma db push` (runs before each deploy) |
| Start               | `node src/server.js` |
| Health check        | `/health` |
| Database            | PostgreSQL `ai-resume-db` (created by Blueprint) |

---

## Troubleshooting

- **Build fails:** Ensure the repo has the `backend/` folder with `package.json`, `prisma/schema.prisma`, and `src/server.js`.
- **Health check fails:** Check **Logs** for the web service. Ensure **GROQ_API_KEY** is set (backend starts without it but other env must be correct).
- **Database errors:** Blueprint links **DATABASE_URL** from `ai-resume-db`; no need to copy it manually. If you created the DB separately, link it in the service’s **Environment**.
- **CORS errors in browser:** Set **CORS_ORIGIN** to the **exact** frontend origin (no trailing slash).

---

## Free tier note

On the free plan, the web service may **spin down** after ~15 minutes of no traffic. The first request after that can take 30–60 seconds (cold start). For always-on, use a paid plan.
