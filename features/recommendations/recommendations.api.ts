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
  weaknessDetails: RecommendationWeaknessDetail[];
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
  weaknessDetails: RecommendationWeaknessDetail[];
  recommendationType: "knowledge_gap" | "next_level" | "popular";
};

export type RecommendationWeaknessDetail = {
  tagId: string;
  tag: string;
  attemptsCount: number;
  correctCount: number;
  wrongCount: number;
  masteryScore: number;
  weaknessScore: number;
};

export type RecommendationPlacement = "catalog" | "profile" | "result";
export type RecommendationEventType =
  | "recommendation_shown"
  | "recommendation_clicked"
  | "recommendation_started"
  | "recommendation_completed";

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
    weaknessDetails: test.weaknessDetails ?? [],
    recommendationType: test.recommendationType,
  };
}

export async function getRecommendedTests(
  placement: RecommendationPlacement,
  limit: number,
) {
  const { data } = await api.get<RecommendationsResponse>("/recommendations/tests", {
    params: {
      placement,
      limit,
    },
    skipAuthRedirect: true,
  });

  return data.items.map(mapRecommendedTest);
}

export async function trackRecommendationEvent({
  testId,
  placement,
  eventType,
  source,
  metadata,
}: {
  testId: string;
  placement: RecommendationPlacement;
  eventType: RecommendationEventType;
  source?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await api.post("/recommendations/events", {
      testId,
      placement,
      eventType,
      source,
      metadata,
    }, { skipAuthRedirect: true });
  } catch {
    // Telemetry must never block the learning flow.
  }
}
