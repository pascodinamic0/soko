const DRAFT_KEY = "soko-publish-draft";

export type PublishDraft = {
  step: number;
  title: string;
  description: string;
  price: string;
  currency: "USD" | "CDF";
  negociable: boolean;
  categoryId: string;
  subcategoryId: string;
  locationId: string;
  photoNames: string[];
};

export const emptyDraft = (): PublishDraft => ({
  step: 0,
  title: "",
  description: "",
  price: "",
  currency: "USD",
  negociable: false,
  categoryId: "",
  subcategoryId: "",
  locationId: "",
  photoNames: [],
});

export function loadDraft(): PublishDraft {
  if (typeof window === "undefined") return emptyDraft();
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return emptyDraft();
    return { ...emptyDraft(), ...JSON.parse(raw) };
  } catch {
    return emptyDraft();
  }
}

export function saveDraft(draft: PublishDraft) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DRAFT_KEY);
}
