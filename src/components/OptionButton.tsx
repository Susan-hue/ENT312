import type { AnswerKey } from "@/types/quiz";

interface OptionButtonProps {
  letter: AnswerKey;
  text: string;
  selected: boolean;
  onSelect: () => void;
}

export function OptionButton({
  letter,
  text,
  selected,
  onSelect,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex min-h-[3.25rem] w-full touch-manipulation gap-3 rounded-xl border-2 px-3 py-3.5 text-left transition active:scale-[0.99] sm:min-h-[3rem] sm:px-4 ${
        selected
          ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
          : "border-slate-200 bg-white active:border-slate-300 active:bg-slate-50"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold sm:h-8 sm:w-8 ${
          selected
            ? "bg-emerald-600 text-white"
            : "bg-slate-100 text-slate-700"
        }`}
      >
        {letter}
      </span>
      <span className="text-[0.9375rem] leading-snug text-slate-800 sm:text-base">
        {text}
      </span>
    </button>
  );
}
