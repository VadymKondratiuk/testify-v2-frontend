import { api } from "@/shared/api/axios";
import { TestCardData, type Difficulty } from "@/shared/types/testCardData.types";

type BackendDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

type BackendRecommendedTest = {
  id: string;
  title: string;
  description?: string | null;
  difficulty: BackendDifficulty;
  timeLimit?: number | null;
  averageRating?: number | null;
  reason: string;
  matchedTags: string[];
  recommendationType: "knowledge_gap" | "next_level" | "popular";
  category?: {
    id: string;
    name: string;
  } | null;
  _count?: {
    questions?: number;
    attempts?: number;
    ratings?: number;
  };
};

type RecommendationsResponse = {
  items: BackendRecommendedTest[];
  meta: {
    placement: string;
    total: number;
  };
};

export type RecommendedTest = TestCardData & {
  reason: string;
  matchedTags: string[];
  recommendationType: "knowledge_gap" | "next_level" | "popular";
};

function toUiDifficulty(difficulty: BackendDifficulty): Difficulty {
  switch (difficulty) {
    case "ADVANCED":
      return "Advanced";
    case "INTERMEDIATE":
      return "Intermediate";
    case "BEGINNER":
    default:
      return "Beginner";
  }
}

function mapRecommendedTest(test: BackendRecommendedTest): RecommendedTest {
  return {
    id: test.id,
    category: test.category?.name ?? "Uncategorized",
    title: test.title,
    difficulty: toUiDifficulty(test.difficulty),
    duration: test.timeLimit ? `${test.timeLimit} mins` : "No limit",
    questions: test._count?.questions ?? 0,
    description: test.description ?? "No description provided.",
    rating: test.averageRating ?? 0,
    reason: test.reason,
    matchedTags: test.matchedTags,
    recommendationType: test.recommendationType,
  };
}

export async function getRecommendedTests(
  placement: "catalog" | "profile" | "result",
  limit: number,
) {
  const { data } = await api.get<RecommendationsResponse>("/recommendations/tests", {
    params: {
      placement,
      limit,
    },
  });

  return data.items.map(mapRecommendedTest);
}
