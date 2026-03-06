# Deploy on Railway – Step by Step

Repo: **https://github.com/Bhaveshbade10/AI-Resume-Analyzer**

---

## 1. Create project and add PostgreSQL

1. Go to **[railway.app](https://railway.app)** and sign in (GitHub).
2. Click **"New Project"**.
3. Click **"+ New"** → **"Database"** → **"PostgreSQL"**.
4. Wait for the database to provision. Railway will show a **PostgreSQL** service.

---

## 2. Add the backend from GitHub

1. In the same project, click **"+ New"** → **"GitHub Repo"**.
2. Select **Bhaveshbade10/AI-Resume-Analyzer** (connect GitHub if asked).
3. Railway creates a new service from the repo.

---

## 3. Set Root Directory to `backend`

1. Click the **new service** (the one from GitHub, not PostgreSQL).
2. Go to **Settings**.
3. Find **"Root Directory"** (or **"Build"** section).
4. Click **"Set"** or **"Override"** and enter: **`backend`**
5. Save. This makes Railway use the `backend/` folder and its `railway.json`.

---

## 4. Link the database (DATABASE_URL)

1. Stay in the **backend service** → open the **Variables** tab.
2. Click **"+ New Variable"** or **"Add variable"**.
3. Choose **"Add reference"** (or "Variable reference").
4. Select the **PostgreSQL** service.
5. Pick the variable **`DATABASE_URL`**.
6. Confirm. Railway will inject the connection string automatically.

---

## 5. Add the rest of the env variables

In the same **Variables** tab, add:

| Variable      | Value / How to get it |
|---------------|------------------------|
| `JWT_SECRET`  | Run locally: `openssl rand -hex 32` and paste the output. |
| `GROQ_API_KEY`| Your key from [console.groq.com](https://console.groq.com). |
| `CORS_ORIGIN` | Leave empty for now. After you deploy the frontend (e.g. Vercel), set this to the frontend URL, e.g. `https://your-app.vercel.app` (no trailing slash). |
| `NODE_ENV`    | `production` (optional). |

---

## 6. Generate a public URL

1. In the backend service, go to **Settings** → **Networking** (or **"Public networking"**).
2. Click **"Generate Domain"** (or **"Add domain"**).
3. Copy the URL (e.g. `https://ai-resume-analyzer-backend-production-xxxx.up.railway.app`). **No trailing slash.**

---

## 7. Run database migrations once

1. In the backend service, open the **"Deployments"** tab.
2. After the first deploy finishes, click the **latest deployment**.
3. Open **"..."** (menu) → **"Shell"** (or use the **Shell** tab if shown).
4. In the shell, run:
   ```bash
   npx prisma db push
   ```
5. Exit the shell. The database is now ready.

---

## 8. Check that the backend is up

Open in the browser:

**`https://YOUR-RAILWAY-URL/health`**

You should see something like: `{"status":"ok","timestamp":"..."}`.

---

## 9. (Optional) Deploy frontend on Vercel

1. Go to **[vercel.com](https://vercel.com)** → **Add New** → **Project**.
2. Import **Bhaveshbade10/AI-Resume-Analyzer**.
3. Set **Root Directory** to **`frontend`**.
4. Add environment variable: **`NEXT_PUBLIC_API_URL`** = your Railway backend URL (from step 6).
5. Deploy.
6. Back in Railway, in the backend **Variables**, set **`CORS_ORIGIN`** to your Vercel URL (e.g. `https://your-app.vercel.app`). Redeploy if needed.

---

## Troubleshooting

- **Build fails:** Ensure Root Directory is exactly `backend` and that `backend/railway.json` and `backend/package.json` exist in the repo.
- **DB connection error:** Ensure the backend has the **reference** to PostgreSQL `DATABASE_URL` (step 4) and you ran `npx prisma db push` (step 7).
- **CORS errors in browser:** Set `CORS_ORIGIN` to the exact frontend origin (no trailing slash).
