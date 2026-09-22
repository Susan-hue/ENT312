"use client";

import { useRouter } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { getCourseMeta, getSections } from "@/lib/questions";
import { setSelectedSectionId, type SectionId } from "@/lib/section-context";

export default function SectionPickerPage() {
  const router = useRouter();
  const meta = getCourseMeta();
  const sections = getSections();

  function chooseSection(sectionId: SectionId) {
    setSelectedSectionId(sectionId);
    router.push("/practice");
  }

  return (
    <PageShell className="py-6 sm:py-8">
      <header className="mb-8 text-center sm:text-left">
        <p className="text-sm font-medium text-emerald-700">{meta.level}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {meta.course}
        </h1>
        <p className="mt-2 text-sm text-slate-600">{meta.description}</p>
      </header>

      <p className="mb-4 text-sm font-medium text-slate-700">
        Choose a question bank
      </p>

      <ul className="space-y-4">
        {sections.map((section) => {
          const count = section.questions.length;
          const empty = count === 0;
          return (
            <li key={section.id}>
              <button
                type="button"
                disabled={empty}
                onClick={() => chooseSection(section.id as SectionId)}
                className={`btn-touch w-full rounded-xl border-2 p-5 text-left shadow-sm transition active:scale-[0.99] ${
                  empty
                    ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-70"
                    : "border-emerald-200 bg-white hover:border-emerald-300 active:bg-emerald-50/30"
                }`}
              >
                <span className="block text-lg font-semibold text-slate-900">
                  {section.label}
                </span>
                <span className="mt-1 block text-sm text-slate-600">
                  {section.description}
                </span>
                <span className="mt-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {count} question{count === 1 ? "" : "s"}
                </span>
                {empty && (
                  <span className="mt-2 block text-xs text-amber-700">
                    No questions in this bank yet — add them to{" "}
                    <code className="text-[0.7rem]">questions.json</code>.
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
