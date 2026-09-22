"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OptionButton } from "@/components/OptionButton";
import { PageShell } from "@/components/PageShell";
import { ProgressBar } from "@/components/ProgressBar";
import { SectionBanner } from "@/components/SectionBanner";
import { getQuestionsByIds, getSectionLabel } from "@/lib/questions";
import { loadSession, saveSession } from "@/lib/storage";
import { getSelectedSectionId } from "@/lib/section-context";
import type { AnswerKey, QuizSession } from "@/types/quiz";

const LETTERS: AnswerKey[] = ["A", "B", "C", "D"];

export default function QuizPage() {
  const router = useRouter();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sectionId = getSelectedSectionId();
    const stored = sectionId ? loadSession(sectionId) : null;
    if (!stored || stored.phase !== "in_progress") {
      router.replace("/");
      return;
    }
    setSession(stored);
    setReady(true);
  }, [router]);

  const questions = useMemo(() => {
    if (!session) return [];
    return getQuestionsByIds(session.sectionId, session.questionIds);
  }, [session]);

  const currentIndex = session?.currentIndex ?? 0;
  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const selectedAnswer =
    currentQuestion != null
      ? (session?.answers[currentQuestion.id] ?? null)
      : null;

  const persist = useCallback((next: QuizSession) => {
    setSession(next);
    saveSession(next);
  }, []);

  function selectOption(letter: AnswerKey) {
    if (!session || !currentQuestion || selectedAnswer != null) return;
    persist({
      ...session,
      answers: { ...session.answers, [currentQuestion.id]: letter },
    });
  }

  function goNext() {
    if (!session || selectedAnswer == null) return;
    if (currentIndex >= total - 1) {
      const completed: QuizSession = {
        ...session,
        phase: "completed",
        completedAt: Date.now(),
      };
      saveSession(completed);
      router.push("/results");
      return;
    }
    persist({ ...session, currentIndex: currentIndex + 1 });
  }

  function goPrevious() {
    if (!session || currentIndex <= 0) return;
    persist({ ...session, currentIndex: currentIndex - 1 });
  }

  if (!ready || !session || !currentQuestion) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-slate-600">Loading quiz…</p>
      </main>
    );
  }

  const isLast = currentIndex === total - 1;
  const isAnswered = selectedAnswer != null;
  const isCorrect = isAnswered && selectedAnswer === currentQuestion.correct_answer;
  const selectedLabel = selectedAnswer ? currentQuestion.options[selectedAnswer] : "";

  return (
    <PageShell bottomPad="quiz" className="py-4 sm:py-6">
      <SectionBanner label={getSectionLabel(session.sectionId)} />
      <div className="mb-4 flex items-center justify-between gap-2 text-sm">
        <Link
          href="/"
          className="btn-touch inline-flex min-h-10 shrink-0 items-center px-2 text-base font-medium text-slate-600 active:text-slate-900"
        >
          ← Exit
        </Link>
        <span className="text-right text-sm font-semibold tabular-nums text-slate-800 sm:text-base">
          Q {currentIndex + 1} / {total}
        </span>
      </div>

      <ProgressBar current={currentIndex + 1} total={total} />

      <article className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-5">
        <p className="text-xs font-medium leading-relaxed text-emerald-700">
          Ch. {currentQuestion.chapter} · {currentQuestion.topic}
        </p>
        <h1 className="mt-2 text-base font-semibold leading-relaxed text-slate-900 sm:text-lg sm:leading-snug">
          {currentQuestion.question}
        </h1>

        <div className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
          {LETTERS.map((letter) => (
            <OptionButton
              key={letter}
              letter={letter}
              text={currentQuestion.options[letter]}
              selected={selectedAnswer === letter}
              reveal={isAnswered}
              correctAnswer={currentQuestion.correct_answer}
              onSelect={() => selectOption(letter)}
            />
          ))}
        </div>

        {isAnswered && (
          <div
            className={`mt-5 rounded-xl border p-3 text-sm sm:p-4 ${
              isCorrect
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-red-200 bg-red-50 text-red-900"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold sm:text-base">
                {isCorrect ? "Correct!" : "Incorrect"}
              </p>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                  isCorrect
                    ? "bg-emerald-600 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {isCorrect ? "Right" : "Wrong"}
              </span>
            </div>

            <p className="mt-2 leading-relaxed">
              {isCorrect
                ? `Your answer: ${selectedLabel}`
                : `Your answer: ${selectedLabel} · Correct answer: ${currentQuestion.correct_answer} — ${currentQuestion.options[currentQuestion.correct_answer]}`}
            </p>

            <p className="mt-3 leading-relaxed text-slate-700">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </article>

      <footer className="quiz-footer-bar pt-3">
        <div className="mx-auto flex w-full max-w-lg gap-2 sm:gap-3">
          <button
            type="button"
            onClick={goPrevious}
            disabled={currentIndex === 0}
            className="btn-secondary flex-1 px-2 text-sm disabled:opacity-40 sm:text-base"
          >
            Back
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={selectedAnswer == null}
            className="btn-primary flex-[1.65] px-2 text-sm disabled:scale-100 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:active:scale-100 sm:text-base"
          >
            {isLast ? "Submit" : isAnswered ? "Next question" : "Next"}
          </button>
        </div>
      </footer>
    </PageShell>
  );
}
