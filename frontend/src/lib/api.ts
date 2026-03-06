/**
 * API client for backend
 * Uses NEXT_PUBLIC_API_URL; in browser we call same-origin /api-backend via Next rewrites
 */

const API_BASE = typeof window !== 'undefined' ? '/api-backend' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function getHeaders(includeAuth = true): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (includeAuth && token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function uploadResume(file: File) {
  const token = getToken();
  const form = new FormData();
  form.append('resume', file);
  const res = await fetch(`${API_BASE}/upload-resume`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

export async function analyzeResume(body: { resumeId?: string; resumeText?: string }) {
  const res = await fetch(`${API_BASE}/analyze-resume`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Analysis failed');
  return data;
}

export async function getAnalysis(id: string) {
  const res = await fetch(`${API_BASE}/analysis/${id}`, { headers: getHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load analysis');
  return data;
}

export async function getResumes() {
  const res = await fetch(`${API_BASE}/resumes`, { headers: getHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load resumes');
  return data;
}

export async function matchJob(body: { resumeId?: string; resumeText?: string; jobDescription: string }) {
  const res = await fetch(`${API_BASE}/match-job`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Match failed');
  return data;
}

export async function improveResume(body: { resumeId?: string; resumeText?: string }) {
  const res = await fetch(`${API_BASE}/improve-resume`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Improvement failed');
  return data;
}

export async function linkedinAnalyze(linkedInText: string) {
  const res = await fetch(`${API_BASE}/linkedin-analyze`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ linkedInText }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Analysis failed');
  return data;
}

export async function generateCoverLetter(body: {
  resumeId?: string;
  resumeText?: string;
  jobDescription: string;
  companyName?: string;
}) {
  const res = await fetch(`${API_BASE}/cover-letter`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Cover letter generation failed');
  return data;
}

export async function githubAnalyze(githubText: string) {
  const res = await fetch(`${API_BASE}/github-analyze`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ githubText }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Analysis failed');
  return data;
}

export async function portfolioAnalyze(portfolioText: string) {
  const res = await fetch(`${API_BASE}/portfolio-analyze`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ portfolioText }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Analysis failed');
  return data;
}
