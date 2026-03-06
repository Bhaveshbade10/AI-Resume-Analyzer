'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';

export function Nav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/upload', label: 'Upload' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/job-matcher', label: 'Job Matcher' },
    { href: '/cover-letter', label: 'Cover Letter' },
    { href: '/improve', label: 'Improve' },
    { href: '/linkedin', label: 'LinkedIn' },
    { href: '/github', label: 'GitHub' },
    { href: '/portfolio', label: 'Portfolio' },
  ];

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-semibold text-primary-600 text-lg">
          AI Resume Analyzer
        </Link>
        <div className="flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium ${pathname === href ? 'text-primary-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">{user.email}</span>
              <button onClick={logout} className="btn-secondary text-sm py-1.5 px-3">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary text-sm py-1.5 px-3">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
