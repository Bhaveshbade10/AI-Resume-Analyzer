'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getResumes, generateCoverLetter } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type ResumeOption = { id: string; fileName: string | null };

export default function CoverLetterPage() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<ResumeOption[]>([]);
  const [resumeId, setResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError('Job description is required.');
      return;
    }
    if (!resumeId && resumes.length > 0) {
      setError('Select a resume or upload one first.');
      return;
    }
    setError('');
    setCoverLetter('');
    setLoading(true);
    try {
      const body: { jobDescription: string; companyName?: string; resumeId?: string } = {
        jobDescription: jobDescription.trim(),
        companyName: companyName.trim() || undefined,
      };
      if (resumeId) body.resumeId = resumeId;
      const data = await generateCoverLetter(body);
      setCoverLetter(data.coverLetter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
  };

  if (!user) {
    return (
      <div className="card text-center py-12">
        <p className="text-slate-600 mb-4">Please log in to generate cover letters.</p>
        <a href="/login" className="btn-primary">Sign in</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">AI Cover Letter Generator</h1>
      <div className="card mb-6">
        <p className="text-slate-600 text-sm mb-4">
          Generate a tailored cover letter from your resume and the job description. Optionally add the company name.
        </p>
        <form onSubmit={handleGenerate} className="space-y-4">
          {resumes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your resume</label>
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
          {resumes.length === 0 && (
            <p className="text-amber-700 text-sm">Upload a resume from the Upload page first.</p>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company name (optional)</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Inc."
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job description *</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description..."
              className="input-field min-h-[200px]"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading || resumes.length === 0}>
            {loading ? <LoadingSpinner className="w-5 h-5 inline" /> : 'Generate cover letter'}
          </button>
        </form>
      </div>

      {coverLetter && (
        <div className="card animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Your cover letter</h2>
            <button type="button" onClick={copyToClipboard} className="btn-secondary text-sm">
              Copy to clipboard
            </button>
          </div>
          <div className="prose prose-slate max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">
              {coverLetter}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
