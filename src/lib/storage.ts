import type { AnswerKey, QuizSession } from "@/types/quiz";
import { sessionStorageKey } from "@/lib/section-context";

export function loadSession(sectionId: string): QuizSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(sessionStorageKey(sectionId));
    if (!raw) return null;
    const session = JSON.parse(raw) as QuizSession;
    if (!session.sectionId) {
      session.sectionId = sectionId;
    }
    if (session.sectionId !== sectionId) return null;
    return session;
  } catch {
    return null;
  }
}

export function saveSession(session: QuizSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    sessionStorageKey(session.sectionId),
    JSON.stringify(session)
  );
}

export function clearSession(sectionId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(sessionStorageKey(sectionId));
}

export function createSession(
  partial: Omit<QuizSession, "phase" | "currentIndex" | "answers"> & {
    currentIndex?: number;
    answers?: Record<number, AnswerKey | null>;
  }
): QuizSession {
  return {
    phase: "in_progress",
    sectionId: partial.sectionId,
    currentIndex: partial.currentIndex ?? 0,
    answers: partial.answers ?? {},
    mode: partial.mode,
    questionIds: partial.questionIds,
    fullTestCount: partial.fullTestCount,
    selectedChapters: partial.selectedChapters,
  };
}
