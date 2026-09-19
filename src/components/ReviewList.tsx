import type { AnswerKey, Question } from "@/types/quiz";
import { isAnswerCorrect } from "@/lib/quiz-utils";

const LETTERS: AnswerKey[] = ["A", "B", "C", "D"];

interface ReviewListProps {
  questions: Question[];
  answers: Record<number, AnswerKey | null>;
}

export function ReviewList({ questions, answers }: ReviewListProps) {
  return (
    <ul className="space-y-4">
      {questions.map((q, index) => {
        const userAnswer = answers[q.id] ?? null;
        const correct = isAnswerCorrect(q, userAnswer);

        return (
          <li
            key={q.id}
            className={`rounded-xl border-2 p-3.5 sm:p-4 ${
              correct
                ? "border-emerald-200 bg-emerald-50/50"
                : "border-red-200 bg-red-50/50"
            }`}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Q{index + 1}</span>
              <span>·</span>
              <span>
                Ch. {q.chapter} — {q.topic}
              </span>
              <span
                className={`ml-auto rounded-full px-2 py-0.5 font-semibold ${
                  correct
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {correct ? "Correct" : "Incorrect"}
              </span>
            </div>
            <p className="mb-3 text-[0.9375rem] font-medium leading-relaxed text-slate-900 sm:text-base">
              {q.question}
            </p>
            <ul className="mb-3 space-y-2 text-sm leading-relaxed">
              {LETTERS.map((letter) => {
                const isUser = userAnswer === letter;
                const isCorrectOption = q.correct_answer === letter;
                let className = "text-slate-700";
                if (isCorrectOption) {
                  className = "font-semibold text-emerald-800";
                } else if (isUser && !isCorrectOption) {
                  className = "font-semibold text-red-700 line-through decoration-red-400";
                }
                return (
                  <li key={letter} className={className}>
                    <span className="font-medium">{letter}.</span>{" "}
                    {q.options[letter]}
                    {isCorrectOption && (
                      <span className="ml-1 text-xs text-emerald-600">
                        (correct)
                      </span>
                    )}
                    {isUser && !isCorrectOption && (
                      <span className="ml-1 text-xs text-red-600">
                        (your answer)
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            {!userAnswer && (
              <p className="mb-2 text-sm text-amber-700">You did not select an answer.</p>
            )}
            <p className="rounded-lg bg-white/80 p-3 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Explanation: </span>
              {q.explanation}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
