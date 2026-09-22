export type AnswerKey = "A" | "B" | "C" | "D";

export interface QuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface Question {
  id: number;
  chapter: number;
  chapter_title: string;
  topic: string;
  question: string;
  options: QuestionOptions;
  correct_answer: AnswerKey;
  explanation: string;
  source?: string;
}

export interface QuestionSection {
  id: string;
  label: string;
  description: string;
  total_questions: number;
  questions: Question[];
}

export interface QuestionBank {
  course: string;
  level: string;
  description: string;
  total_questions: number;
  sections: QuestionSection[];
}

export type QuizMode = "full" | "chapter" | "retry";

export interface QuizSession {
  sectionId: string;
  phase: "in_progress" | "completed";
  mode: QuizMode;
  questionIds: number[];
  currentIndex: number;
  answers: Record<number, AnswerKey | null>;
  fullTestCount?: number;
  selectedChapters?: number[];
  completedAt?: number;
}

export interface ChapterInfo {
  chapter: number;
  title: string;
  questionCount: number;
}

export interface ChapterScore {
  chapter: number;
  title: string;
  correct: number;
  total: number;
  percent: number;
}
