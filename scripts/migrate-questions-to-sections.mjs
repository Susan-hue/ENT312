import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "../src/data/questions.json");

const data = JSON.parse(fs.readFileSync(file, "utf8"));

if (data.sections) {
  console.log("questions.json already uses sections format.");
  process.exit(0);
}

if (!Array.isArray(data.questions)) {
  console.error("Expected flat questions array at top level.");
  process.exit(1);
}

const textbookQuestions = data.questions.map((q) => ({
  ...q,
  source: q.source ?? "textbook",
}));

const migrated = {
  course: data.course,
  level: data.level,
  description:
    data.description ??
    "CBT-style multiple choice questions for ENT 312, organized into two separate, independently selectable question banks.",
  sections: [
    {
      id: "textbook",
      label: "Textbook Questions",
      description:
        "Questions covering the entire textbook (Chapters 1-20) from cover to cover.",
      total_questions: textbookQuestions.length,
      questions: textbookQuestions,
    },
    {
      id: "pdf",
      label: "ENT Questions from PDF",
      description:
        "335 exam revision questions compiled by Prof. I.C.N, covering Chapters 1-20.",
      total_questions: 0,
      questions: [],
    },
  ],
};

migrated.total_questions = migrated.sections.reduce(
  (sum, s) => sum + s.questions.length,
  0
);

fs.writeFileSync(file, JSON.stringify(migrated, null, 2));
console.log(
  `Migrated to sections: textbook=${textbookQuestions.length}, pdf=0 (add PDF questions to sections[1].questions).`
);
