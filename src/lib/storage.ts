import type { AnswerKey, QuizSession } from "@/types/quiz";

const SESSION_KEY = "ent312-quiz-session";

export function loadSession(): QuizSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuizSession;
  } catch {
    return null;
  }
}

export function saveSession(session: QuizSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function createSession(
  partial: Omit<QuizSession, "phase" | "currentIndex" | "answers"> & {
    currentIndex?: number;
    answers?: Record<number, AnswerKey | null>;
  }
): QuizSession {
  return {
    phase: "in_progress",
    currentIndex: partial.currentIndex ?? 0,
    answers: partial.answers ?? {},
    mode: partial.mode,
    questionIds: partial.questionIds,
    fullTestCount: partial.fullTestCount,
    selectedChapters: partial.selectedChapters,
  };
}
