import type { ChapterScore } from "@/types/quiz";

interface ChapterBreakdownProps {
  scores: ChapterScore[];
}

export function ChapterBreakdown({ scores }: ChapterBreakdownProps) {
  if (scores.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-800">
          Score by chapter
        </h2>
      </div>
      <div className="divide-y divide-slate-100">
        {scores.map((row) => (
          <div key={row.chapter} className="px-4 py-3">
            <div className="mb-2 flex flex-col gap-1 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-2">
              <span className="font-medium leading-snug text-slate-800">
                Ch. {row.chapter}: {row.title}
              </span>
              <span className="shrink-0 font-medium tabular-nums text-slate-600">
                {row.correct}/{row.total} ({row.percent}%)
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${
                  row.percent >= 70
                    ? "bg-emerald-500"
                    : row.percent >= 50
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${row.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
