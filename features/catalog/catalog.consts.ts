// src/components/catalog/filters/constants.ts

import { Difficulty } from "./catalog.types";

export const DIFFICULTY_OPTIONS = [
  "All Levels",
  "Beginner",
  "Intermediate",
  "Advanced / Pro"
];

export const DURATION_RANGES = [
  "< 15 mins",
  "15 – 30 mins",
  "31 – 60 mins",
  "> 60 mins"
];

export const QUESTION_RANGES = [
  "1 – 10 q.",
  "11 – 30 q.",
  "31 – 50 q.",
  "50+ q."
];

export const RATING_OPTIONS = [
  "Any",
  "3★ & above",
  "4★ & above",
  "5★ only"
];

// ── Difficulty pill styles ────────────────────────────────────
export const difficultyStyles: Record<Difficulty, string> = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-orange-50 text-orange-700",
  Advanced: "bg-red-50 text-red-700",
};