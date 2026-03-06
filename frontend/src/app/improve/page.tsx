'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getResumes, improveResume } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type Improvements = {
  improved_bullet_points?: string[];
  improved_summary?: string;
  action_verbs?: string[];
  ats_tips?: string[];
};

export default function ImprovePage() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<{ id: string; fileName: string | null }[]>([]);
  const [resumeId, setResumeId] = useState('');
  const [improvements, setImprovements] = useState<Improvements | null>(null);
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

  const handleImprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeId) {
      setError('Select a resume first, or upload one.');
      return;
    }
    setError('');
    setImprovements(null);
    setLoading(true);
    try {
      const data = await improveResume({ resumeId });
      setImprovements(data.improvements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate improvements');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="card text-center py-12">
        <p className="text-slate-600 mb-4">Please log in to use the improvement generator.</p>
        <a href="/login" className="btn-primary">Sign in</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Resume Improvement Generator</h1>
      <div className="card mb-6">
        <p className="text-slate-600 text-sm mb-4">
          Get AI-generated improved bullet points, summary, action verbs, and ATS tips.
        </p>
        <form onSubmit={handleImprove} className="space-y-4">
          {resumes.length > 0 ? (
            <>
              <label className="block text-sm font-medium text-slate-700">Resume</label>
              <select
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                className="input-field"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>{r.fileName || r.id}</option>
                ))}
              </select>
            </>
          ) : (
            <p className="text-amber-700 text-sm">Upload a resume first from the Upload page.</p>
          )}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading || resumes.length === 0}>
            {loading ? <LoadingSpinner className="w-5 h-5 inline" /> : 'Generate improvements'}
          </button>
        </form>
      </div>

      {improvements && (
        <div className="space-y-6 animate-fade-in">
          {improvements.improved_summary && (
            <div className="card">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Improved summary</h2>
              <p className="text-slate-700 whitespace-pre-wrap">{improvements.improved_summary}</p>
            </div>
          )}
          {improvements.improved_bullet_points && improvements.improved_bullet_points.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Improved bullet points</h2>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                {improvements.improved_bullet_points.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
          {improvements.action_verbs && improvements.action_verbs.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Strong action verbs</h2>
              <div className="flex flex-wrap gap-2">
                {improvements.action_verbs.map((v, i) => (
                  <span key={i} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">{v}</span>
                ))}
              </div>
            </div>
          )}
          {improvements.ats_tips && improvements.ats_tips.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">ATS optimization tips</h2>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {improvements.ats_tips.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
