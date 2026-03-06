export function LoadingSpinner({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-primary-200 border-t-primary-600 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
