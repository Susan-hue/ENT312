interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((current / total) * 100);

  return (
    <div className="w-full">
      {label && (
        <p className="mb-1 text-sm font-medium text-slate-600">{label}</p>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-emerald-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
