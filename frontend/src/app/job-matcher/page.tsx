'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getResumes, matchJob } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ScoreGauge } from '@/components/ScoreGauge';

type ResumeOption = { id: string; fileName: string | null };

type MatchResult = {
  match_percentage: number;
  missing_skills: string[];
  recommended_courses: string[];
  resume_improvement_tips: string[];
};

export default function JobMatcherPage() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<ResumeOption[]>([]);
  const [resumeId, setResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    getResumes()
      .then((r) => {
        setResumes(r.resumes);
        if (r.resumes.length) setResumeId(r.resumes[0].id);
      })
      .catch(() => {});
  }, [user]);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError('Paste a job description first.');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const body: { jobDescription: string; resumeId?: string } = { jobDescription: jobDescription.trim() };
      if (resumeId) body.resumeId = resumeId;
      const data = await matchJob(body);
      setResult(data.match);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Match failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="card text-center py-12">
        <p className="text-slate-600 mb-4">Please log in to use the job matcher.</p>
        <a href="/login" className="btn-primary">Sign in</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Job Matcher</h1>
      <div className="card mb-6">
        <form onSubmit={handleMatch} className="space-y-4">
          {resumes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Resume to match</label>
              <select
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                className="input-field"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>{r.fileName || r.id}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="input-field min-h-[200px]"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <LoadingSpinner className="w-5 h-5 inline" /> : 'Match with job'}
          </button>
        </form>
      </div>

      {result && (
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Match score</h2>
            <ScoreGauge score={result.match_percentage} label="Job match %" />
          </div>
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Missing skills</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              {result.missing_skills.map((s, i) => <li key={i}>{s}</li>)}
              {result.missing_skills.length === 0 && <li className="text-slate-500">None</li>}
            </ul>
          </div>
          <div className="card md:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Resume improvement tips</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              {result.resume_improvement_tips.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="card md:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recommended courses / certifications</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              {result.recommended_courses.map((s, i) => <li key={i}>{s}</li>)}
              {result.recommended_courses.length === 0 && <li className="text-slate-500">None suggested</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
