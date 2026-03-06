'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { getResumes, getAnalysis } from '@/lib/api';
import { ScoreGauge } from '@/components/ScoreGauge';
import { SkillsChart } from '@/components/SkillsChart';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type ResumeSummary = {
  id: string;
  fileName: string | null;
  score: number | null;
  skills: string[];
  experienceLevel: string | null;
  createdAt: string;
};

type Analysis = {
  id: string;
  fileName: string | null;
  score: number | null;
  skills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  experienceLevel: string | null;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const resumeIdParam = searchParams.get('resume');

  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(resumeIdParam);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    getResumes()
      .then((r) => {
        setResumes(r.resumes);
        if (resumeIdParam && r.resumes.some((x: ResumeSummary) => x.id === resumeIdParam)) {
          setSelectedId(resumeIdParam);
        } else if (r.resumes.length && !selectedId) {
          setSelectedId(r.resumes[0].id);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!selectedId || !user) return;
    setLoadingAnalysis(true);
    getAnalysis(selectedId)
      .then((r) => setAnalysis(r.resume))
      .catch((e) => setError(e.message))
      .finally(() => setLoadingAnalysis(false));
  }, [selectedId, user]);

  if (!user) {
    return (
      <div className="card text-center py-12">
        <p className="text-slate-600 mb-4">Please log in to view your dashboard.</p>
        <Link href="/login" className="btn-primary">Sign in</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Resume Dashboard</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {resumes.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate-600 mb-4">No resumes yet. Upload one to see analysis here.</p>
          <Link href="/upload" className="btn-primary">Upload Resume</Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {resumes.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedId === r.id ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {r.fileName || r.id.slice(0, 8)}
              </button>
            ))}
          </div>

          {loadingAnalysis ? (
            <div className="card flex justify-center py-12">
              <LoadingSpinner className="w-10 h-10" />
            </div>
          ) : analysis ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Resume Score</h2>
                <ScoreGauge score={analysis.score ?? 0} label="ATS Compatibility" />
                {analysis.experienceLevel && (
                  <p className="mt-4 text-sm text-slate-600">
                    Experience level: <strong>{analysis.experienceLevel}</strong>
                  </p>
                )}
              </div>
              <div className="card">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Skills</h2>
                <SkillsChart skills={analysis.skills || []} missingSkills={analysis.missingSkills || []} />
              </div>
              <div className="card md:col-span-2">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Missing Skills</h2>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  {(analysis.missingSkills || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                  {(analysis.missingSkills || []).length === 0 && (
                    <li className="text-slate-500">None identified</li>
                  )}
                </ul>
              </div>
              <div className="card md:col-span-2">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">AI Suggestions</h2>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  {(analysis.suggestions || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                  {(analysis.suggestions || []).length === 0 && (
                    <li className="text-slate-500">No suggestions yet</li>
                  )}
                </ul>
              </div>
              <div className="card">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Strengths</h2>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  {(analysis.strengths || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="card">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Weaknesses</h2>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  {(analysis.weaknesses || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="card py-8 text-center text-slate-500">Select a resume to view analysis.</div>
          )}

          <div className="mt-6 flex gap-4">
            <Link href="/upload" className="btn-primary">Upload another resume</Link>
            <Link href="/job-matcher" className="btn-secondary">Match with job</Link>
          </div>
        </>
      )}
    </div>
  );
}
