"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  filterQuestionsByChapters,
  getAllQuestions,
  getChapterList,
  getCourseMeta,
} from "@/lib/questions";
import { pickRandomQuestions } from "@/lib/quiz-utils";
import { PageShell } from "@/components/PageShell";
import { clearSession, createSession, loadSession, saveSession } from "@/lib/storage";

const DEFAULT_FULL_COUNT = 50;

export default function HomePage() {
  const router = useRouter();
  const meta = getCourseMeta();
  const chapters = useMemo(() => getChapterList(), []);
  const totalAvailable = getAllQuestions().length;

  const [mode, setMode] = useState<"full" | "chapter">("full");
  const [questionCount, setQuestionCount] = useState(DEFAULT_FULL_COUNT);
  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [resumeAvailable, setResumeAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = loadSession();
    setResumeAvailable(session?.phase === "in_progress");
  }, []);

  function toggleChapter(chapter: number) {
    setSelectedChapters((prev) =>
      prev.includes(chapter)
        ? prev.filter((c) => c !== chapter)
        : [...prev, chapter].sort((a, b) => a - b)
    );
  }

  function selectAllChapters() {
    setSelectedChapters(chapters.map((c) => c.chapter));
  }

  function clearChapterSelection() {
    setSelectedChapters([]);
  }

  function startQuiz(
    ids: number[],
    quizMode: "full" | "chapter" | "retry",
    extras?: { fullTestCount?: number; selectedChapters?: number[] }
  ) {
    if (ids.length === 0) {
      setError("No questions available for this selection.");
      return;
    }
    setError(null);
    clearSession();
    const session = createSession({
      mode: quizMode,
      questionIds: ids,
      ...extras,
    });
    saveSession(session);
    router.push("/quiz");
  }

  function handleStartFull() {
    const count = Math.min(
      Math.max(1, questionCount),
      totalAvailable
    );
    const picked = pickRandomQuestions(getAllQuestions(), count);
    startQuiz(
      picked.map((q) => q.id),
      "full",
      { fullTestCount: count }
    );
  }

  function handleStartChapter() {
    if (selectedChapters.length === 0) {
      setError("Select at least one chapter.");
      return;
    }
    const pool = filterQuestionsByChapters(selectedChapters);
    const picked = pickRandomQuestions(pool, pool.length);
    startQuiz(picked.map((q) => q.id), "chapter", {
      selectedChapters: [...selectedChapters],
    });
  }

  function handleResume() {
    router.push("/quiz");
  }

  function handleAbandonResume() {
    clearSession();
    setResumeAvailable(false);
  }

  return (
    <PageShell className="py-6 sm:py-8">
      <header className="mb-8">
        <p className="text-sm font-medium text-emerald-700">{meta.level}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {meta.course}
        </h1>
        <p className="mt-2 text-sm text-slate-600">{meta.description}</p>
        <p className="mt-1 text-xs text-slate-500">
          {totalAvailable} questions · Chapters 1–20
        </p>
      </header>

      {resumeAvailable && (
        <section className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">
            You have a quiz in progress.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleResume}
              className="btn-primary w-auto flex-1 px-4 py-2.5 text-sm sm:flex-none"
            >
              Resume quiz
            </button>
            <button
              type="button"
              onClick={handleAbandonResume}
              className="btn-secondary w-auto flex-1 px-4 py-2.5 text-sm sm:flex-none"
            >
              Start fresh
            </button>
          </div>
        </section>
      )}

      <div className="mb-4 flex rounded-xl bg-slate-200 p-1">
        <button
          type="button"
          onClick={() => setMode("full")}
          className={`btn-touch flex-1 rounded-lg py-3 text-sm transition-colors sm:py-2.5 ${
            mode === "full"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Full test
        </button>
        <button
          type="button"
          onClick={() => setMode("chapter")}
          className={`btn-touch flex-1 rounded-lg py-3 text-sm transition-colors sm:py-2.5 ${
            mode === "chapter"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          By chapter
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {mode === "full" ? (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Full test</h2>
          <p className="mt-1 text-sm text-slate-600">
            Random questions from all chapters. No feedback until you submit —
            real CBT style.
          </p>
          <label className="mt-4 block text-sm font-medium text-slate-700">
            Number of questions
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={totalAvailable}
              value={questionCount}
              onChange={(e) =>
                setQuestionCount(parseInt(e.target.value, 10) || DEFAULT_FULL_COUNT)
              }
              className="mt-1 w-full min-h-12 rounded-lg border border-slate-300 px-3 py-2 text-base"
            />
          </label>
          <p className="mt-1 text-xs text-slate-500">
            Default {DEFAULT_FULL_COUNT}, max {totalAvailable}
          </p>
          <button
            type="button"
            onClick={handleStartFull}
            className="btn-primary mt-5"
          >
            Start full test
          </button>
        </section>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Practice by chapter
            </h2>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={selectAllChapters}
                className="min-h-10 touch-manipulation px-2 font-medium text-emerald-700 active:underline"
              >
                All
              </button>
              <button
                type="button"
                onClick={clearChapterSelection}
                className="min-h-10 touch-manipulation px-2 font-medium text-slate-600 active:underline"
              >
                Clear
              </button>
            </div>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Select one or more chapters. All questions from those chapters are
            included (shuffled).
          </p>
          <ul className="mt-4 max-h-[min(55dvh,28rem)] space-y-2 overflow-y-auto overscroll-contain pr-1 [-webkit-overflow-scrolling:touch]">
            {chapters.map((ch) => {
              const checked = selectedChapters.includes(ch.chapter);
              return (
                <li key={ch.chapter}>
                  <label
                    className={`flex min-h-[3.25rem] cursor-pointer touch-manipulation items-start gap-3 rounded-lg border px-3 py-3 active:bg-slate-50 ${
                      checked
                        ? "border-emerald-300 bg-emerald-50/50"
                        : "border-slate-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleChapter(ch.chapter)}
                      className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-emerald-600"
                    />
                    <span className="min-w-0 flex-1 text-sm">
                      <span className="font-semibold text-slate-900">
                        Chapter {ch.chapter}
                      </span>
                      <span className="block text-slate-600">{ch.title}</span>
                      <span className="text-xs text-slate-500">
                        {ch.questionCount} question
                        {ch.questionCount === 1 ? "" : "s"}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={handleStartChapter}
            className="btn-primary mt-5"
          >
            Start chapter practice
          </button>
        </section>
      )}

      <p className="mt-8 text-center text-xs text-slate-500">
        Progress is saved in this browser.{" "}
        <Link href="/" className="text-emerald-700 hover:underline">
          Home
        </Link>
      </p>
    </PageShell>
  );
}
