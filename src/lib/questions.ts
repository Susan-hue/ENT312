import bank from "@/data/questions.json";
import type { ChapterInfo, Question, QuestionBank } from "@/types/quiz";

const data = bank as QuestionBank;

export function getAllQuestions(): Question[] {
  return data.questions;
}

export function getCourseMeta() {
  return {
    course: data.course,
    level: data.level,
    description: data.description,
    totalQuestions: data.total_questions,
  };
}

export function getQuestionsByIds(ids: number[]): Question[] {
  const map = new Map(data.questions.map((q) => [q.id, q]));
  return ids.map((id) => map.get(id)).filter((q): q is Question => q != null);
}

export function getChapterList(): ChapterInfo[] {
  const byChapter = new Map<number, ChapterInfo>();
  for (const q of data.questions) {
    const existing = byChapter.get(q.chapter);
    if (existing) {
      existing.questionCount += 1;
    } else {
      byChapter.set(q.chapter, {
        chapter: q.chapter,
        title: q.chapter_title,
        questionCount: 1,
      });
    }
  }
  return Array.from(byChapter.values()).sort((a, b) => a.chapter - b.chapter);
}

export function filterQuestionsByChapters(chapters: number[]): Question[] {
  const set = new Set(chapters);
  return data.questions.filter((q) => set.has(q.chapter));
}
