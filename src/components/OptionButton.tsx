import type { AnswerKey } from "@/types/quiz";

interface OptionButtonProps {
  letter: AnswerKey;
  text: string;
  selected: boolean;
  onSelect: () => void;
  reveal?: boolean;
  correctAnswer?: AnswerKey;
}

export function OptionButton({
  letter,
  text,
  selected,
  onSelect,
  reveal = false,
  correctAnswer,
}: OptionButtonProps) {
  const isCorrectOption = reveal && correctAnswer === letter;
  const isWrongSelection = reveal && selected && correctAnswer !== letter;

  let buttonClass =
    "border-slate-200 bg-white active:border-slate-300 active:bg-slate-50";
  if (reveal && isCorrectOption) {
    buttonClass = "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600";
  } else if (reveal && isWrongSelection) {
    buttonClass = "border-red-500 bg-red-50 ring-1 ring-red-400";
  } else if (selected) {
    buttonClass = "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600";
  }

  let badgeClass = "bg-slate-100 text-slate-700";
  if (reveal && isCorrectOption) {
    badgeClass = "bg-emerald-600 text-white";
  } else if (reveal && isWrongSelection) {
    badgeClass = "bg-red-600 text-white";
  } else if (selected) {
    badgeClass = "bg-emerald-600 text-white";
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={reveal}
      className={`flex min-h-[3.25rem] w-full touch-manipulation gap-3 rounded-xl border-2 px-3 py-3.5 text-left transition active:scale-[0.99] disabled:cursor-default disabled:active:scale-100 sm:min-h-[3rem] sm:px-4 ${buttonClass}`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold sm:h-8 sm:w-8 ${badgeClass}`}
      >
        {letter}
      </span>
      <span className="text-[0.9375rem] leading-snug text-slate-800 sm:text-base">
        {text}
      </span>
    </button>
  );
}
