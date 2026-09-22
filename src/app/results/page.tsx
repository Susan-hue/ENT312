"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChapterBreakdown } from "@/components/ChapterBreakdown";
import { PageShell } from "@/components/PageShell";
import { ReviewList } from "@/components/ReviewList";
import { SectionBanner } from "@/components/SectionBanner";
import { getQuestionsByIds, getSectionLabel } from "@/lib/questions";
import {
  computeChapterBreakdown,
  computeScore,
  getIncorrectQuestionIds,
} from "@/lib/quiz-utils";
import { clearSession, createSession, loadSession, saveSession } from "@/lib/storage";
import { getSelectedSectionId } from "@/lib/section-context";
import type { QuizSession } from "@/types/quiz";

export default function ResultsPage() {
  const router = useRouter();
  const [session, setSession] = useState<QuizSession | null>(null);

  useEffect(() => {
    const sectionId = getSelectedSectionId();
    const stored = sectionId ? loadSession(sectionId) : null;
    if (!stored || stored.phase !== "completed") {
      router.replace("/");
      return;
    }
    setSession(stored);
  }, [router]);

  const questions = useMemo(() => {
    if (!session) return [];
    return getQuestionsByIds(session.sectionId, session.questionIds);
  }, [session]);

  const score = useMemo(() => {
    if (!session) return { correct: 0, total: 0, percent: 0 };
    return computeScore(questions, session.answers);
  }, [session, questions]);

  const chapterScores = useMemo(() => {
    if (!session) return [];
    return computeChapterBreakdown(questions, session.answers);
  }, [session, questions]);

  function retryIncorrect() {
    if (!session) return;
    const wrongIds = getIncorrectQuestionIds(questions, session.answers);
    if (wrongIds.length === 0) return;
    clearSession(session.sectionId);
    const next = createSession({
      sectionId: session.sectionId,
      mode: "retry",
      questionIds: wrongIds,
    });
    saveSession(next);
    router.push("/quiz");
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-slate-600">Loading results…</p>
      </main>
    );
  }

  const wrongCount = questions.length - score.correct;
  const canRetry = wrongCount > 0;

  return (
    <PageShell className="py-6 sm:py-8">
      <SectionBanner label={getSectionLabel(session.sectionId)} />
      <header className="mb-6 text-center">
        <p className="text-sm font-medium text-slate-500">Test complete</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          {score.correct} / {score.total}
        </h1>
        <p
          className={`mt-1 text-xl font-semibold ${
            score.percent >= 70
              ? "text-emerald-600"
              : score.percent >= 50
                ? "text-amber-600"
                : "text-red-600"
          }`}
        >
          {score.percent}%
        </p>
      </header>

      <div className="sticky-top-safe sticky z-10 -mx-4 mb-6 border-b border-slate-200/80 bg-slate-100/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          {canRetry && (
            <button
              type="button"
              onClick={retryIncorrect}
              className="btn-touch flex-1 rounded-xl border-2 border-emerald-600 bg-emerald-50 text-sm text-emerald-800 active:bg-emerald-100 sm:text-base"
            >
              Retry wrong ({wrongCount})
            </button>
          )}
          <Link
            href="/"
            onClick={() => clearSession(session.sectionId)}
            className="btn-primary flex flex-1 items-center justify-center text-center text-sm sm:text-base"
          >
            New test
          </Link>
        </div>
      </div>

      <section className="mb-8">
        <ChapterBreakdown scores={chapterScores} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Full review
        </h2>
        <ReviewList questions={questions} answers={session.answers} />
      </section>

      <div className="mt-8 text-center">
        <Link
          href="/"
          onClick={() => clearSession(session.sectionId)}
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          Back to home
        </Link>
      </div>
    </PageShell>
  );
}
