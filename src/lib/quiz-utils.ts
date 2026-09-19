import type { AnswerKey, ChapterScore, Question } from "@/types/quiz";

export function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickRandomQuestions(
  pool: Question[],
  count: number
): Question[] {
  const shuffled = shuffle(pool);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function isAnswerCorrect(
  question: Question,
  answer: AnswerKey | null | undefined
): boolean {
  return answer != null && answer === question.correct_answer;
}

export function computeScore(
  questions: Question[],
  answers: Record<number, AnswerKey | null>
): { correct: number; total: number; percent: number } {
  const total = questions.length;
  let correct = 0;
  for (const q of questions) {
    if (isAnswerCorrect(q, answers[q.id])) correct += 1;
  }
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { correct, total, percent };
}

export function computeChapterBreakdown(
  questions: Question[],
  answers: Record<number, AnswerKey | null>
): ChapterScore[] {
  const map = new Map<
    number,
    { title: string; correct: number; total: number }
  >();

  for (const q of questions) {
    const entry = map.get(q.chapter) ?? {
      title: q.chapter_title,
      correct: 0,
      total: 0,
    };
    entry.total += 1;
    if (isAnswerCorrect(q, answers[q.id])) entry.correct += 1;
    map.set(q.chapter, entry);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([chapter, { title, correct, total }]) => ({
      chapter,
      title,
      correct,
      total,
      percent: total === 0 ? 0 : Math.round((correct / total) * 100),
    }));
}

export function getIncorrectQuestionIds(
  questions: Question[],
  answers: Record<number, AnswerKey | null>
): number[] {
  return questions
    .filter((q) => !isAnswerCorrect(q, answers[q.id]))
    .map((q) => q.id);
}
