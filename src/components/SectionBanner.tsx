import Link from "next/link";

interface SectionBannerProps {
  label: string;
  changeHref?: string;
}

export function SectionBanner({
  label,
  changeHref = "/",
}: SectionBannerProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
      <span className="text-slate-500">Question bank:</span>
      <span className="font-semibold text-emerald-800">{label}</span>
      <Link
        href={changeHref}
        className="ml-auto text-xs font-medium text-emerald-700 underline-offset-2 hover:underline"
      >
        Change bank
      </Link>
    </div>
  );
}
