'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { githubAnalyze } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ScoreGauge } from '@/components/ScoreGauge';

type Analysis = {
  skills: string[];
  profile_strength: string;
  profile_score: number;
  strengths: string[];
  improvements: string[];
  readme_suggestions: string[];
  pinned_repos_feedback: string;
  visibility_tips: string[];
};

export default function GitHubPage() {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Paste your GitHub profile content first.');
      return;
    }
    setError('');
    setAnalysis(null);
    setLoading(true);
    try {
      const data = await githubAnalyze(text.trim());
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="card text-center py-12">
        <p className="text-slate-600 mb-4">Please log in to use the GitHub analyzer.</p>
        <a href="/login" className="btn-primary">Sign in</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">GitHub Profile Analyzer</h1>
      <div className="card mb-6">
        <p className="text-slate-600 text-sm mb-4">
          Paste content from your GitHub profile: bio, README, repo descriptions, pinned projects, etc.
        </p>
        <form onSubmit={handleAnalyze} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your GitHub profile text here..."
            className="input-field min-h-[220px]"
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <LoadingSpinner className="w-5 h-5 inline" /> : 'Analyze profile'}
          </button>
        </form>
      </div>

      {analysis && (
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile score</h2>
            <ScoreGauge score={analysis.profile_score} label="GitHub profile" />
            <p className="mt-2 text-sm text-slate-600">Strength: <strong>{analysis.profile_strength}</strong></p>
          </div>
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Skills detected</h2>
            <ul className="flex flex-wrap gap-2">
              {analysis.skills.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-sm">{s}</span>
              ))}
              {analysis.skills.length === 0 && <span className="text-slate-500">None detected</span>}
            </ul>
          </div>
          <div className="card md:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Strengths</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="card md:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Improvements</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              {analysis.improvements.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          {analysis.readme_suggestions?.length > 0 && (
            <div className="card md:col-span-2">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">README suggestions</h2>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {analysis.readme_suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
          {analysis.pinned_repos_feedback && (
            <div className="card md:col-span-2">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Pinned repos feedback</h2>
              <p className="text-slate-700">{analysis.pinned_repos_feedback}</p>
            </div>
          )}
          {analysis.visibility_tips?.length > 0 && (
            <div className="card md:col-span-2">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Visibility tips</h2>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {analysis.visibility_tips.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
