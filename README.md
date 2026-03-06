# AI Resume Analyzer & Job Matcher

A full-stack application that analyzes resumes with AI (Groq/LLaMA), matches them with job descriptions, and suggests improvements. Includes LinkedIn profile analysis.

## Tech Stack

- **Frontend:** Next.js 14, React, TailwindCSS, Recharts
- **Backend:** Node.js, Express
- **AI:** Groq API (LLaMA / Mixtral)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT
- **File upload:** Multer | **PDF:** pdf-parse

## Project structure

```
ai-resume-analyzer/
├── frontend/                    # Next.js 14 app (deploy to Vercel)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx       # Root layout, Nav, AuthProvider
│   │   │   ├── page.tsx         # Home
│   │   │   ├── globals.css
│   │   │   ├── login/page.tsx   # Login / Register
│   │   │   ├── upload/page.tsx  # Resume upload + analyze
│   │   │   ├── dashboard/page.tsx # Analysis dashboard (score, charts, suggestions)
│   │   │   ├── job-matcher/page.tsx
│   │   │   ├── improve/page.tsx # Resume improvement generator
│   │   │   └── linkedin/page.tsx
│   │   ├── components/
│   │   │   ├── AuthProvider.tsx # Auth context + JWT in localStorage
│   │   │   ├── Nav.tsx
│   │   │   ├── ResumeDropzone.tsx # Drag-and-drop PDF
│   │   │   ├── ScoreGauge.tsx    # Circular score 0–100
│   │   │   ├── SkillsChart.tsx   # Recharts pie
│   │   │   └── LoadingSpinner.tsx
│   │   └── lib/
│   │       └── api.ts           # All API calls (auth, upload, analyze, match, linkedin, improve)
│   ├── .env.example             # NEXT_PUBLIC_API_URL
│   └── package.json
├── backend/                     # Express API (deploy to Render/Railway)
│   ├── prisma/
│   │   └── schema.prisma        # User, Resume, JobMatch
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT verification
│   │   │   ├── errorHandler.js  # Global error JSON
│   │   │   └── upload.js        # Multer PDF upload → backend/uploads
│   │   ├── routes/
│   │   │   ├── auth.js          # POST /api/auth/register, /login
│   │   │   ├── resume.js        # upload-resume, analyze-resume, analysis/:id, resumes, improve-resume
│   │   │   ├── jobMatch.js      # POST /api/match-job
│   │   │   └── linkedin.js      # POST /api/linkedin-analyze
│   │   ├── services/
│   │   │   ├── groqService.js   # Groq API: analyzeResume, matchJob, generateImprovements, analyzeLinkedIn
│   │   │   └── pdfParser.js     # pdf-parse to extract text
│   │   ├── app.js               # Express app, CORS, routes
│   │   └── server.js            # Start server, Prisma connect
│   ├── uploads/                 # Multer saves PDFs here (can delete after parsing)
│   ├── .env.example
│   └── package.json
├── README.md
└── DEPLOYMENT.md                # Vercel + Render/Railway steps
```

## Setup

### 1. Prerequisites

- Node.js 18+
- PostgreSQL
- [Groq API key](https://console.groq.com)

### 2. Backend

```bash
cd ai-resume-analyzer/backend
cp .env.example .env
# Edit .env: DATABASE_URL, JWT_SECRET, GROQ_API_KEY, CORS_ORIGIN

npm install
npx prisma generate
npx prisma db push

npm run dev   # http://localhost:4000
```

### 3. Frontend

```bash
cd ai-resume-analyzer/frontend
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:4000 (or your backend URL)

npm install
npm run dev   # http://localhost:3000
```

### 4. Environment variables

**Backend (`.env`):**

| Variable       | Description                          |
|----------------|--------------------------------------|
| `PORT`         | Server port (default 4000)            |
| `DATABASE_URL` | PostgreSQL connection string         |
| `JWT_SECRET`   | Secret for JWT (e.g. `openssl rand -hex 32`) |
| `GROQ_API_KEY` | API key from Groq console            |
| `CORS_ORIGIN`  | Frontend URL (e.g. http://localhost:3000) |

**Frontend (`.env.local`):**

| Variable              | Description        |
|-----------------------|--------------------|
| `NEXT_PUBLIC_API_URL` | Backend base URL   |

## API routes (backend)

| Method | Route               | Description                    |
|--------|---------------------|--------------------------------|
| POST   | /api/auth/register  | Register user                  |
| POST   | /api/auth/login     | Login, returns JWT             |
| POST   | /api/upload-resume  | Upload PDF (multipart), extract text, store |
| POST   | /api/analyze-resume | Analyze resume (body: resumeId or resumeText) |
| GET    | /api/analysis/:id   | Get analysis for resume        |
| GET    | /api/resumes        | List user resumes              |
| POST   | /api/improve-resume | Get AI improvements (resumeId or resumeText) |
| POST   | /api/match-job      | Match resume with job description |
| POST   | /api/linkedin-analyze | Analyze LinkedIn profile text |
| GET    | /health             | Health check                   |

All routes except `/api/auth/*` and `/health` require header: `Authorization: Bearer <token>`.

## Features

1. **Resume upload** – Drag & drop PDF; text extracted and stored.
2. **AI resume analysis** – Skills, experience level, ATS score, strengths, weaknesses, suggestions.
3. **Job matcher** – Paste job description; match %, missing skills, courses, improvement tips.
4. **Resume improvement** – Improved bullets, summary, action verbs, ATS tips.
5. **LinkedIn analyzer** – Paste profile text; skills, branding score, profile strength, suggestions.

## Deployment

### Backend on Render (one-click)

1. Go to [Render](https://render.com) → **New** → **Blueprint**.
2. Connect repo **Bhaveshbade10/AI-Resume-Analyzer**. Render uses **render.yaml** to create PostgreSQL + backend.
3. When prompted, set **GROQ_API_KEY** (from [Groq Console](https://console.groq.com)). Leave **CORS_ORIGIN** empty until the frontend is deployed.
4. Click **Create resources**. After the first deploy, open `https://your-service.onrender.com/health` to verify.

Full steps: **[HOST-ON-RENDER.md](./HOST-ON-RENDER.md)**.

### Other options

- **Frontend:** Deploy to [Vercel](https://vercel.com). Set `NEXT_PUBLIC_API_URL` to your backend URL.
- **Backend on Railway:** See [RAILWAY-DEPLOY.md](./RAILWAY-DEPLOY.md) or [DEPLOYMENT.md](./DEPLOYMENT.md).
- **CORS:** Set backend `CORS_ORIGIN` to your frontend URL (e.g. Vercel) when ready.

## License

MIT.
