import { Difficulty } from "@/shared/types/testCardData.types";

export const DIFFICULTY_OPTIONS = [
  "All Levels",
  "Beginner",
  "Intermediate",
  "Advanced / Pro",
] as const;

export const DURATION_RANGES = [
  "< 15 mins",
  "15 - 30 mins",
  "31 - 60 mins",
  "> 60 mins",
] as const;

export const QUESTION_RANGES = [
  "1 - 10 q.",
  "11 - 30 q.",
  "31 - 50 q.",
  "50+ q.",
] as const;

export const RATING_OPTIONS = [
  "Any",
  "3+ stars",
  "4+ stars",
  "5 stars only",
] as const;

export const SORT_OPTIONS = [
  { label: "Most Popular", value: "most_popular" },
  { label: "Newest First", value: "newest_first" },
  { label: "Highest Rated", value: "highest_rated" },
  { label: "Shortest First", value: "shortest_first" },
  { label: "A to Z", value: "a_to_z" },
] as const;

export type CatalogSort = (typeof SORT_OPTIONS)[number]["value"];

export const difficultyStyles: Record<Difficulty, string> = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-orange-50 text-orange-700",
  Advanced: "bg-red-50 text-red-700",
};
