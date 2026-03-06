'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { ResumeDropzone } from '@/components/ResumeDropzone';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { uploadResume, analyzeResume } from '@/lib/api';

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'upload' | 'analyzing' | 'done'>('upload');
  const [resumeId, setResumeId] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file || !user) return;
    setError('');
    setLoading(true);
    setStep('upload');
    try {
      const { resume } = await uploadResume(file);
      setResumeId(resume.id);
      setStep('analyzing');
      await analyzeResume({ resumeId: resume.id });
      setStep('done');
      router.push(`/dashboard?resume=${resume.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="card text-center py-12">
        <p className="text-slate-600 mb-4">Please log in to upload and analyze your resume.</p>
        <a href="/login" className="btn-primary">Sign in</a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Upload Resume</h1>
      <div className="card">
        <ResumeDropzone onFile={setFile} disabled={loading} />
        {file && (
          <p className="mt-3 text-sm text-slate-600">
            Selected: <strong>{file.name}</strong>
          </p>
        )}
        {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="btn-primary"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner className="w-5 h-5" />
                {step === 'upload' ? 'Uploading...' : step === 'analyzing' ? 'Analyzing with AI...' : 'Done'}
              </span>
            ) : (
              'Upload & Analyze'
            )}
          </button>
          {resumeId && !loading && (
            <button onClick={() => router.push(`/dashboard?resume=${resumeId}`)} className="btn-secondary">
              View Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
