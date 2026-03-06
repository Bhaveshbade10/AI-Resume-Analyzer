'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { portfolioAnalyze } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ScoreGauge } from '@/components/ScoreGauge';

type Analysis = {
  overall_score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  content_suggestions: string[];
  presentation_tips: string[];
  seo_visibility_tips: string[];
};

export default function PortfolioPage() {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Paste your portfolio content first.');
      return;
    }
    setError('');
    setAnalysis(null);
    setLoading(true);
    try {
      const data = await portfolioAnalyze(text.trim());
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
        <p className="text-slate-600 mb-4">Please log in to use the portfolio analyzer.</p>
        <a href="/login" className="btn-primary">Sign in</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Portfolio Analyzer</h1>
      <div className="card mb-6">
        <p className="text-slate-600 text-sm mb-4">
          Paste your portfolio content: about section, project descriptions, case studies, links, or any text from your portfolio site.
        </p>
        <form onSubmit={handleAnalyze} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your portfolio content here..."
            className="input-field min-h-[220px]"
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <LoadingSpinner className="w-5 h-5 inline" /> : 'Analyze portfolio'}
          </button>
        </form>
      </div>

      {analysis && (
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Overall score</h2>
            <ScoreGauge score={analysis.overall_score} label="Portfolio" />
          </div>
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Strengths</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="card md:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Weaknesses</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              {analysis.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
              {analysis.weaknesses.length === 0 && <li className="text-slate-500">None highlighted</li>}
            </ul>
          </div>
          <div className="card md:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Improvements</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              {analysis.improvements.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          {analysis.content_suggestions?.length > 0 && (
            <div className="card md:col-span-2">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Content suggestions</h2>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {analysis.content_suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
          {analysis.presentation_tips?.length > 0 && (
            <div className="card md:col-span-2">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Presentation tips</h2>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {analysis.presentation_tips.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
          {analysis.seo_visibility_tips?.length > 0 && (
            <div className="card md:col-span-2">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">SEO & visibility tips</h2>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {analysis.seo_visibility_tips.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
