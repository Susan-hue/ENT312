export const SELECTED_SECTION_KEY = "ent312-selected-section";

export type SectionId = "textbook" | "pdf";

export function sessionStorageKey(sectionId: string): string {
  return `${sectionId}_ent312-quiz-session`;
}

export function getSelectedSectionId(): SectionId | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SELECTED_SECTION_KEY);
  if (raw === "textbook" || raw === "pdf") return raw;
  return null;
}

export function setSelectedSectionId(sectionId: SectionId): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SELECTED_SECTION_KEY, sectionId);
}

export function clearSelectedSectionId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SELECTED_SECTION_KEY);
}
