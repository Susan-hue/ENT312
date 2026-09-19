import type { ReactNode } from "react";

type BottomPad = "default" | "quiz" | "none";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  bottomPad?: BottomPad;
}

const bottomPadClass: Record<BottomPad, string> = {
  default: "pb-8 pb-safe-offset",
  quiz: "pb-quiz-footer",
  none: "pb-safe-offset",
};

export function PageShell({
  children,
  className = "",
  bottomPad = "default",
}: PageShellProps) {
  return (
    <main
      className={`page-shell mx-auto min-h-dvh w-full max-w-lg px-4 py-6 pt-safe-offset sm:px-5 ${bottomPadClass[bottomPad]} ${className}`}
    >
      {children}
    </main>
  );
}
