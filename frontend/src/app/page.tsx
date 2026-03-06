import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          AI Resume Analyzer & Job Matcher
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
          Upload your resume, get AI-powered analysis, match with job descriptions, and receive actionable improvement suggestions.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/upload" className="btn-primary text-lg px-6 py-3">
            Upload Resume
          </Link>
          <Link href="/job-matcher" className="btn-secondary text-lg px-6 py-3">
            Match with Job
          </Link>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
        {[
          {
            title: 'Resume Analysis',
            desc: 'Extract skills, experience level, ATS score, strengths, and weaknesses.',
            href: '/upload',
          },
          {
            title: 'Job Matcher',
            desc: 'Paste a job description and see match percentage, missing skills, and tips.',
            href: '/job-matcher',
          },
          {
            title: 'Resume Improver',
            desc: 'Get improved bullet points, summary, action verbs, and ATS tips from AI.',
            href: '/improve',
          },
          {
            title: 'Cover Letter',
            desc: 'Generate a tailored cover letter from your resume and job description.',
            href: '/cover-letter',
          },
          {
            title: 'LinkedIn Analyzer',
            desc: 'Paste your LinkedIn profile text for branding and profile strength insights.',
            href: '/linkedin',
          },
          {
            title: 'GitHub Analyzer',
            desc: 'Analyze your GitHub profile: skills, README, pinned repos, visibility tips.',
            href: '/github',
          },
          {
            title: 'Portfolio Analyzer',
            desc: 'Get feedback on your portfolio: strengths, content, and presentation tips.',
            href: '/portfolio',
          },
        ].map(({ title, desc, href }) => (
          <Link key={href} href={href} className="card hover:shadow-md transition-shadow block">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">{title}</h2>
            <p className="text-slate-600 text-sm">{desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
