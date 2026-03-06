'use client';

type Props = { score: number; label?: string };

export function ScoreGauge({ score, label = 'ATS Score' }: Props) {
  const p = Math.min(100, Math.max(0, score));
  const color = p >= 70 ? '#10b981' : p >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${p}, 100`}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-800">
          {Math.round(p)}
        </span>
      </div>
      <span className="text-sm font-medium text-slate-600 mt-2">{label}</span>
    </div>
  );
}
