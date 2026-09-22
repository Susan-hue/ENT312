import bank from "@/data/ent312_questions.json";
import type { ChapterInfo, Question, QuestionBank, QuestionSection } from "@/types/quiz";

const data = bank as QuestionBank;

function assertSectionsFormat(): void {
  if (!data.sections || !Array.isArray(data.sections)) {
    throw new Error(
      "questions.json must use the sections format. Run: node scripts/migrate-questions-to-sections.mjs"
    );
  }
}

assertSectionsFormat();

export function getSections(): QuestionSection[] {
  return data.sections;
}

export function getSectionById(sectionId: string): QuestionSection | undefined {
  return data.sections.find((s) => s.id === sectionId);
}

export function getSectionLabel(sectionId: string): string {
  return getSectionById(sectionId)?.label ?? sectionId;
}

export function getAllQuestions(sectionId: string): Question[] {
  const section = getSectionById(sectionId);
  return section?.questions ?? [];
}

export function getCourseMeta() {
  return {
    course: data.course,
    level: data.level,
    description: data.description,
    totalQuestions: data.total_questions,
  };
}

export function getQuestionsByIds(
  sectionId: string,
  ids: number[]
): Question[] {
  const map = new Map(
    getAllQuestions(sectionId).map((q) => [q.id, q])
  );
  return ids.map((id) => map.get(id)).filter((q): q is Question => q != null);
}

export function getChapterList(sectionId: string): ChapterInfo[] {
  const byChapter = new Map<number, ChapterInfo>();
  for (const q of getAllQuestions(sectionId)) {
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

export function filterQuestionsByChapters(
  sectionId: string,
  chapters: number[]
): Question[] {
  const set = new Set(chapters);
  return getAllQuestions(sectionId).filter((q) => set.has(q.chapter));
}
